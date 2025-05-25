import React from 'react';
import './Admin.css';

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
        return 'role-badge role-badge-admin';
      case 'Organizer':
        return 'role-badge role-badge-organizer';
      default:
        return 'role-badge role-badge-user';
    }
  };

  return (
    <div className="table-row">
      <div className="col-name">
        <div className="user-name">
          {user.firstName} {user.lastName}
        </div>
      </div>
      
      <div className="col-email">
        <div className="user-email">
          {user.email}
        </div>
      </div>
      
      <div className="col-role">
        <span className={getRoleBadgeClass(user.role)}>
          {user.role}
        </span>
      </div>
      
      <div className="col-joined">
        {formatDate(user.createdAt)}
      </div>
      
      <div className="col-actions">
        <button
          className="action-button update-role"
          onClick={onUpdateRole}
          title="Update Role"
        >
          Update Role
        </button>
        
        <button
          className="action-button delete"
          onClick={onDelete}
          title="Delete User"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UserRow; 