import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { FormFields } from "../AdminInvestmentFormFields";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectNameFieldProps {
  form: UseFormReturn<FormFields>;
}

export function ProjectNameField({ form }: ProjectNameFieldProps) {
  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("name")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  return (
    <FormField
      control={form.control}
      name="project_name"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Project Name</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem key={project.name} value={project.name}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}