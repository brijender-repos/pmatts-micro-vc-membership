import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { paymentLogger } from '../utils/payment-logger.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PaymentLinkRequest {
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
    const requestData = await req.json() as PaymentLinkRequest
    paymentLogger.log('Payment link request received', requestData)

    const { user_id, project_name, units, notes } = requestData
    const amount = units * 116 // ₹116 per unit

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user details
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user_id)
      .single()

    if (!profile) {
      throw new Error('User profile not found')
    }

    // Create initial investment record
    const { data: investment, error: investmentError } = await supabaseClient
      .from('investments')
      .insert([{
        user_id,
        project_name,
        investment_type: 'investment',
        amount,
        units,
        notes: notes || 'Payment Link Created',
        transaction_status: 'initiated'
      }])
      .select()
      .single()

    if (investmentError) {
      throw investmentError
    }

    // PayU Payment Link API parameters
    const paymentLinkData = {
      key: Deno.env.get('PAYU_MERCHANT_KEY'),
      txnid: `txn_${investment.id}_${Date.now()}`,
      amount: amount.toString(),
      productinfo: project_name,
      firstname: profile.full_name || 'User',
      phone: profile.phone || '',
      email: (await supabaseClient.auth.getUser()).data.user?.email,
      surl: `${req.headers.get('origin')}/payment/success`,
      furl: `${req.headers.get('origin')}/payment/failure`,
      curl: `${req.headers.get('origin')}/payment/cancel`,
      udf1: investment.id // Store investment ID for webhook reference
    }

    // Update investment with transaction ID
    await supabaseClient
      .from('investments')
      .update({ transaction_id: paymentLinkData.txnid })
      .eq('id', investment.id)

    // Call PayU API to create payment link
    const payuResponse = await fetch('https://api.payu.in/postservice/PayUBiz/createPaymentLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('PAYU_AUTH_TOKEN')}`
      },
      body: JSON.stringify(paymentLinkData)
    })

    const payuData = await payuResponse.json()
    paymentLogger.log('PayU payment link created', payuData)

    if (!payuData.status || payuData.status !== 'success') {
      throw new Error(payuData.message || 'Failed to create payment link')
    }

    // Format the payment URL to match PayU's format (https://pmny.in/PAYUMN/...)
    const paymentUrl = payuData.payment_link.replace('https://secure.payu.in', 'https://pmny.in')

    return new Response(
      JSON.stringify({ paymentUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    paymentLogger.log('Error creating payment link', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})