import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

interface InvestmentWithUser {
  id: string;
  project_name: string;
  investment_type: "investment" | "follow_on" | "distribution" | "exit" | "dividend";
  investment_date: string;
  amount: number;
  units: number | null;
  user_id: string;
  transaction_status: string;
  profiles: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
  };
}

export default function Investments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [sortField, setSortField] = useState<"investment_date" | "full_name">("investment_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [pageSize, setPageSize] = useState<number>(100);
  const [currentPage, setCurrentPage] = useState(1);

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

      if (selectedProject) {
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
      if (error) throw error;
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

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 gap-4">
          <Input
            placeholder="Search by investor name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Projects</SelectItem>
              {projects?.map((project) => (
                <SelectItem key={project.name} value={project.name}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            setPageSize(Number(value));
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Records per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="100">100 per page</SelectItem>
            <SelectItem value="500">500 per page</SelectItem>
            <SelectItem value="999999">Show all</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("investment_date")}
                  className="flex items-center gap-2"
                >
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("full_name")}
                  className="flex items-center gap-2"
                >
                  Investor
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : paginatedInvestments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No investments found
                </TableCell>
              </TableRow>
            ) : (
              paginatedInvestments?.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>
                    {format(new Date(investment.investment_date), "PP")}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{investment.profiles?.full_name || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">
                        {investment.profiles?.email}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {investment.profiles?.phone || "No phone"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{investment.project_name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {investment.investment_type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(investment.amount)}</TableCell>
                  <TableCell>{investment.units || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        investment.transaction_status === "completed"
                          ? "default"
                          : investment.transaction_status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {investment.transaction_status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
    </div>
  );
}