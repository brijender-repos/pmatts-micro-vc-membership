import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePhoneUpdate(userId: string | undefined, onSuccess: () => void) {
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handlePhoneUpdate = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ phone: phoneNumber })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("Phone number updated successfully");
      setIsEditingPhone(false);
      onSuccess();
    } catch (error) {
      console.error("Error updating phone:", error);
      toast.error("Failed to update phone number");
    }
  };

  return {
    isEditingPhone,
    setIsEditingPhone,
    phoneNumber,
    setPhoneNumber,
    handlePhoneUpdate,
  };
}