import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { paymentLogger } from "@/utils/paymentLogger";

export default function PaymentFailure() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    paymentLogger.log('Payment failure page loaded', params);
    
    toast({
      title: "Payment Failed",
      description: "There was an issue processing your payment. Please try again.",
      variant: "destructive",
    });
  }, [toast, searchParams]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Payment Failed</h1>
        <p className="text-gray-600 mb-8">
          There was an issue processing your payment. Please try again or contact support if the issue persists.
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate(-1)}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}