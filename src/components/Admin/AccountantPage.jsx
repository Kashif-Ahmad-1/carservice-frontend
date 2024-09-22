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
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the toastify CSS

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
    textAlign: 'left',
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: '1.2rem', // Increase font size
    fontWeight: '600', // Set font weight
  },
  '& th': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SmallCard = styled(Card)(({ theme }) => ({
  maxWidth: 400, // Set a maximum width for the form
  margin: 'auto', // Center the card
  padding: theme.spacing(1), // Reduce padding
  borderRadius: theme.shape.borderRadius, // Keep rounded corners
}));

const AccountantPage = () => {
  const [accountants, setAccountants] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAccountant, setNewAccountant] = useState({ 
    name: '', 
    email: '', 
    password: '',
    mobileNumber: '', 
    address: '',
  });
  const token = localStorage.getItem('token');

  const fetchAccountants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/accountants', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accountants');
      }

      const data = await response.json();
      setAccountants(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAccountants();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAccountant((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newAccountant, role: 'accountant' }), // Add role here
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add accountant');
      }

      await fetchAccountants();
      toast.success('Accountant added successfully!'); // Show success message
      setShowForm(false);
      setNewAccountant({ name: '', email: '', password: '', mobileNumber: '', address: '' });
    } catch (error) {
      console.error(error);
      toast.error(error.message); // Show error message
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <MainContent>
        <ToolbarSpacer />
        <Container>
          <SectionTitle variant="h4">Accountant List</SectionTitle>
          <ButtonContainer>
            <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Accountant'}
            </Button>
          </ButtonContainer>

          {showForm && (
            <SmallCard sx={{ mb: 2 }}>
              <Typography variant="h6" align="center">Add New Accountant</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  name="name"
                  value={newAccountant.name}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }} // Custom width and margin
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  value={newAccountant.email}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={newAccountant.password}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={newAccountant.mobileNumber}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Address"
                  name="address"
                  value={newAccountant.address}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ width: '90%' }}>
                  Add Accountant
                </Button>
              </form>
            </SmallCard>
          )}

          <Card>
            <Typography variant="h6">Accountants</Typography>
            <Paper sx={{ overflowX: 'auto', mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    {/* <th>Password</th> */}
                    <th>Mobile Number</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accountants.map(accountant => (
                    <tr key={accountant._id}>
                      <td>{accountant.name}</td>
                      <td>{accountant.email}</td>
                      {/* <td>{accountant.password}</td> */}
                      <td>{accountant.mobileNumber}</td>
                      <td>{accountant.address}</td>
                      <td>
                        <Button variant="contained" color="secondary" sx={{ mr: 1 }}>Edit</Button>
                        <Button variant="outlined" color="error">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Paper>
          </Card>
        </Container>
      </MainContent>
      <ToastContainer /> {/* Add ToastContainer here */}
    </Box>
  );
};

export default AccountantPage;
