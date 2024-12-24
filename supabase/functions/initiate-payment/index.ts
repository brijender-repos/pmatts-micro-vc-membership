import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentRequest {
  user_id: string;
  project_name: string;
  units: number;
  notes?: string;
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

    const { user_id, project_name, units, notes } = await req.json() as PaymentRequest
    const amount = units * 30000 // INR 30,000 per unit

    // Validate units
    if (units <= 0 || units > 5) {
      return new Response(
        JSON.stringify({ error: 'Invalid number of units. Must be between 1 and 5.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get user details
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user_id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Error fetching user profile' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Save initial investment record
    const { data: investment, error: investmentError } = await supabaseClient
      .from('investments')
      .insert([
        {
          user_id,
          project_name,
          investment_type: 'investment',
          amount,
          units,
          notes: notes || 'Payment Initiated',
          transaction_id: null,
        },
      ])
      .select()
      .single()

    if (investmentError) {
      console.error('Error creating investment:', investmentError)
      return new Response(
        JSON.stringify({ error: 'Error creating investment record' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const transactionId = `txn_${investment.id}_${Date.now()}`

    // Update transaction ID
    await supabaseClient
      .from('investments')
      .update({ transaction_id: transactionId })
      .eq('id', investment.id)

    // Get user email from auth
    const { data: { user }, error: userError } = await supabaseClient.auth.admin.getUserById(user_id)
    
    if (userError || !user) {
      console.error('Error fetching user:', userError)
      return new Response(
        JSON.stringify({ error: 'Error fetching user details' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const merchantKey = Deno.env.get('PAYU_MERCHANT_KEY')
    const merchantSalt = Deno.env.get('PAYU_MERCHANT_SALT')
    const baseUrl = Deno.env.get('PUBLIC_SITE_URL')

    if (!merchantKey || !merchantSalt || !baseUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Prepare PayU payment data
    const paymentData = {
      key: merchantKey,
      txnid: transactionId,
      amount: amount.toString(),
      productinfo: project_name,
      firstname: profile.full_name || 'User',
      email: user.email,
      phone: profile.phone || '',
      surl: `${baseUrl}/payment/success`,
      furl: `${baseUrl}/payment/failure`,
    }

    // Generate hash
    const hashString = `${paymentData.key}|${paymentData.txnid}|${paymentData.amount}|${paymentData.productinfo}|${paymentData.firstname}|${paymentData.email}|||||||||||${merchantSalt}`
    const hashBuffer = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(hashString)
    )
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    return new Response(
      JSON.stringify({ ...paymentData, hash }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing payment:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})