import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { TransactionProofForm } from "./TransactionProofForm";
import { FileUploader } from "./FileUploader";

interface TransactionProofDialogProps {
  investmentId: string;
  onUploadComplete: (fileUrl: string) => void;
  form: UseFormReturn<any>;
}

export function TransactionProofDialog({ 
  investmentId, 
  onUploadComplete,
  form 
}: TransactionProofDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Proof
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Transaction Proof</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6">
            <TransactionProofForm form={form} />
            <FileUploader 
              investmentId={investmentId}
              onUploadComplete={onUploadComplete}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}