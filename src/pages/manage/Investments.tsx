import { useInvestments } from "@/hooks/useInvestments";
import { Button } from "@/components/ui/button";
import { InvestmentsTable } from "@/components/manage/investments/InvestmentsTable";
import { InvestmentsFilters } from "@/components/manage/investments/InvestmentsFilters";
import { InvestmentsExport } from "@/components/manage/investments/InvestmentsExport";
import { ManageInvestment } from "@/components/manage/investments/ManageInvestment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Investments() {
  const {
    searchTerm,
    setSearchTerm,
    selectedProject,
    setSelectedProject,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    selectedInvestmentId,
    setSelectedInvestmentId,
    projects,
    investments,
    paginatedInvestments,
    isLoading,
    toggleSort,
    totalPages,
  } = useInvestments();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Investments</h1>
          <p className="text-muted-foreground">
            View and manage all investments made by users
          </p>
        </div>
        <InvestmentsExport investments={investments} />
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