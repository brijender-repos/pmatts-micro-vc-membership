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

export default function Investments() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("investment_date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const { data: investments, isLoading } = useQuery({
    queryKey: ["all-investments", searchTerm, sortBy, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from("investments")
        .select(`
          *,
          projects(name, status),
          profiles!inner(
            full_name,
            auth.users!inner(email)
          )
        `)
        .order(sortBy, { ascending: sortOrder === "asc" })

      if (searchTerm) {
        query = query.or(
          `profiles.full_name.ilike.%${searchTerm}%,profiles.users.email.ilike.%${searchTerm}%,project_name.ilike.%${searchTerm}%`
        )
      }

      const { data, error } = await query
      if (error) throw error

      return data.map(investment => ({
        ...investment,
        user_email: investment.profiles?.users?.email,
        user_name: investment.profiles?.full_name
      }))
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
                      <p>{investment.user_name || "N/A"}</p>
                      <p className="text-sm text-muted-foreground">
                        {investment.user_email}
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