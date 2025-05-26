import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import UpdateProfileForm from './UpdateProfileForm';
import './ProfilePage.css';

const ProfilePage = () => {
  const { currentUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);

  if (!currentUser) {
    return <div className="profile-loading">Loading user data...</div>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Your Profile</h1>
      
      {!isEditing ? (
        <div className="profile-info">
          <div className="profile-field">
            <span className="field-label">Name:</span>
            <span className="field-value">{currentUser.name}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Email:</span>
            <span className="field-value">{currentUser.email}</span>
          </div>
          <div className="profile-field">
            <span className="field-label">Role:</span>
            <span className="field-value">{currentUser.role}</span>
          </div>
          <button 
            className="edit-profile-btn"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <UpdateProfileForm 
          user={currentUser} 
          onCancel={() => setIsEditing(false)} 
        />
      )}
    </div>
  );
};

export default ProfilePage;