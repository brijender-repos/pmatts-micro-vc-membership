import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { KYCWizard } from "./kyc/KYCWizard";
import { KYCStatus } from "./kyc/KYCStatus";

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