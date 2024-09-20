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

const EngineerPage = () => {
  const [engineer, setEngineer] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const [newEngineer, setNewEngineer] = useState({ 
    name: '', 
    email: '', 
    password: '',
    mobileNumber: '', 
    address: ''
  });
  const token = localStorage.getItem('token');

  const fetchEngineer = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/engineers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch engineer');
      }

      const data = await response.json();
      setEngineer(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEngineer();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEngineer((prev) => ({ ...prev, [name]: value }));
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
        body: JSON.stringify({ ...newEngineer, role: 'engineer' }), // Add role here
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add engineer');
      }

      await fetchEngineer(); // Refresh the list
      toast.success('Engineer added successfully!'); // Show success message
      setShowForm(false);
      setNewEngineer({ name: '', email: '', password: '', mobileNumber: '', address: '' }); // Reset the form
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
          <SectionTitle variant="h4">Engineer List</SectionTitle>
          <ButtonContainer>
            <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Engineer'}
            </Button>
          </ButtonContainer>

          {showForm && (
            <SmallCard sx={{ mb: 2 }}>
              <Typography variant="h6" align="center">Add New Engineer</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Name"
                  name="name"
                  value={newEngineer.name}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }} // Custom width and margin
                  required
                />
                <TextField
                  label="Email"
                  name="email"
                  value={newEngineer.email}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={newEngineer.password}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={newEngineer.mobileNumber}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Address"
                  name="address"
                  value={newEngineer.address}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ width: '90%' }}>
                  Add Engineer
                </Button>
              </form>
            </SmallCard>
          )}

          <Card>
            <Typography variant="h6">Engineers</Typography>
            <Paper sx={{ overflowX: 'auto', mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {engineer.map(engineer => (
                    <tr key={engineer._id}>
                      <td>{engineer.name}</td>
                      <td>{engineer.email}</td>
                      <td>{engineer.mobileNumber}</td>
                      <td>{engineer.address}</td>
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

export default EngineerPage;
