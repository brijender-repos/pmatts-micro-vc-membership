import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InvestmentWithUser } from "@/types/investment";

export function useInvestments() {
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

  return {
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
  };
}