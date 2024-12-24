import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const formData = await req.formData()
    const txnid = formData.get('txnid')
    const status = formData.get('status')
    const hash = formData.get('hash')

    // Verify hash (implement according to PayU documentation)
    const merchantKey = Deno.env.get('PAYU_MERCHANT_KEY')
    const merchantSalt = Deno.env.get('PAYU_MERCHANT_SALT')

    if (!txnid || !status || !hash || !merchantKey || !merchantSalt) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Update investment status
    const { error: updateError } = await supabaseClient
      .from('investments')
      .update({ 
        notes: `Payment ${status}`,
      })
      .eq('transaction_id', txnid)

    if (updateError) {
      console.error('Error updating investment:', updateError)
      return new Response(
        JSON.stringify({ error: 'Error updating investment status' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Payment status updated successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})