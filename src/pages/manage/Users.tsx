import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { UsersTable } from "@/components/manage/users/UsersTable"
import { UsersHeader } from "@/components/manage/users/UsersHeader"
import { UsersPagination } from "@/components/manage/users/UsersPagination"

export default function Users() {
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
        .select(`
          *,
          auth_users:auth.users(email)
        `, { count: "exact" })
        .range((page - 1) * itemsPerPage, page * itemsPerPage - 1)
        .order(sortBy, { ascending: sortOrder === "asc" })

      if (searchTerm) {
        query = query.or(
          `full_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`
        )
      }

      const { data, error, count } = await query

      if (error) throw error

      const users = data.map(profile => ({
        ...profile,
        email: profile.auth_users?.email
      }))

      return {
        users,
        total: count || 0,
      }
    },
  })

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage)

  return (
    <div className="space-y-6">
      <UsersHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
      <UsersTable
        users={data?.users}
        isLoading={isLoading}
        refetch={refetch}
      />
      {totalPages > 1 && (
        <UsersPagination
          page={page}
          setPage={setPage}
          totalPages={totalPages}
        />
      )}
    </div>
  )
}