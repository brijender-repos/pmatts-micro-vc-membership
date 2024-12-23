import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KYCWizard } from "./kyc/KYCWizard";
import { KYCStatus } from "./kyc/KYCStatus";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

export function KYCSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [kycDetails, setKYCDetails] = useState<any>(null);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    loadKYCDetails();
  }, []);

  const loadKYCDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('kyc_details')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setKYCDetails(data);
    } catch (error) {
      console.error('Error loading KYC details:', error);
      toast({
        title: "Error",
        description: "Failed to load KYC details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step: number) => {
    if (!kycDetails) return 'pending';
    
    switch (step) {
      case 1: // Aadhar
        return kycDetails.aadhar_number ? 'completed' : 'pending';
      case 2: // PAN
        return kycDetails.pan_number ? 'completed' : 'pending';
      case 3: // Verification
        return kycDetails.status === 'verification_pending' ? 'completed' : 'pending';
      case 4: // KYC Status
        return kycDetails.status === 'verified' ? 'completed' : 'pending';
      default:
        return 'pending';
    }
  };

  const WorkflowStep = ({ number, label, isLast = false }: { number: number; label: string; isLast?: boolean }) => {
    const status = getStepStatus(number);
    return (
      <div className="flex items-center">
        <div className="flex flex-col items-center">
          {status === 'completed' ? (
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          ) : (
            <Circle className="h-8 w-8 text-muted-foreground" />
          )}
          <span className="mt-2 text-sm font-medium">{label}</span>
        </div>
        {!isLast && (
          <ArrowRight className="h-6 w-6 mx-4 text-muted-foreground" />
        )}
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>KYC Verification</CardTitle>
        <CardDescription>
          Complete your KYC verification to access all features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center py-6 bg-muted/50 rounded-lg">
          <div className="flex items-center">
            <WorkflowStep number={1} label="Aadhar" />
            <WorkflowStep number={2} label="PAN" />
            <WorkflowStep number={3} label="Verification" />
            <WorkflowStep number={4} label="KYC Status" isLast />
          </div>
        </div>

        {showWizard ? (
          <KYCWizard
            onComplete={() => {
              setShowWizard(false);
              loadKYCDetails();
            }}
            onCancel={() => setShowWizard(false)}
          />
        ) : (
          <div className="space-y-4">
            <KYCStatus kycDetails={kycDetails} />
            {(!kycDetails || kycDetails.status === 'not_started' || kycDetails.status === 'rejected') && (
              <Button onClick={() => setShowWizard(true)}>
                {kycDetails?.status === 'rejected' ? 'Retry KYC Verification' : 'Start KYC Verification'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}