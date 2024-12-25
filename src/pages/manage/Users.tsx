import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UsersTable } from "@/components/manage/users/UsersTable";
import { UsersPagination } from "@/components/manage/users/UsersPagination";
import { UsersHeader } from "@/components/manage/users/UsersHeader";
import { supabase } from "@/integrations/supabase/client";

interface UserData {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean | null;
  created_at: string;
}

export default function Users() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const pageSize = 10;

  const { data: usersData } = useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize - 1;

      const { data, error, count } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          phone,
          is_active,
          created_at,
          user:auth.users!profiles_user_id_fkey (
            email
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;

      const users = data.map((profile): UserData => ({
        id: profile.id,
        full_name: profile.full_name,
        email: profile.user?.email || null,
        phone: profile.phone,
        is_active: profile.is_active,
        created_at: profile.created_at,
      }));

      return {
        users,
        totalPages: Math.ceil((count || 0) / pageSize),
      };
    },
  });

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
      <div className="border rounded-lg">
        <UsersTable
          users={usersData?.users || []}
          isLoading={false}
          refetch={() => {}}
        />
      </div>
      {usersData?.totalPages && usersData.totalPages > 1 && (
        <UsersPagination
          page={page}
          setPage={setPage}
          totalPages={usersData.totalPages}
        />
      )}
    </div>
  );
}