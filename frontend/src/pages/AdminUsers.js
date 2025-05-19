import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  CheckCircle as UnblockIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from '../components/common/Toast';
import axios from 'axios';

const AdminUsers = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      showToast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`/api/admin/users/${userToDelete._id}`);
      showToast.success('User deleted successfully');
      setUsers(users.filter(user => user._id !== userToDelete._id));
    } catch (error) {
      showToast.error('Failed to delete user');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleEditClick = (user) => {
    setUserToEdit(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`/api/admin/users/${userToEdit._id}`, editFormData);
      showToast.success('User updated successfully');
      setUsers(users.map(user =>
        user._id === userToEdit._id
          ? { ...user, ...editFormData }
          : user
      ));
      setEditDialogOpen(false);
      setUserToEdit(null);
    } catch (error) {
      showToast.error('Failed to update user');
    }
  };

  const handleToggleBlock = async (user) => {
    try {
      await axios.put(`/api/admin/users/${user._id}/toggle-block`);
      showToast.success(`User ${user.isBlocked ? 'unblocked' : 'blocked'} successfully`);
      setUsers(users.map(u =>
        u._id === user._id
          ? { ...u, isBlocked: !u.isBlocked }
          : u
      ));
    } catch (error) {
      showToast.error('Failed to update user status');
    }
  };

  const getRoleChip = (role) => {
    const roleConfig = {
      admin: { color: 'error', label: 'Admin' },
      organizer: { color: 'primary', label: 'Organizer' },
      user: { color: 'default', label: 'User' },
    };

    const config = roleConfig[role] || roleConfig.user;
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
      />
    );
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Users
        </Typography>

        <Box sx={{ mb: 3 }}>
          <TextField
            label="Search Users"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: 300 }}
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.isBlocked ? 'Blocked' : 'Active'}
                        color={user.isBlocked ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditClick(user)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color={user.isBlocked ? 'success' : 'error'}
                        onClick={() => handleToggleBlock(user)}
                      >
                        {user.isBlocked ? <UnblockIcon /> : <BlockIcon />}
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      {/* Edit User Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Name"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={editFormData.role}
                label="Role"
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
              >
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="organizer">Organizer</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsers; 