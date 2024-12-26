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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Investments</h1>
        <p className="text-muted-foreground">
          View and manage all investments made by users
        </p>
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