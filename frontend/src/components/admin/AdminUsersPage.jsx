import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../api/api';
import { USER_ENDPOINTS } from '../../config/api.config';
import UserRow from './UserRow';
import UpdateUserRoleModal from './UpdateUserRoleModal';
import ConfirmationDialog from '../common/ConfirmationDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import { toast } from 'react-toastify';
import './AdminUsersPage.css';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    if (user?.role !== 'Admin') {
      navigate('/unauthorized');
      return;
    }

    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const response = await api.get(USER_ENDPOINTS.ALL_USERS);
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(USER_ENDPOINTS.UPDATE_USER(userId), { role: newRole });
      toast.success('User role updated successfully');
      fetchUsers();
      setShowRoleModal(false);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      await api.delete(USER_ENDPOINTS.DELETE_USER(selectedUser._id));
      toast.success('User deleted successfully');
      fetchUsers();
      setShowDeleteDialog(false);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="admin-users-container">
      <div className="admin-users-header">
        <h1>User Management</h1>
        <div className="filters">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="role-filter"
          >
            <option value="all">All Roles</option>
            <option value="User">User</option>
            <option value="Organizer">Organizer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="users-table">
        <div className="table-header">
          <div className="header-cell">Name</div>
          <div className="header-cell">Email</div>
          <div className="header-cell">Role</div>
          <div className="header-cell">Actions</div>
        </div>
        
        <div className="table-body">
          {filteredUsers.length > 0 ? (
            filteredUsers.map(user => (
              <UserRow
                key={user._id}
                user={user}
                onUpdateRole={() => {
                  setSelectedUser(user);
                  setShowRoleModal(true);
                }}
                onDelete={() => {
                  setSelectedUser(user);
                  setShowDeleteDialog(true);
                }}
              />
            ))
          ) : (
            <div className="no-users">No users found</div>
          )}
        </div>
      </div>

      {showRoleModal && selectedUser && (
        <UpdateUserRoleModal
          user={selectedUser}
          onClose={() => {
            setShowRoleModal(false);
            setSelectedUser(null);
          }}
          onUpdateRole={handleUpdateRole}
        />
      )}

      {showDeleteDialog && selectedUser && (
        <ConfirmationDialog
          title="Delete User"
          message={`Are you sure you want to delete ${selectedUser.name}? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDeleteUser}
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