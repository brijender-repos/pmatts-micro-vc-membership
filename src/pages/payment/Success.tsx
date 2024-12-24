import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { paymentLogger } from "@/utils/paymentLogger";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    paymentLogger.log('Payment success page loaded', params);
    
    toast({
      title: "Payment Successful",
      description: "Your investment has been processed successfully.",
    });
  }, [toast, searchParams]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-8">
          Your investment has been processed successfully. You can view your investment details in your portfolio.
        </p>
        <div className="space-x-4">
          <Button onClick={() => navigate("/members/portfolio")}>
            View Portfolio
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Return Home
          </Button>
        </div>
      </div>
    </div>
  );
}