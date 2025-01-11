import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionProofRow } from "./TransactionProofRow";

interface TransactionProofsTableProps {
  proofs: any[];
  onEdit: (proof: any) => void;
  onDelete: (proofId: string) => void;
}

export function TransactionProofsTable({ proofs, onEdit, onDelete }: TransactionProofsTableProps) {
  if (!proofs?.length) {
    return <div>No transaction proofs uploaded yet.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Payment Mode</TableHead>
          <TableHead>File</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proofs.map((proof) => (
          <TransactionProofRow
            key={proof.id}
            proof={proof}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}