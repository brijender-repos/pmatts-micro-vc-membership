import { useParams } from "react-router-dom";
import { AdminInvestmentForm } from "@/components/manage/investments/AdminInvestmentForm";

export default function AddInvestment() {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    return <div>User ID is required</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Add Investment for User</h1>
      <AdminInvestmentForm 
        userId={userId} 
        projectName="Missing Matters"
        onSuccess={() => {
          window.location.href = `/manage/users/${userId}`;
        }}
      />
    </div>
  );
}