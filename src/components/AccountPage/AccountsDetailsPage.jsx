import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Container,
  Button,
  Divider,
  TextField,
  Box,
  AppBar,
  Toolbar,
  TablePagination
} from '@mui/material';
import { Add, Download } from '@mui/icons-material';
import AppointmentSidebar from './AppointmentSidebar';
import AddMachine from './AddMachine';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppointmentDetailsPage() {
  const [appointments, setAppointments] = useState([]);
  const [showAddClientFields, setShowAddClientFields] = useState(false);
  const [showAddMachineField, setShowAddMachineField] = useState(false);
  const [clientData, setClientData] = useState({ name: '', address: '', contact: '', mobileNo: '' });
  const [machineData, setMachineData] = useState({ name: '' });
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/appointments/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Sort appointments by creation date descending
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointment data', error);
      }
    };

    fetchAppointments();
  }, []);

  const handleBackClick = () => {
    navigate('/account-add-client');
  };

  const handleAddClientClick = () => {
    setShowAddClientFields(!showAddClientFields);
  };

  const handleAddMachineClick = () => {
    setShowAddMachineField(!showAddMachineField);
  };

  const handleInputChange = (e) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddClientSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        throw new Error('Failed to create company');
      }

      toast.success('Client added successfully!');
      setClientData({ name: '', address: '', contact: '', mobileNo: '' });
      setShowAddClientFields(false);
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to add client. Please try again.');
    }
  };

  const handleMachineChange = (e) => {
    setMachineData({
      ...machineData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddMachineSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/machines', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machineData),
      });
      if (!response.ok) {
        throw new Error('Failed to create machine');
      }
      toast.success('Machine added successfully!');
      setShowAddMachineField(true);
    } catch (error) {
      console.error('Error creating machine:', error);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/download-pdf/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Appointment_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error fetching PDF:', await response.text());
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  if (appointments.length === 0) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const Header = () => (
    <AppBar position="static" sx={{ backgroundColor: "#ff4d30" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Company Name
        </Typography>
      </Toolbar>
    </AppBar>
  );

  const Footer = () => (
    <Box sx={{
      padding: 2,
      textAlign: "center",
      backgroundColor: "#f1f1f1",
      marginTop: "auto",
      borderTop: '1px solid #e0e0e0',
    }}>
      <Typography variant="body2" sx={{ color: '#666' }}>
        © {new Date().getFullYear()} Company Name. All rights reserved.
      </Typography>
    </Box>
  );

  return (
    <div style={{ display: 'flex' }}>
      <AppointmentSidebar />
      <Container sx={{ padding: 0, width: '100%', overflowX: 'auto', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} maxWidth="xl">
        <Header />
        <ToastContainer />
        <Typography variant="h4" gutterBottom sx={{ marginTop: 2, fontWeight: 'bold' }}>
          Clients Details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', marginBottom: 2 }}>
          <Button variant="contained" color="primary" onClick={handleBackClick} sx={{ marginBottom: { xs: 1, sm: 0 }, marginRight: 2 }} startIcon={<Add />}>
            Create Invoice
          </Button>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button variant="contained" color="secondary" onClick={handleAddClientClick} sx={{ marginBottom: { xs: 1, sm: 0 }, marginRight: 2 }} startIcon={<Add />}>
              Add Client
            </Button>
            <Button variant="contained" color="success" onClick={handleAddMachineClick} startIcon={<Add />}>
              Add Machine
            </Button>
          </Box>
        </Box>
        {showAddClientFields && (
          <Box sx={{ marginBottom: 2, p: 2, borderRadius: 1, boxShadow: 2, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Add New Client</Typography>
            <TextField label="Client Name" name="name" value={clientData.name} onChange={handleInputChange} fullWidth sx={{ marginBottom: 1 }} />
            <TextField label="Client Address" name="address" value={clientData.address} onChange={handleInputChange} fullWidth sx={{ marginBottom: 1 }} />
            <TextField label="Contact Person" name="contact" value={clientData.contact} onChange={handleInputChange} fullWidth sx={{ marginBottom: 1 }} />
            <TextField label="Mobile No." name="mobileNo" value={clientData.mobileNo} onChange={handleInputChange} fullWidth sx={{ marginBottom: 2 }} />
            <Button variant="contained" color="success" onClick={handleAddClientSubmit}>
              Submit
            </Button>
          </Box>
        )}
        {showAddMachineField && <AddMachine onSubmit={handleAddMachineSubmit} />}
        <Divider sx={{ marginY: 2 }} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>SR. No.</TableCell>
                {['Client Name', 'Client Address', 'Contact Person', 'Mobile No.', 'Appointment Date', 'Appointment Amount', 'Machine Name', 'Model', 'Part No.', 'Serial No.', 'Installation Date', 'Service Frequency', 'Expected Service Date', 'Service Engineer', 'Upload Document'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment, index) => (
                <TableRow key={appointment._id} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.clientAddress}</TableCell>
                  <TableCell>{appointment.contactPerson}</TableCell>
                  <TableCell>{appointment.mobileNo}</TableCell>
                  <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                  <TableCell>{typeof appointment.appointmentAmount === 'number' ? `$${appointment.appointmentAmount.toFixed(2)}` : 'N/A'}</TableCell>
                  <TableCell>{appointment.machineName}</TableCell>
                  <TableCell>{appointment.model}</TableCell>
                  <TableCell>{appointment.partNo}</TableCell>
                  <TableCell>{appointment.serialNo}</TableCell>
                  <TableCell>{new Date(appointment.installationDate).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.serviceFrequency}</TableCell>
                  <TableCell>{new Date(appointment.expectedServiceDate).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.engineer.name}</TableCell>
                  <TableCell>
                    <Button variant="outlined" color="primary" onClick={() => handleDownloadPDF(appointment._id)}>
                      <Download /> Upload Document
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={appointments.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          sx={{ marginTop: 2 }}
        />
        <Footer />
      </Container>
    </div>
  );
}

export default AppointmentDetailsPage;
