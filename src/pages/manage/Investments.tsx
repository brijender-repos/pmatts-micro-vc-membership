import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { Link } from "react-router-dom"

interface InvestmentWithUser {
  id: string;
  investment_date: string;
  project_name: string;
  investment_type: string;
  amount: number;
  units: number | null;
  user_id: string;
  transaction_status: string;
  profiles: {
    full_name: string | null;
    user: {
      email: string | null;
    } | null;
  } | null;
}

export default function Investments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("investment_date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const { data: investments, isLoading } = useQuery({
    queryKey: ["all-investments", searchTerm, sortBy, sortOrder],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select(`
          *,
          profiles (
            full_name,
            user:user_id (
              email
            )
          )
        `)
        .order(sortBy, { ascending: sortOrder === "asc" })

      if (error) throw error

      return data as InvestmentWithUser[]
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">All Investments</h1>
        <p className="text-muted-foreground">
          View and manage all user investments
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Input
          placeholder="Search investments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={sortBy}
          onValueChange={setSortBy}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="investment_date">Date</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
            <SelectItem value="project_name">Project</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sortOrder}
          onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Ascending</SelectItem>
            <SelectItem value="desc">Descending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Investor</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Units</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : investments?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No investments found
                </TableCell>
              </TableRow>
            ) : (
              investments?.map((investment) => (
                <TableRow key={investment.id}>
                  <TableCell>
                    {new Date(investment.investment_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{investment.profiles?.full_name || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">
                        {investment.profiles?.user?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{investment.project_name}</TableCell>
                  <TableCell className="capitalize">
                    {investment.investment_type.replace("_", " ")}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(investment.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {investment.units || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link to={`/manage/users/${investment.user_id}`}>
                        View Investor
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}