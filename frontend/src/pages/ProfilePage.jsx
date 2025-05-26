import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UpdateProfileForm from '../components/profile/UpdateProfileForm';
import { Box, CircularProgress, Typography, Button, Avatar } from '@mui/material';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <Typography variant="h6" color="error">
          Please log in to view your profile
        </Typography>
      </Box>
    );
  }

  return (
    <div className="profile-container">
      {isEditing ? (
        <UpdateProfileForm
          userData={user}
          onCancel={() => setIsEditing(false)}
          onSuccess={(updatedData) => {
            setIsEditing(false);
            // The AuthContext will handle updating the user data
          }}
        />
      ) : (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar
              src={user.profilePicture}
              alt={user.name || 'No Name'}
              sx={{ width: 100, height: 100, mr: 3 }}
            />
            <Box>
              <Typography variant="h4" gutterBottom>
                {user.name || 'No Name'}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user.email || 'No Email'}
              </Typography>
              {user.role && (
                <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                  {user.role}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Typography>
                <strong>Phone:</strong> {user.phone || 'Not set'}
              </Typography>
              <Typography>
                <strong>Address:</strong> {user.address || 'Not set'}
              </Typography>
              <Typography>
                <strong>Location:</strong> {(user.city || user.country) ? [user.city, user.country].filter(Boolean).join(', ') : 'Not set'}
              </Typography>
            </Box>
          </Box>

          {user.bio && (
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                About
              </Typography>
              <Typography>{user.bio}</Typography>
            </Box>
          )}

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default ProfilePage;