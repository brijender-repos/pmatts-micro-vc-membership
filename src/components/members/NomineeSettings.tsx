import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NomineeFormValues {
  full_name: string;
  date_of_birth: string;
  relationship: string;
}

export function NomineeSettings() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<NomineeFormValues>({
    defaultValues: {
      full_name: "",
      date_of_birth: "",
      relationship: "",
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
        // Update existing nominee
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
        // Insert new nominee
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name (as per Aadhar)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter nominee's full name" 
                      {...field} 
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      readOnly={!isEditing}
                      className={!isEditing ? "bg-muted" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="relationship"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relationship</FormLabel>
                  <Select
                    disabled={!isEditing}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className={!isEditing ? "bg-muted" : ""}>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Husband">Husband</SelectItem>
                      <SelectItem value="Wife">Wife</SelectItem>
                      <SelectItem value="Son">Son</SelectItem>
                      <SelectItem value="Daughter">Daughter</SelectItem>
                      <SelectItem value="Father">Father</SelectItem>
                      <SelectItem value="Mother">Mother</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isEditing && (
              <div className="flex space-x-2">
                <Button type="submit">
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}