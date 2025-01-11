import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";

interface TransactionProofRowProps {
  proof: {
    id: string;
    transaction_date: string;
    transaction_amount: number;
    payment_mode: string;
    file_url: string;
  };
  onEdit: (proof: any) => void;
  onDelete: (proofId: string) => void;
}

export function TransactionProofRow({ proof, onEdit, onDelete }: TransactionProofRowProps) {
  return (
    <TableRow>
      <TableCell>
        {new Date(proof.transaction_date).toLocaleDateString()}
      </TableCell>
      <TableCell>₹{proof.transaction_amount.toLocaleString('en-IN')}</TableCell>
      <TableCell>{proof.payment_mode}</TableCell>
      <TableCell>
        <a
          href={proof.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
        >
          View
          <ExternalLink className="h-4 w-4" />
        </a>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(proof)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(proof.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}