import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { NomineeFormValues } from "./types";
import { cn } from "@/lib/utils";

interface NomineeFormProps {
  form: UseFormReturn<NomineeFormValues>;
  isEditing: boolean;
  onSubmit: (data: NomineeFormValues) => Promise<void>;
  onCancel: () => void;
}

export function NomineeForm({ form, isEditing, onSubmit, onCancel }: NomineeFormProps) {
  return (
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
                  <SelectTrigger className={cn(!isEditing ? "bg-muted" : "", "relative")}>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-popover z-[100]">
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
              onClick={onCancel}
            >
              Cancel
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}