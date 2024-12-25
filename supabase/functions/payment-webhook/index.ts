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
  lastname?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  email?: string;
  phone?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  card_token?: string;
  card_no?: string;
  bank_ref_no?: string;
  bank_ref_num?: string;
  bankcode?: string;
  error?: string;
  error_Message?: string;
  net_amount_debit?: string;
  discount?: string;
  offer_key?: string;
  offer_availed?: string;
  unmappedstatus?: string;
  hash?: string;
  payment_source?: string;
  PG_TYPE?: string;
  field0?: string;
  field1?: string;
  field2?: string;
  field3?: string;
  field4?: string;
  field5?: string;
  field6?: string;
  field7?: string;
  field8?: string;
  field9?: string;
  surl?: string;
  curl?: string;
  furl?: string;
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

    // Parse both form data and query parameters
    const formData = await req.formData();
    const queryParams = url.searchParams;
    
    // Helper function to get value from either formData or queryParams
    const getValue = (key: string): string | undefined => {
      return formData.get(key)?.toString() || queryParams.get(key) || undefined;
    };
    
    // Combine form data and query parameters
    const payUResponse: PayUResponse = {
      mihpayid: getValue('mihpayid'),
      mode: getValue('mode'),
      status: getValue('status'),
      key: getValue('key'),
      txnid: getValue('txnid'),
      amount: getValue('amount'),
      addedon: getValue('addedon'),
      productinfo: getValue('productinfo'),
      firstname: getValue('firstname'),
      lastname: getValue('lastname'),
      address1: getValue('address1'),
      address2: getValue('address2'),
      city: getValue('city'),
      state: getValue('state'),
      country: getValue('country'),
      zipcode: getValue('zipcode'),
      email: getValue('email'),
      phone: getValue('phone'),
      udf1: getValue('udf1'),
      udf2: getValue('udf2'),
      udf3: getValue('udf3'),
      udf4: getValue('udf4'),
      udf5: getValue('udf5'),
      card_token: getValue('card_token'),
      card_no: getValue('card_no'),
      bank_ref_no: getValue('bank_ref_no'),
      bank_ref_num: getValue('bank_ref_num'),
      bankcode: getValue('bankcode'),
      error: getValue('error'),
      error_Message: getValue('error_Message'),
      net_amount_debit: getValue('net_amount_debit'),
      discount: getValue('discount'),
      offer_key: getValue('offer_key'),
      offer_availed: getValue('offer_availed'),
      unmappedstatus: getValue('unmappedstatus'),
      hash: getValue('hash'),
      payment_source: getValue('payment_source'),
      PG_TYPE: getValue('PG_TYPE'),
      field0: getValue('field0'),
      field1: getValue('field1'),
      field2: getValue('field2'),
      field3: getValue('field3'),
      field4: getValue('field4'),
      field5: getValue('field5'),
      field6: getValue('field6'),
      field7: getValue('field7'),
      field8: getValue('field8'),
      field9: getValue('field9'),
      surl: getValue('surl'),
      curl: getValue('curl'),
      furl: getValue('furl'),
    };

    console.log('PayU response data:', {
      ...payUResponse,
      hash: '***', // Mask hash in logs
      card_no: '***', // Mask card number in logs
      card_token: '***', // Mask card token in logs
    });

    // Update transaction status based on the webhook event type and PayU status
    let transactionStatus = 'initiated';
    
    // First check the PayU status
    if (payUResponse.status?.toLowerCase() === 'success') {
      transactionStatus = 'success';
    } else if (payUResponse.status?.toLowerCase() === 'failure') {
      transactionStatus = 'failure';
    } else {
      // If no clear status, use the webhook path
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
    }

    // Update investment status if transaction ID exists
    if (payUResponse.txnid) {
      const notes = payUResponse.error === 'E000' 
        ? `Payment ${transactionStatus} - PayU ID: ${payUResponse.mihpayid}`
        : `Payment ${transactionStatus} - Error: ${payUResponse.error_Message} (${payUResponse.error})`;

      const { error: updateError } = await supabaseClient
        .from('investments')
        .update({ 
          transaction_status: transactionStatus,
          notes: notes,
        })
        .eq('transaction_id', payUResponse.txnid);

      if (updateError) {
        console.error('Error updating investment:', updateError);
        return new Response(
          JSON.stringify({ error: 'Error updating investment status' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
        );
      }

      console.log('Successfully updated investment status to:', transactionStatus);
    }

    console.log('Successfully processed PayU webhook');

    return new Response(
      JSON.stringify({ 
        message: 'Payment processed successfully',
        status: transactionStatus,
        txnid: payUResponse.txnid 
      }),
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