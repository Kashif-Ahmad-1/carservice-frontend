import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
} from '@mui/material';
import API_BASE_URL from './../../config';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const MainContent = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const ToolbarSpacer = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  overflowX: 'auto',
}));

const Table = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  '& th, & td': {
    padding: theme.spacing(1),
    // textAlign: 'left',
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: '1.2rem',
    fontWeight: '600',
  },
  '& th': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SmallCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: 'auto',
  padding: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
}));

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ 
    name: '', 
    email: '', 
    password: '',
    mobileNumber: '', 
    address: ''
  });
  const [editingAdminId, setEditingAdminId] = useState(null);
  const token = localStorage.getItem('token');
  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Function to handle drawer toggle
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };
  const fetchAdmins = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/admins`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admins');
      }

      const data = await response.json();
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAdmins(sortedData);
      setFilteredAdmins(sortedData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [token]);

  useEffect(() => {
    const results = admins.filter(admin => 
      (admin.name && admin.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (admin.email && admin.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (admin.mobileNumber && admin.mobileNumber.includes(searchQuery)) ||
      (admin.address && admin.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredAdmins(results);
  }, [searchQuery, admins]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingAdminId 
      ? `${API_BASE_URL}/api/users/${editingAdminId}`
      : `${API_BASE_URL}/api/auth/register`;
    const method = editingAdminId ? 'PUT' : 'POST';

    const payload = { ...newAdmin, role: 'admin' };
    if (!editingAdminId && !newAdmin.password) {
      toast.error("Password is required for new users.");
      return;
    }

    if (editingAdminId && !newAdmin.password) {
      delete payload.password; // Omit password if not provided during update
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save admin');
      }

      await fetchAdmins();
      toast.success(editingAdminId ? 'Admin updated successfully!' : 'Admin added successfully!');
      setShowForm(false);
      setNewAdmin({ name: '', email: '', password: '', mobileNumber: '', address: '' });
      setEditingAdminId(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleEdit = (admin) => {
    setNewAdmin(admin);
    setEditingAdminId(admin._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete admin');
        }

        await fetchAdmins();
        toast.success('Admin deleted successfully!');
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };

  const handleSendResetLink = async (email) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success('Password reset email sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send reset email.');
      }
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast.error('An error occurred while sending the reset email.');
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar open={drawerOpen} onClose={handleDrawerToggle} />
      <MainContent>
        <ToolbarSpacer />
        <Container>
          <SectionTitle variant="h4">Search By Type</SectionTitle>

          {/* Search Box */}
          <TextField
            label="Name , Email , Mobile Number"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />

          <ButtonContainer>
            <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Admin'}
            </Button>
          </ButtonContainer>

          {showForm && (
            <SmallCard sx={{ mb: 2 }}>
              <Typography variant="h6" align="center">{editingAdminId ? 'Edit Admin' : 'Add New Admin'}</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  name="name"
                  value={newAdmin.name}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }} 
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={newAdmin.password}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required={!editingAdminId} // Password required only on add
                />
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={newAdmin.mobileNumber}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Address"
                  name="address"
                  value={newAdmin.address}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ width: '90%' }}>
                  {editingAdminId ? 'Update Admin' : 'Add Admin'}
                </Button>
              </form>
            </SmallCard>
          )}

          <Card>
          <Typography sx={{fontWeight: "bold"}} variant="h4">List Of All Existing Admins</Typography>
            <Paper sx={{ overflowX: 'auto', mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>SR No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Address</th>
                    <th>Actions</th>
                    <th>Password Reset</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin, index) => (
                    <tr key={admin._id}>
                      <td>{index + 1}</td>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.mobileNumber}</td>
                      <td>{admin.address}</td>
                      <td>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          sx={{ mr: 1 }} 
                          onClick={() => handleEdit(admin)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="error" 
                          onClick={() => handleDelete(admin._id)}
                        >
                          Delete
                        </Button>
                      </td>
                      <td>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          onClick={() => handleSendResetLink(admin.email)}
                        >
                          Send
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Paper>
          </Card>
        </Container>
      </MainContent>
      <ToastContainer /> 
    </Box>
  );
};

export default AdminList;