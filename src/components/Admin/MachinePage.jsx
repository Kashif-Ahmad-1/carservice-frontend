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

const PaginationContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: theme.spacing(2),
}));

const MachinePage = () => {
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMachine, setNewMachine] = useState({
    name: '',
    quantity: '',
    modelNo: '',
    partNo: '',
  });
  const [editingMachineId, setEditingMachineId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [machinesPerPage] = useState(15);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/api/machines`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to fetch machines');
        const data = await response.json();
        setMachines(data);
      } catch (error) {
        toast.error(error.message || 'Error fetching machines');
      }
    };

    fetchMachines();
  }, []);

  useEffect(() => {
    const results = machines
      .filter(machine =>
        (machine.name && machine.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (machine.quantity && machine.quantity.toString().includes(searchQuery)) ||
        (machine.modelNo && machine.modelNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (machine.partNo && machine.partNo.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort latest first

    setFilteredMachines(results);
  }, [searchQuery, machines]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMachine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const machineData = {
      ...newMachine,
      createdAt: new Date().toISOString(), // Set the current timestamp
    };

    if (editingMachineId) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/machines/${editingMachineId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(machineData),
        });
        if (!response.ok) throw new Error('Failed to update machine');
        const updatedMachine = await response.json();
        setMachines(prev => prev.map(machine => (machine._id === editingMachineId ? updatedMachine : machine)));
        toast.success('Machine updated successfully!');
      } catch (error) {
        toast.error(error.message || 'Error updating machine');
      }
    } else {
      try {
        const response = await fetch(`${API_BASE_URL}/api/machines`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(machineData),
        });
        if (!response.ok) throw new Error('Failed to add machine');
        const addedMachine = await response.json();
        setMachines(prev => [addedMachine, ...prev]); // Add new machine at the beginning
        toast.success('Machine added successfully!');
      } catch (error) {
        toast.error(error.message || 'Error adding machine');
      }
    }

    setShowForm(false);
    setNewMachine({ name: '', quantity: '' });
    setEditingMachineId(null);
  };

  const handleEdit = (machine) => {
    setNewMachine(machine);
    setEditingMachineId(machine._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch(`${API_BASE_URL}/api/machines/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) throw new Error('Failed to delete machine');
        setMachines(prev => prev.filter(machine => machine._id !== id));
        toast.success('Machine deleted successfully!');
      } catch (error) {
        toast.error(error.message || 'Error deleting machine');
      }
    }
  };

  // Pagination Logic
  const indexOfLastMachine = currentPage * machinesPerPage;
  const indexOfFirstMachine = indexOfLastMachine - machinesPerPage;
  const currentMachines = filteredMachines.slice(indexOfFirstMachine, indexOfLastMachine);
  const totalPages = Math.ceil(filteredMachines.length / machinesPerPage);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <MainContent>
        <ToolbarSpacer />
        <Container>
          <SectionTitle variant="h4">Machine List</SectionTitle>

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
              {showForm ? 'Cancel' : 'Add Machine'}
            </Button>
          </ButtonContainer>

          {showForm && (
            <SmallCard sx={{ mb: 2 }}>
              <Typography variant="h6" align="center">{editingMachineId ? 'Edit Machine' : 'Add New Machine'}</Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Machine Name"
                  name="name"
                  type="string"
                  value={newMachine.name}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Model No."
                  name="modelNo"
                  type="string"
                  value={newMachine.modelNo}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Part No."
                  name="partNo"
                  type="string"
                  value={newMachine.partNo}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <Button type="submit" variant="contained" color="primary" sx={{ width: '90%' }}>
                  {editingMachineId ? 'Update Machine' : 'Add Machine'}
                </Button>
              </form>
            </SmallCard>
          )}

          <Card>
            <Typography variant="h6">Machines</Typography>
            <Paper sx={{ overflowX: 'auto', mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>SR No</th>
                    <th>Machine Name</th>
                    <th>Model No.</th>
                    <th>Part No.</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMachines.map((machine, index) => (
                    <tr key={machine._id}>
                      <td>{indexOfFirstMachine + index + 1}</td>
                      <td>{machine.name}</td>
                      <td>{machine.modelNo}</td>
                      <td>{machine.partNo}</td>
                      <td>
                        <Button variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => handleEdit(machine)}>
                          Edit
                        </Button>
                        <Button variant="outlined" color="error" onClick={() => handleDelete(machine._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Paper>
            <PaginationContainer>
              <Button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </Button>
              <Button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </Button>
            </PaginationContainer>
          </Card>
        </Container>
      </MainContent>
      <ToastContainer />
    </Box>
  );
};

export default MachinePage;
