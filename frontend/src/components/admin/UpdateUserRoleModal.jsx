import { useState } from 'react';
import PropTypes from 'prop-types';
import './UpdateUserRoleModal.css';

const UpdateUserRoleModal = ({ user, onClose, onUpdateRole }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateRole(user._id, selectedRole);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Update User Role</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <p>
              Update role for user: <strong>{user.name}</strong>
            </p>
            
            <div className="form-group">
              <label htmlFor="role">Select Role:</label>
              <select
                id="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="role-select"
              >
                <option value="User">User</option>
                <option value="Organizer">Organizer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="update-button"
              disabled={selectedRole === user.role}
            >
              Update Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UpdateUserRoleModal.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdateRole: PropTypes.func.isRequired,
};

export default UpdateUserRoleModal; 