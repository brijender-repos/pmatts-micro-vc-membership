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
    console.log('Payment request received');
    
    const requestData = await req.json() as PaymentRequest;
    console.log('Payment request data:', requestData);

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { user_id, project_name, units, notes } = requestData;
    const amount = units * 100; // ₹100 per unit

    // Get user details
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user_id)
      .single();

    if (!profile) {
      throw new Error('User profile not found');
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
        notes: notes || 'Payment Initiated',
        transaction_status: 'initiated'
      }])
      .select()
      .single();

    if (investmentError) {
      throw investmentError;
    }

    // Get user email
    const { data: { user }, error: userError } = await supabaseClient.auth.admin.getUserById(user_id);
    
    if (userError || !user) {
      throw new Error('Error fetching user details');
    }

    const merchantKey = Deno.env.get('PAYU_MERCHANT_KEY');
    const merchantSalt = Deno.env.get('PAYU_MERCHANT_SALT');
    const baseUrl = req.headers.get('origin') || 'https://pmatts-micro-vc-membership.lovable.app';

    if (!merchantKey || !merchantSalt) {
      throw new Error('Missing PayU configuration');
    }

    const txnid = `txn_${investment.id}_${Date.now()}`;

    // Update transaction ID
    await supabaseClient
      .from('investments')
      .update({ transaction_id: txnid })
      .eq('id', investment.id);

    // Prepare PayU payment data
    const paymentData = {
      key: merchantKey,
      txnid: txnid,
      amount: amount.toString(),
      productinfo: project_name,
      firstname: profile.full_name || 'User',
      email: user.email,
      phone: profile.phone || '',
      surl: `${baseUrl}/payment/success`,
      furl: `${baseUrl}/payment/failure`,
      udf1: investment.id // Store investment ID for webhook reference
    };

    // Generate hash
    const hashString = `${paymentData.key}|${paymentData.txnid}|${paymentData.amount}|${paymentData.productinfo}|${paymentData.firstname}|${paymentData.email}|||||||||||${merchantSalt}`;
    const hashBuffer = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(hashString)
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    console.log('Generated payment data', { ...paymentData, hash: '***' });

    return new Response(
      JSON.stringify({ ...paymentData, hash }),
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