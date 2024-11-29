import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { UserApprovalTable } from './UserApprovalTable';
import { RejectUserModal } from './RejectUserModal';
import useAuthStore from '../../store/authStore';
import { useSearch } from '../../hooks/useSearch';
import type { User } from '../../types/auth';

export default function PendingApprovals() {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { pendingUsers, approveUser, rejectUser } = useAuthStore();

  const pendingApprovals = pendingUsers.filter(user => user.status === 'pending');

  const { searchQuery, filteredItems, handleSearch } = useSearch({
    items: pendingApprovals,
    searchFields: ['firstName', 'lastName', 'email']
  });

  const handleApprove = async (user: User) => {
    try {
      await approveUser(user.id);
    } catch (error) {
      console.error('Error approving user:', error);
    }
  };

  const handleReject = (user: User) => {
    setSelectedUser(user);
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedUser) return;
    
    try {
      await rejectUser(selectedUser.id, reason);
      setIsRejectModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error rejecting user:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">
          Pending Approvals ({pendingApprovals.length})
        </h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <UserApprovalTable
        users={filteredItems}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <RejectUserModal
        isOpen={isRejectModalOpen}
        onClose={() => {
          setIsRejectModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleRejectConfirm}
        user={selectedUser}
      />
    </div>
  );
}