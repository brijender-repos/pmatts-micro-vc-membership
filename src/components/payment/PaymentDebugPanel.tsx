import { useEffect, useState } from 'react';
import { paymentLogger } from '@/utils/paymentLogger';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export function PaymentDebugPanel() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Load initial logs
    const storedLogs = localStorage.getItem('payment_logs');
    if (storedLogs) {
      setLogs(JSON.parse(storedLogs));
    }

    // Update logs when new ones are added
    const interval = setInterval(() => {
      const currentLogs = paymentLogger.getLogs();
      setLogs([...currentLogs]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return (
      <Button 
        className="fixed bottom-4 right-4 z-50"
        onClick={() => setIsVisible(true)}
      >
        Show Debug Panel
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-96 bg-white border rounded-lg shadow-lg z-50 p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Payment Debug Logs</h3>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => paymentLogger.clearLogs()}
          >
            Clear
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsVisible(false)}
          >
            Hide
          </Button>
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-4rem)]">
        {logs.map((log, index) => (
          <div key={index} className="mb-4 text-sm">
            <div className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString()}</div>
            <div className="font-medium">{log.action}</div>
            <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-x-auto">
              {JSON.stringify(log.data, null, 2)}
            </pre>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}