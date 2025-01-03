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
    return new Response(null, { 
      headers: corsHeaders,
      status: 204,
    })
  }

  try {
    console.log('Received payment request');
    
    const requestData = await req.json() as PaymentRequest;
    console.log('Payment request data:', requestData);

    // Create Supabase client with auth context
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    )

    const { user_id, project_name, units, notes } = requestData;
    const amount = units * 116 // INR 116 per unit

    console.log('Calculated amount:', { units, amount });

    // Validate units
    if (units <= 0 || units > 5) {
      console.error('Invalid units:', units);
      return new Response(
        JSON.stringify({ error: 'Invalid number of units. Must be between 1 and 5.' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 400 
        }
      )
    }

    // Get user details
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('full_name, phone')
      .eq('id', user_id)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Error fetching user profile' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    console.log('Retrieved user profile:', profile);

    // Save initial investment record using the authenticated client
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
      console.error('Error creating investment:', investmentError);
      return new Response(
        JSON.stringify({ error: 'Error creating investment record' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    console.log('Created investment record:', investment);

    const transactionId = `txn_${investment.id}_${Date.now()}`

    // Update transaction ID
    const { error: updateError } = await supabaseClient
      .from('investments')
      .update({ transaction_id: transactionId })
      .eq('id', investment.id)

    if (updateError) {
      console.error('Error updating transaction ID:', updateError);
      return new Response(
        JSON.stringify({ error: 'Error updating transaction ID' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    console.log('Updated transaction ID:', transactionId);

    // Get user email
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    
    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return new Response(
        JSON.stringify({ error: 'Error fetching user details' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    console.log('Retrieved user details:', { email: user.email });

    const merchantKey = Deno.env.get('PAYU_MERCHANT_KEY')
    const merchantSalt = Deno.env.get('PAYU_MERCHANT_SALT')
    const baseUrl = req.headers.get('origin') || 'https://pmatts-micro-vc-membership.lovable.app'

    if (!merchantKey || !merchantSalt) {
      console.error('Missing PayU configuration');
      return new Response(
        JSON.stringify({ error: 'Missing payment gateway configuration' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 500 
        }
      )
    }

    // Prepare PayU payment data for live mode
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

    console.log('Payment data prepared:', { 
      ...paymentData, 
      key: '***', 
      amount: amount,
      surl: paymentData.surl,
      furl: paymentData.furl
    });

    // Generate hash for live mode
    const hashString = `${paymentData.key}|${paymentData.txnid}|${paymentData.amount}|${paymentData.productinfo}|${paymentData.firstname}|${paymentData.email}|||||||||||${merchantSalt}`
    console.log('Hash string (without salt):', hashString.replace(merchantSalt, '***'));
    
    const hashBuffer = await crypto.subtle.digest(
      "SHA-512",
      new TextEncoder().encode(hashString)
    )
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    console.log('Generated hash:', hash);
    console.log('Payment request processed successfully');

    return new Response(
      JSON.stringify({ ...paymentData, hash }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json'
        },
        status: 200
      }
    )
  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    )
  }
})