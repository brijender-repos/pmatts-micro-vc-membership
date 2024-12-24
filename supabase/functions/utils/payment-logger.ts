export const paymentLogger = {
  log(action: string, data: Record<string, any>) {
    // Log to Edge Function logs
    console.log(`Payment Log [${action}]:`, JSON.stringify(data));
  }
};