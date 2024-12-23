import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KYCWizard } from "./kyc/KYCWizard";
import { KYCStatus } from "./kyc/KYCStatus";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

interface KYCSettingsProps {
  onStatusChange?: () => void;
}

export function KYCSettings({ onStatusChange }: KYCSettingsProps) {
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
      onStatusChange?.();
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
            <div className="rounded-full bg-green-100 p-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
          ) : (
            <div className="rounded-full bg-gray-100 p-2">
              <Circle className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <span className="mt-2 text-sm font-medium text-gray-700">{label}</span>
        </div>
        {!isLast && (
          <div className="flex-1 mx-4">
            <div className={`h-1 ${status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`} />
          </div>
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
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center">
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
              <Button 
                onClick={() => setShowWizard(true)}
                className="w-full"
              >
                {kycDetails?.status === 'rejected' ? 'Retry KYC Verification' : 'Start KYC Verification'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}