interface PaymentLog {
  timestamp: string;
  action: string;
  data: Record<string, any>;
}

export const paymentLogger = {
  logs: [] as PaymentLog[],

  log(action: string, data: Record<string, any>) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      data
    };
    
    // Add to memory array
    this.logs.push(logEntry);
    
    // Store in localStorage
    localStorage.setItem('payment_logs', JSON.stringify(this.logs));
    
    // Also console.log for immediate debugging
    console.log(`Payment Log [${action}]:`, data);
  },

  getLogs() {
    return this.logs;
  },

  clearLogs() {
    this.logs = [];
    localStorage.removeItem('payment_logs');
  }
};