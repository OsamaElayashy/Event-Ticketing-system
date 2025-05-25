import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import UserRow from './UserRow';
import UpdateUserRoleModal from './UpdateUserRoleModal';
import ConfirmationDialog from '../common/ConfirmationDialog';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const { fetchUsers, deleteUser } = useAuth();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = (user) => {
    setSelectedUser(user);
    setShowRoleModal(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser.id);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  };

  const handleRoleUpdate = (updatedUser) => {
    setUsers(users.map(user => 
      user.id === updatedUser.id ? updatedUser : user
    ));
    setShowRoleModal(false);
    setSelectedUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = (
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) {
    return <div className="loading-spinner" />;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>User Management</h1>
        <div className="filter-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="organizer">Organizers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="col-name">Name</div>
          <div className="col-email">Email</div>
          <div className="col-role">Role</div>
          <div className="col-joined">Joined</div>
          <div className="col-actions">Actions</div>
        </div>

        <div className="table-body">
          {filteredUsers.length === 0 ? (
            <div className="no-results">
              No users found matching your criteria
            </div>
          ) : (
            filteredUsers.map(user => (
              <UserRow
                key={user.id}
                user={user}
                onUpdateRole={() => handleUpdateRole(user)}
                onDelete={() => handleDeleteClick(user)}
              />
            ))
          )}
        </div>
      </div>

      {showRoleModal && selectedUser && (
        <UpdateUserRoleModal
          user={selectedUser}
          onClose={() => setShowRoleModal(false)}
          onUpdate={handleRoleUpdate}
        />
      )}

      {showDeleteDialog && selectedUser && (
        <ConfirmationDialog
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => {
            setShowDeleteDialog(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminUsersPage; 