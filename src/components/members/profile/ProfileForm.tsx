import { UseFormReturn } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProfileFormValues } from "./types";

interface ProfileFormProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function ProfileForm({ form }: ProfileFormProps) {
  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your full name" 
                  {...field} 
                  readOnly
                  className="bg-muted"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your phone number" 
                  {...field} 
                  readOnly
                  className="bg-muted"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}