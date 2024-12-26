import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import type { InvestmentWithUser } from "@/types/investment";

interface InvestmentsExportProps {
  investments: InvestmentWithUser[] | undefined;
}

export function InvestmentsExport({ investments }: InvestmentsExportProps) {
  const downloadExcel = () => {
    // Create empty worksheet with headers even if no data
    const worksheet = XLSX.utils.json_to_sheet(
      investments?.length ? investments.map((investment) => ({
        "Date": new Date(investment.investment_date).toLocaleDateString(),
        "Investor Name": investment.profiles?.full_name || "N/A",
        "Email": investment.profiles?.email || "N/A",
        "Phone": investment.profiles?.phone || "N/A",
        "Project": investment.project_name,
        "Type": investment.investment_type.replace("_", " "),
        "Amount": investment.amount,
        "Units": investment.units || "N/A",
        "Status": investment.transaction_status,
      })) : [],
      {
        header: [
          "Date",
          "Investor Name",
          "Email",
          "Phone",
          "Project",
          "Type",
          "Amount",
          "Units",
          "Status"
        ]
      }
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Investments");

    // Generate filename with current date
    const date = new Date().toISOString().split('T')[0];
    const filename = `investments_${date}.xlsx`;

    XLSX.writeFile(workbook, filename);
    toast.success("Excel file downloaded successfully");
  };

  return (
    <Button
      onClick={downloadExcel}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Download Excel
    </Button>
  );
}