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

const MachinePage = () => {
  const [machines, setMachines] = useState([]);
  const [filteredMachines, setFilteredMachines] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMachine, setNewMachine] = useState({
    name: '',
    model: '',
    serialNumber: '',
    location: '',
  });
  const [editingMachineId, setEditingMachineId] = useState(null);

  // Dummy data
  useEffect(() => {
    const dummyMachines = [
      { _id: '1', name: 'Excavator', model: 'CAT 320', serialNumber: 'SN123456', location: 'Site A' },
      { _id: '2', name: 'Bulldozer', model: 'CAT D6', serialNumber: 'SN654321', location: 'Site B' },
    ];
    setMachines(dummyMachines);
    setFilteredMachines(dummyMachines);
  }, []);

  useEffect(() => {
    const results = machines.filter(machine =>
      (machine.name && machine.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (machine.model && machine.model.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (machine.serialNumber && machine.serialNumber.includes(searchQuery)) ||
      (machine.location && machine.location.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredMachines(results);
  }, [searchQuery, machines]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMachine((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMachineId) {
      setMachines((prev) =>
        prev.map((machine) => (machine._id === editingMachineId ? { ...newMachine, _id: editingMachineId } : machine))
      );
      toast.success('Machine updated successfully!');
    } else {
      setMachines((prev) => [...prev, { ...newMachine, _id: Date.now().toString() }]);
      toast.success('Machine added successfully!');
    }
    setShowForm(false);
    setNewMachine({ name: '', model: '', serialNumber: '', location: '' });
    setEditingMachineId(null);
  };

  const handleEdit = (machine) => {
    setNewMachine(machine);
    setEditingMachineId(machine._id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      setMachines((prev) => prev.filter((machine) => machine._id !== id));
      toast.success('Machine deleted successfully!');
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
                  value={newMachine.name}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Model"
                  name="model"
                  value={newMachine.model}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Serial Number"
                  name="serialNumber"
                  value={newMachine.serialNumber}
                  onChange={handleChange}
                  sx={{ mb: 1, width: '90%' }}
                  required
                />
                <TextField
                  label="Location"
                  name="location"
                  value={newMachine.location}
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
                    <th>Model</th>
                    <th>Serial Number</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMachines.map((machine, index) => (
                    <tr key={machine._id}>
                      <td>{index + 1}</td>
                      <td>{machine.name}</td>
                      <td>{machine.model}</td>
                      <td>{machine.serialNumber}</td>
                      <td>{machine.location}</td>
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
          </Card>
        </Container>
      </MainContent>
      <ToastContainer />
    </Box>
  );
};

export default MachinePage;
