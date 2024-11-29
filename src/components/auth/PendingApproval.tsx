import { AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import useAuthStore from '../../store/authStore';

export default function PendingApproval() {
  const { logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center text-yellow-500">
          <AlertCircle className="h-12 w-12" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Account Pending Approval
        </h2>
        <div className="mt-2 text-center text-sm text-gray-600 space-y-4">
          <p>
            Your account is currently pending administrator approval. You will receive an email once your account has been reviewed.
          </p>
          <Button
            variant="outline"
            onClick={logout}
            className="mt-4"
          >
            Back to Sign In
          </Button>
        </div>
      </div>
    </div>
  );
}