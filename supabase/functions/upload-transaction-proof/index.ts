import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Parse the multipart form data
    const formData = await req.formData()
    const file = formData.get('file') as File
    const investmentId = formData.get('investmentId') as string

    console.log('Received upload request:', { fileName: file?.name, investmentId })

    if (!file || !investmentId) {
      console.error('Missing required fields:', { file: !!file, investmentId: !!investmentId })
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate a unique file path
    const fileExt = file.name.split('.').pop()
    const filePath = `${investmentId}/${crypto.randomUUID()}.${fileExt}`

    console.log('Uploading file to storage:', { filePath })

    // Upload file to storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('transaction_proofs')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      return new Response(
        JSON.stringify({ error: 'Failed to upload file', details: uploadError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    // Get the public URL for the uploaded file
    const { data: urlData } = await supabase.storage
      .from('transaction_proofs')
      .createSignedUrl(filePath, 60 * 60 * 24 * 7) // 7 days expiry

    if (!urlData?.signedUrl) {
      console.error('Failed to generate signed URL')
      return new Response(
        JSON.stringify({ error: 'Failed to generate file URL' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    console.log('File uploaded successfully, saving to database')

    // Save proof record in the database
    const { error: dbError } = await supabase
      .from('transaction_proofs')
      .insert({
        investment_id: investmentId,
        file_url: urlData.signedUrl,
        file_name: file.name,
      })

    if (dbError) {
      console.error('Database insert error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save proof metadata', details: dbError }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    console.log('Transaction proof saved successfully')

    return new Response(
      JSON.stringify({ 
        message: 'File uploaded successfully', 
        url: urlData.signedUrl,
        filePath 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})