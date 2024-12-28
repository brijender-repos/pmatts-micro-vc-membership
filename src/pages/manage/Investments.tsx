import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { InvestmentsTable } from "@/components/manage/investments/InvestmentsTable";
import { InvestmentsFilters } from "@/components/manage/investments/InvestmentsFilters";
import { ManageInvestment } from "@/components/manage/investments/ManageInvestment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import type { InvestmentWithUser } from "@/types/investment";
import { Download } from "lucide-react";
import ExcelJS from 'exceljs';

export default function Investments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState("all");
  const [sortField, setSortField] = useState<"investment_date" | "full_name">("investment_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("name")
        .order("name");
      if (error) {
        toast.error("Failed to load projects");
        throw error;
      }
      return data;
    },
  });

  const { data: investments, isLoading } = useQuery({
    queryKey: ["investments", searchTerm, selectedProject, sortField, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from("investments")
        .select(`
          id,
          project_name,
          investment_type,
          investment_date,
          amount,
          units,
          user_id,
          transaction_status,
          profiles (
            full_name,
            email,
            phone
          )
        `);

      if (selectedProject !== "all") {
        query = query.eq("project_name", selectedProject);
      }

      if (searchTerm) {
        query = query.or(`profiles.full_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%,profiles.phone.ilike.%${searchTerm}%`);
      }

      if (sortField === "full_name") {
        query = query.order("profiles(full_name)", { ascending: sortOrder === "asc" });
      } else {
        query = query.order(sortField, { ascending: sortOrder === "asc" });
      }

      const { data, error } = await query;
      
      if (error) {
        toast.error("Failed to load investments");
        throw error;
      }
      
      return data as InvestmentWithUser[];
    },
  });

  const toggleSort = (field: "investment_date" | "full_name") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const paginatedInvestments = investments?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = investments ? Math.ceil(investments.length / pageSize) : 0;

  const downloadExcel = async () => {
    if (!investments?.length) {
      toast.error("No investments data available");
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Investments');

    // Define columns
    worksheet.columns = [
      { header: 'Date', key: 'date', width: 15 },
      { header: 'Investor Name', key: 'investor_name', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Phone', key: 'phone', width: 15 },
      { header: 'Project', key: 'project', width: 20 },
      { header: 'Type', key: 'type', width: 15 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Units', key: 'units', width: 10 },
      { header: 'Equity %', key: 'equity', width: 10 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Payment Mode', key: 'payment_mode', width: 15 },
      { header: 'Transaction ID', key: 'transaction_id', width: 20 },
      { header: 'Notes', key: 'notes', width: 30 },
      { header: 'Created At', key: 'created_at', width: 15 },
      { header: 'Updated At', key: 'updated_at', width: 15 },
    ];

    // Add data rows
    investments.forEach(investment => {
      worksheet.addRow({
        date: new Date(investment.investment_date).toLocaleDateString(),
        investor_name: investment.profiles?.full_name || 'N/A',
        email: investment.profiles?.email || 'N/A',
        phone: investment.profiles?.phone || 'N/A',
        project: investment.project_name,
        type: investment.investment_type.replace('_', ' '),
        amount: investment.amount,
        units: investment.units || 'N/A',
        equity: investment.equity_percentage || 'N/A',
        status: investment.transaction_status,
        payment_mode: investment.payment_mode || 'N/A',
        transaction_id: investment.transaction_id || 'N/A',
        notes: investment.notes || 'N/A',
        created_at: new Date(investment.created_at).toLocaleDateString(),
        updated_at: new Date(investment.updated_at).toLocaleDateString(),
      });
    });

    // Style the header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };

    // Generate the file
    const date = new Date().toISOString().split('T')[0];
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `investments_${date}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
    toast.success("Excel file downloaded successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investments</h1>
          <p className="text-muted-foreground">
            View and manage all investments made by users
          </p>
        </div>
        <Button
          onClick={downloadExcel}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download Excel
        </Button>
      </div>

      <InvestmentsFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedProject={selectedProject}
        onProjectChange={setSelectedProject}
        projects={projects}
        pageSize={pageSize}
        onPageSizeChange={(value) => {
          setPageSize(value);
          setCurrentPage(1);
        }}
      />

      <InvestmentsTable
        investments={paginatedInvestments}
        isLoading={isLoading}
        toggleSort={toggleSort}
        onManageInvestment={setSelectedInvestmentId}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      <Dialog open={!!selectedInvestmentId} onOpenChange={() => setSelectedInvestmentId(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Manage Investment</DialogTitle>
          </DialogHeader>
          {selectedInvestmentId && (
            <ManageInvestment investmentId={selectedInvestmentId} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
