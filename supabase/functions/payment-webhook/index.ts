import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PayUResponse {
  mihpayid?: string;
  mode?: string;
  status?: string;
  key?: string;
  txnid?: string;
  amount?: string;
  addedon?: string;
  productinfo?: string;
  firstname?: string;
  email?: string;
  phone?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  hash?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Received PayU webhook event');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get the request path to determine the event type
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    console.log('Webhook event type:', path);

    // Parse both body and query parameters
    const formData = await req.formData();
    const queryParams = url.searchParams;
    
    // Combine form data and query parameters
    const payUResponse: PayUResponse = {
      mihpayid: formData.get('mihpayid')?.toString() || queryParams.get('mihpayid') || undefined,
      mode: formData.get('mode')?.toString() || queryParams.get('mode') || undefined,
      status: formData.get('status')?.toString() || queryParams.get('status') || undefined,
      key: formData.get('key')?.toString() || queryParams.get('key') || undefined,
      txnid: formData.get('txnid')?.toString() || queryParams.get('txnid') || undefined,
      amount: formData.get('amount')?.toString() || queryParams.get('amount') || undefined,
      addedon: formData.get('addedon')?.toString() || queryParams.get('addedon') || undefined,
      productinfo: formData.get('productinfo')?.toString() || queryParams.get('productinfo') || undefined,
      firstname: formData.get('firstname')?.toString() || queryParams.get('firstname') || undefined,
      email: formData.get('email')?.toString() || queryParams.get('email') || undefined,
      phone: formData.get('phone')?.toString() || queryParams.get('phone') || undefined,
      udf1: formData.get('udf1')?.toString() || queryParams.get('udf1') || undefined,
      udf2: formData.get('udf2')?.toString() || queryParams.get('udf2') || undefined,
      udf3: formData.get('udf3')?.toString() || queryParams.get('udf3') || undefined,
      hash: formData.get('hash')?.toString() || queryParams.get('hash') || undefined,
    };

    console.log('PayU response data:', {
      ...payUResponse,
      hash: '***' // Mask hash in logs
    });

    // Update transaction status based on the webhook event type
    let transactionStatus = 'initiated';
    switch(path) {
      case 'successful':
        transactionStatus = 'success';
        break;
      case 'failed':
        transactionStatus = 'failure';
        break;
      case 'refund':
        transactionStatus = 'refunded';
        break;
      case 'dispute':
        transactionStatus = 'disputed';
        break;
      default:
        console.log('Unknown webhook event type:', path);
        return new Response(
          JSON.stringify({ error: 'Invalid webhook event type' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
    }

    // Update investment status if transaction ID exists
    if (payUResponse.txnid) {
      const { error: updateError } = await supabaseClient
        .from('investments')
        .update({ 
          transaction_status: transactionStatus,
          notes: `Payment ${transactionStatus} - PayU ID: ${payUResponse.mihpayid}`,
        })
        .eq('transaction_id', payUResponse.txnid);

      if (updateError) {
        console.error('Error updating investment:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error updating investment status' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }
    }

    console.log('Successfully processed PayU webhook');

    return new Response(
      JSON.stringify({ message: 'Payment processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});