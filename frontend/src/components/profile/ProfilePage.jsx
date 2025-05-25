import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import UpdateProfileForm from './UpdateProfileForm';
import './Profile.css';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button 
          className="edit-profile-button"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {isEditing ? (
        <UpdateProfileForm 
          user={user} 
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <div className="profile-info">
          <div className="info-group">
            <label>Name</label>
            <p>{user.firstName} {user.lastName}</p>
          </div>

          <div className="info-group">
            <label>Email</label>
            <p>{user.email}</p>
          </div>

          <div className="info-group">
            <label>Account Type</label>
            <p className="role-badge">{user.role}</p>
          </div>

          <div className="info-group">
            <label>Member Since</label>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>

          {user.role === 'organizer' && (
            <div className="info-group">
              <label>Events Created</label>
              <p>{user.eventsCreated || 0}</p>
            </div>
          )}

          {(user.role === 'user' || user.role === 'organizer') && (
            <div className="info-group">
              <label>Tickets Booked</label>
              <p>{user.ticketsBooked || 0}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfilePage; 