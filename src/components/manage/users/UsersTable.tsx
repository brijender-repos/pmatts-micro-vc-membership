import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"
import { AdminInvestmentForm } from "../investments/AdminInvestmentForm"
import { InvestmentsTable } from "../investments/InvestmentsTable"
import { useQuery } from "@tanstack/react-query"
import { InvestmentWithUser, PaymentMode } from "@/types/investment"

interface User {
  id: string
  full_name: string | null
  phone: string | null
  email: string
  created_at: string
  is_active: boolean
}

interface UsersTableProps {
  users?: User[]
  isLoading: boolean
  refetch: () => void
}

export function UsersTable({ users, isLoading, refetch }: UsersTableProps) {
  const { toast } = useToast()

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

  const UserInvestments = ({ userId }: { userId: string }) => {
    const { data: investments, isLoading: investmentsLoading, refetch: refetchInvestments } = useQuery({
      queryKey: ["user-investments", userId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("investments")
          .select(`
            *,
            profiles:user_id (
              full_name,
              email,
              phone
            )
          `)
          .eq("user_id", userId)
          .order("investment_date", { ascending: false });

        if (error) throw error;

        // Transform the data to match InvestmentWithUser type
        return (data || []).map(investment => ({
          ...investment,
          payment_mode: (investment.payment_mode || "NEFT/RTGS/IMPS") as PaymentMode,
        })) as InvestmentWithUser[];
      },
    });

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Investments</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Investment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <AdminInvestmentForm 
                userId={userId} 
                onSuccess={() => {
                  refetchInvestments();
                  toast({
                    title: "Success",
                    description: "Investment added successfully",
                  });
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
        <InvestmentsTable 
          investments={investments}
          isLoading={investmentsLoading}
          toggleSort={() => {}}
          onManageInvestment={(investmentId) => {
            // Handle transaction proofs view
          }}
        />
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Joined</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : users?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users?.map((user) => (
              <>
                <TableRow key={user.id}>
                  <TableCell>{user.full_name || "N/A"}</TableCell>
                  <TableCell>{user.email || "N/A"}</TableCell>
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
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/manage/users/${user.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} className="bg-muted/30">
                    <UserInvestments userId={user.id} />
                  </TableCell>
                </TableRow>
              </>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}