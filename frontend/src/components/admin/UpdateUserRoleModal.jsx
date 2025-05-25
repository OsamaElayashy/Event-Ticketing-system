import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../contexts/AuthContext';
import './Admin.css';

const UpdateUserRoleModal = ({ user, onClose, onUpdate }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserRole } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedRole === user.role) {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      const updatedUser = await updateUserRole(user.id, selectedRole);
      toast.success('User role updated successfully');
      onUpdate(updatedUser);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update User Role</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="user-info">
            Updating role for <strong>{user.firstName} {user.lastName}</strong>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="role-options modal-roles">
              <div className="role-option">
                <input
                  type="radio"
                  id="user-role"
                  name="role"
                  value="StandardUser"
                  checked={selectedRole === 'StandardUser'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <label htmlFor="user-role">User</label>
                <p className="role-description">Book tickets and attend events</p>
              </div>

              <div className="role-option">
                <input
                  type="radio"
                  id="organizer-role"
                  name="role"
                  value="Organizer"
                  checked={selectedRole === 'Organizer'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <label htmlFor="organizer-role">Organizer</label>
                <p className="role-description">Create and manage events</p>
              </div>

              <div className="role-option">
                <input
                  type="radio"
                  id="admin-role"
                  name="role"
                  value="Admin"
                  checked={selectedRole === 'Admin'}
                  onChange={(e) => setSelectedRole(e.target.value)}
                />
                <label htmlFor="admin-role">Admin</label>
                <p className="role-description">Manage users and events</p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button"
                disabled={isLoading || selectedRole === user.role}
              >
                {isLoading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  'Update Role'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateUserRoleModal; 