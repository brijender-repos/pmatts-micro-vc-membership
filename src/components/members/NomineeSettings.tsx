import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NomineeForm } from "./nominee/NomineeForm";
import { NomineeFormValues } from "./nominee/types";
import { cn } from "@/lib/utils";

export function NomineeSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<NomineeFormValues>({
    defaultValues: {
      full_name: "",
      date_of_birth: "",
      relationship: "Other",
    },
  });

  useEffect(() => {
    loadNomineeDetails();
  }, []);

  const loadNomineeDetails = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: nominee } = await supabase
        .from('nominees')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (nominee) {
        form.reset({
          full_name: nominee.full_name,
          date_of_birth: nominee.date_of_birth,
          relationship: nominee.relationship,
        });
      }
    } catch (error) {
      console.error('Error loading nominee details:', error);
      toast({
        title: "Error",
        description: "Failed to load nominee details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: NomineeFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existingNominee } = await supabase
        .from('nominees')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingNominee) {
        const { error } = await supabase
          .from('nominees')
          .update({
            full_name: data.full_name,
            date_of_birth: data.date_of_birth,
            relationship: data.relationship,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingNominee.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('nominees')
          .insert({
            user_id: user.id,
            full_name: data.full_name,
            date_of_birth: data.date_of_birth,
            relationship: data.relationship,
          });

        if (error) throw error;
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Nominee details updated successfully",
      });
    } catch (error) {
      console.error('Error updating nominee details:', error);
      toast({
        title: "Error",
        description: "Failed to update nominee details",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Nominee Details</CardTitle>
            <CardDescription>
              Manage your nominee information.
            </CardDescription>
          </div>
          {!isEditing && (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit Nominee Details
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <NomineeForm 
          form={form}
          isEditing={isEditing}
          onSubmit={onSubmit}
          onCancel={() => {
            setIsEditing(false);
            form.reset();
          }}
        />
      </CardContent>
    </Card>
  );
}