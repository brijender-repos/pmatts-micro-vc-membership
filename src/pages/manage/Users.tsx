import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
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
          *,
          user:auth.users (
            email
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(start, end);

      if (error) throw error;

      const users = data.map((profile): UserData => ({
        ...profile,
        email: profile.user?.email,
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
      <UsersHeader />
      <div className="border rounded-lg">
        <UsersTable
          users={usersData?.users || []}
          onUserClick={(userId) => navigate(`/manage/users/${userId}`)}
        />
      </div>
      {usersData?.totalPages && usersData.totalPages > 1 && (
        <UsersPagination
          currentPage={page}
          totalPages={usersData.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}