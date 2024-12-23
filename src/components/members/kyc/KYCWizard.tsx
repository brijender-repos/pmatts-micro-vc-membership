import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AadharStep } from "./steps/AadharStep";
import { PANStep } from "./steps/PANStep";
import { SummaryStep } from "./steps/SummaryStep";

interface KYCWizardProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function KYCWizard({ onComplete, onCancel }: KYCWizardProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    aadhar: { number: "", name: "", imageUrl: "" },
    pan: { number: "", name: "", imageUrl: "" }
  });

  const handleStepComplete = async (stepData: any, stepNumber: number) => {
    try {
      const newFormData = {
        ...formData,
        [stepNumber === 1 ? 'aadhar' : 'pan']: stepData
      };
      setFormData(newFormData);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const status = stepNumber === 1 ? 'aadhar_submitted' : 'pan_submitted';
      
      const { error } = await supabase
        .from('kyc_details')
        .upsert({
          user_id: user.id,
          ...(stepNumber === 1 ? {
            aadhar_number: stepData.number,
            aadhar_name: stepData.name,
            aadhar_image_url: stepData.imageUrl,
            status
          } : {
            pan_number: stepData.number,
            pan_name: stepData.name,
            pan_image_url: stepData.imageUrl,
            status
          })
        });

      if (error) throw error;

      if (stepNumber === 1) {
        setStep(2);
      } else {
        // Mock API call for verification
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        await supabase
          .from('kyc_details')
          .update({ status: 'verification_pending' })
          .eq('user_id', user.id);

        setStep(3);
      }
    } catch (error) {
      console.error('Error saving KYC details:', error);
      toast({
        title: "Error",
        description: "Failed to save KYC details",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          {step === 1 && (
            <AadharStep onComplete={(data) => handleStepComplete(data, 1)} />
          )}
          {step === 2 && (
            <PANStep onComplete={(data) => handleStepComplete(data, 2)} />
          )}
          {step === 3 && (
            <SummaryStep formData={formData} onComplete={onComplete} />
          )}
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {step === 3 && (
              <Button onClick={onComplete}>
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}