import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  TablePagination,
  IconButton,
} from '@mui/material';
import API_BASE_URL from './../../config';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Edit, Delete } from '@mui/icons-material';
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

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newClient, setNewClient] = useState({
    clientName: '',
    contactPerson: '',
    mobileNo: '',
    clientAddress: '',
  });
  const [editingClientId, setEditingClientId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);


  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Function to handle drawer toggle
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/companies`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        setClients(data);
        setFilteredClients(data);
      } catch (error) {
        toast.error(error.message || 'Error fetching clients');
      }
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const results = clients.filter(client =>
      (client.clientName && client.clientName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.contactPerson && client.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client.mobileNo && client.mobileNo.includes(searchQuery)) ||
      (client.clientAddress && client.clientAddress.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredClients(results);
  }, [searchQuery, clients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewClient((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (editingClientId) {
      // Update existing client
      try {
        const response = await fetch(`${API_BASE_URL}/api/companies/${editingClientId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClient),
        });
        if (!response.ok) {
          throw new Error('Failed to update client');
        }
        const updatedClient = await response.json();
        setClients((prev) =>
          prev.map((client) => (client._id === editingClientId ? updatedClient : client))
        );
        toast.success('Client updated successfully!');
      } catch (error) {
        toast.error(error.message || 'Error updating client');
      }
    } else {
      // Add new client
      try {
        const response = await fetch(`${API_BASE_URL}/api/companies`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newClient),
        });
        if (!response.ok) {
          throw new Error('Failed to add client');
        }
        const addedClient = await response.json();
        setClients((prev) => [addedClient, ...prev]); // Prepend new client
        toast.success('Client added successfully!');
      } catch (error) {
        toast.error(error.message || 'Error adding client');
      }
    }

    setShowForm(false);
    setNewClient({ clientName: '', contactPerson: '', mobileNo: '', clientAddress: '' });
    setEditingClientId(null);
  };

  const handleEdit = (client) => {
    setNewClient(client);
    setEditingClientId(client._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch(`${API_BASE_URL}/api/companies/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete client');
        }
        setClients((prev) => prev.filter((client) => client._id !== id));
        toast.success('Client deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Error deleting client');
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
            label="Name Email Mobile Number"
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
                  name="clientName"
                  value={newClient.clientName}
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
                  name="mobileNo"
                  value={newClient.mobileNo}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Address"
                  name="clientAddress"
                  value={newClient.clientAddress}
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
            <Typography sx={{fontWeight: "bold"}} variant="h4">List Of All Existing Clients</Typography>
            <Paper sx={{ overflowX: 'auto', mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>SR No</th>
                    <th>Client Name</th>
                    <th>Contact Person</th>
                    <th>Mobile Number</th>
                    <th>Address</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client, index) => (
                    <tr key={client._id}>
                      <td>{page * rowsPerPage + index + 1}</td>
                      <td>{client.clientName}</td>
                      <td>{client.contactPerson}</td>
                      <td>{client.mobileNo}</td>
                      <td>{client.clientAddress}</td>
                      <td>
                        <IconButton variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => handleEdit(client)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      
                      </td>
                      <td>
                      <IconButton variant="outlined" color="error" onClick={() => handleDelete(client._id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Paper>
            <TablePagination
              rowsPerPageOptions={[15, 25, 50]}
              component="div"
              count={filteredClients.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        </Container>
      </MainContent>
      <ToastContainer />
    </Box>
  );
};

export default ClientPage;
