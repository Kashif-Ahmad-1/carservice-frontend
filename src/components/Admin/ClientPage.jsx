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
    textAlign: 'left',
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

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    contactPerson: '',
    mobileNumber: '',
    address: '',
  });
  const [editingClientId, setEditingClientId] = useState(null);

  // Dummy data
  useEffect(() => {
    const dummyClients = [
      { _id: '1', name: 'Client A', contactPerson: 'John Doe', mobileNumber: '1234567890', address: '123 Street A' },
      { _id: '2', name: 'Client B', contactPerson: 'Jane Doe', mobileNumber: '0987654321', address: '456 Street B' },
    ];
    setClients(dummyClients);
    setFilteredClients(dummyClients);
  }, []);

  useEffect(() => {
    const results = clients.filter(client =>
      (client.name && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.contactPerson && client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.mobileNumber && client.mobileNumber.includes(searchQuery)) ||
      (client.address && client.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredClients(results);
  }, [searchQuery, clients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingClientId) {
      setClients((prev) =>
        prev.map((client) => (client._id === editingClientId ? { ...newClient, _id: editingClientId } : client))
      );
      toast.success('Client updated successfully!');
    } else {
      setClients((prev) => [...prev, { ...newClient, _id: Date.now().toString() }]);
      toast.success('Client added successfully!');
    }
    setShowForm(false);
    setNewClient({ name: '', contactPerson: '', mobileNumber: '', address: '' });
    setEditingClientId(null);
  };

  const handleEdit = (client) => {
    setNewClient(client);
    setEditingClientId(client._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setClients((prev) => prev.filter((client) => client._id !== id));
      toast.success('Client deleted successfully!');
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
          <SectionTitle variant="h4">Client List</SectionTitle>

          {/* Search Box */}
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <ButtonContainer>
            <Button variant="contained" color="primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : 'Add Client'}
            </Button>
          </ButtonContainer>

          {showForm && (
            <SmallCard sx={{ mb: 2 }}>
              <Typography variant="h6" align="center">{editingClientId ? 'Edit Client' : 'Add New Client'}</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Client Name"
                  name="name"
                  value={newClient.name}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Contact Person"
                  name="contactPerson"
                  value={newClient.contactPerson}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Mobile Number"
                  name="mobileNumber"
                  value={newClient.mobileNumber}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Address"
                  name="address"
                  value={newClient.address}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ width: '90%' }}>
                  {editingClientId ? 'Update Client' : 'Add Client'}
                </Button>
              </form>
            </SmallCard>
          )}

          <Card>
            <Typography variant="h6">Clients</Typography>
            <Paper sx={{ overflowX: 'auto', mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>SR No</th>
                    <th>Client Name</th>
                    <th>Contact Person</th>
                    <th>Mobile Number</th>
                    <th>Address</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client, index) => (
                    <tr key={client._id}>
                      <td>{index + 1}</td>
                      <td>{client.name}</td>
                      <td>{client.contactPerson}</td>
                      <td>{client.mobileNumber}</td>
                      <td>{client.address}</td>
                      <td>
                        <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => handleEdit(client)}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleDelete(client._id)}>
                          Delete
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

export default ClientPage;
