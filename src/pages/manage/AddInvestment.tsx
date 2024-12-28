import { useParams } from "react-router-dom";
import { AdminInvestmentForm } from "@/components/manage/investments/AdminInvestmentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddInvestment() {
  const { userId } = useParams();

  if (!userId) {
    return <div>User ID is required</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Investment for User</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminInvestmentForm 
            userId={userId}
            onSuccess={() => {
              // Optionally navigate back or show success message
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}