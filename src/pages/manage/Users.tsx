import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import type { Tables } from "@/integrations/supabase/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Profile = Tables<"profiles">

export default function Users() {
  const { toast } = useToast()
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const itemsPerPage = 10

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["users", page, searchTerm, sortBy, sortOrder],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select("*", { count: "exact" })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
        .order(sortBy, { ascending: sortOrder === "asc" })

      if (searchTerm) {
        query = query.or(
          `full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        )
      }

      const { data, error, count } = await query

      if (error) throw error

      return {
        users: data as Profile[],
        total: count || 0,
      }
    },
  })

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage)

  const handleToggleActive = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !currentStatus })
        .eq("id", userId)

      if (error) throw error

      toast({
        title: "Success",
        description: `User ${currentStatus ? "deactivated" : "activated"} successfully`,
      })
      refetch()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Join Date</SelectItem>
              <SelectItem value="full_name">Name</SelectItem>
              <SelectItem value="last_sign_in_at">Last Sign In</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          >
            {sortOrder === "asc" ? "↑" : "↓"}
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : data?.users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              data?.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.full_name || "N/A"}</TableCell>
                  <TableCell>{user.phone || "N/A"}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={user.is_active}
                      onCheckedChange={() =>
                        handleToggleActive(user.id, user.is_active)
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page > 1) setPage(page - 1)
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <PaginationItem key={p}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(p)
                  }}
                  isActive={page === p}
                >
                  {p}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (page < totalPages) setPage(page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
