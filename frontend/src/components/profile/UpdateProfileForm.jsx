import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { TextField, Button, Box, Alert } from '@mui/material';

const UpdateProfileForm = ({ onCancel }) => {
  const { currentUser, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await updateUserProfile(formData);
      onCancel();
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      <TextField
        fullWidth
        label="Display Name"
        name="displayName"
        value={formData.displayName}
        onChange={handleChange}
        margin="normal"
      />
      
      <TextField
        fullWidth
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        margin="normal"
      />

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          Update Profile
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateProfileForm;