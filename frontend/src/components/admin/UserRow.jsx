import PropTypes from 'prop-types';
import './UserRow.css';

const UserRow = ({ user, onUpdateRole, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Admin':
        return 'role-badge admin';
      case 'Organizer':
        return 'role-badge organizer';
      default:
        return 'role-badge user';
    }
  };

  return (
    <div className="user-row">
      <div className="user-info">
        <span className="user-name">{user.name}</span>
      </div>
      <div className="user-email">{user.email}</div>
      <div className="user-role">
        <span className={getRoleBadgeClass(user.role)}>{user.role}</span>
      </div>
      <div className="user-actions">
        <button
          className="action-button update"
          onClick={() => onUpdateRole(user._id)}
          title="Update Role"
        >
          Update Role
        </button>
        <button
          className="action-button delete"
          onClick={() => onDelete(user._id)}
          title="Delete User"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

UserRow.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onUpdateRole: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow; 