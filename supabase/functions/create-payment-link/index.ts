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
  investment_id: string;
  user_details: {
    name: string;
    email: string;
    phone: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Payment request received');
    
    const requestData = await req.json() as PaymentRequest;
    console.log('Payment request data:', requestData);

    const { user_id, project_name, units, notes, investment_id, user_details } = requestData;
    const amount = units * 100; // ₹100 per unit

    const merchantKey = Deno.env.get('PAYU_MERCHANT_KEY');
    const merchantSalt = Deno.env.get('PAYU_MERCHANT_SALT');
    const baseUrl = req.headers.get('origin') || 'https://pmatts-micro-vc-membership.lovable.app';

    if (!merchantKey || !merchantSalt) {
      throw new Error('Missing PayU configuration');
    }

    const txnid = `txn_${investment_id}_${Date.now()}`;

    // Update transaction ID in the investment record
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    await supabaseClient
      .from('investments')
      .update({ transaction_id: txnid })
      .eq('id', investment_id);

    // Required PayU parameters as per documentation
    const paymentData = {
      key: merchantKey,
      txnid: txnid,
      amount: amount.toString(),
      productinfo: project_name,
      firstname: user_details.name,
      email: user_details.email,
      phone: user_details.phone,
      surl: `${baseUrl}/payment/success`,
      furl: `${baseUrl}/payment/failure`,
      udf1: investment_id, // Store investment ID for webhook reference
      udf2: user_id, // Store user ID for reference
      udf3: notes || '', // Store notes
      service_provider: 'payu_paisa',
    };

    // Generate hash as per PayU documentation
    const hashString = `${paymentData.key}|${paymentData.txnid}|${paymentData.amount}|${paymentData.productinfo}|${paymentData.firstname}|${paymentData.email}|||||||||||${merchantSalt}`;
    const hashBuffer = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(hashString)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Construct the payment link URL with all parameters
    const params = new URLSearchParams({
      ...paymentData,
      hash: hash,
    });

    const paymentLink = `https://secure.payu.in/_payment?${params.toString()}`;
    console.log('Generated payment link:', paymentLink);

    return new Response(
      JSON.stringify({ payment_link: paymentLink }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error creating payment:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});