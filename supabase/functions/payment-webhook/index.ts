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
    console.log('Received PayU webhook event');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const formData = await req.formData()
    const txnid = formData.get('txnid')
    const status = formData.get('status')
    const hash = formData.get('hash')
    const error = formData.get('error')
    const errorMessage = formData.get('error_Message')
    const unmappedstatus = formData.get('unmappedstatus')

    console.log('PayU webhook data:', {
      txnid,
      status,
      unmappedstatus,
      error: error || errorMessage,
    });

    // Verify hash (implement according to PayU documentation)
    const merchantKey = Deno.env.get('PAYU_MERCHANT_KEY')
    const merchantSalt = Deno.env.get('PAYU_MERCHANT_SALT')

    if (!txnid || !status || !hash || !merchantKey || !merchantSalt) {
      console.error('Missing required parameters');
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Map PayU status to our transaction status
    let transactionStatus = 'initiated'
    switch(unmappedstatus || status) {
      case 'success':
      case 'captured':
        transactionStatus = 'success'
        break
      case 'failure':
      case 'failed':
        transactionStatus = 'failure'
        break
      case 'bounced':
        transactionStatus = 'bounced'
        break
      case 'userCancelled':
        transactionStatus = 'cancelled'
        break
      case 'userDropped':
        transactionStatus = 'dropped'
        break
      case 'auto_refund':
        transactionStatus = 'auto_refund'
        break
      case 'refund_success':
        transactionStatus = 'refund_success'
        break
      case 'refund_pending':
        transactionStatus = 'refund_pending'
        break
      case 'refund_failed':
        transactionStatus = 'refund_failed'
        break
      case 'in_progress':
        transactionStatus = 'in_progress'
        break
      default:
        if (error || errorMessage) {
          transactionStatus = 'failure'
        }
    }

    console.log('Updating transaction status to:', transactionStatus);

    // Update investment status
    const { error: updateError } = await supabaseClient
      .from('investments')
      .update({ 
        transaction_status: transactionStatus,
        notes: error || errorMessage || `Payment ${status}`,
      })
      .eq('transaction_id', txnid)

    if (updateError) {
      console.error('Error updating investment:', updateError)
      return new Response(
        JSON.stringify({ error: 'Error updating investment status' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Dispatch custom event for frontend notification
    const event = new CustomEvent('payu_callback', {
      detail: {
        status: transactionStatus,
        message: error || errorMessage || `Payment ${status}`,
      },
    });
    window.dispatchEvent(event);

    console.log('Successfully processed PayU webhook');

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