import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './comp-logo.jpeg';
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
  TablePagination,
  IconButton,
} from '@mui/material';
import { Add, Download, Menu } from '@mui/icons-material';
import AppointmentSidebar from './AppointmentSidebar';
import AddMachine from './AddMachine';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AppointmentDetailsPage() {
  const [appointments, setAppointments] = useState([]);
  const [showAddClientFields, setShowAddClientFields] = useState(false);
  const [showAddMachineField, setShowAddMachineField] = useState(false);
  const [clientData, setClientData] = useState({ name: '', address: '', contact: '', mobileNo: '' });
  const [machineData, setMachineData] = useState({ name: '',modelNo: '', partNo: '', qty: '' });
  const [expandedRows, setExpandedRows] = useState([]);
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(5);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const headerColor = '#ff4d30'; 
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
        body: JSON.stringify({
          clientName: clientData.name,
          contactPerson: clientData.contact,
          mobileNo: clientData.mobileNo,
          clientAddress: clientData.address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create company');
      }

      const data = await response.json();
      console.log('Company created successfully:', data);
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

  const handleAddMachineSubmit = async (machineData) => {
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
      console.log('Machine created successfully:', machineData);
      setShowAddMachineField(true);
      toast.success('Machine added successfully!');
    } catch (error) {
      console.error('Error creating machine:', error);
    }
  };

  const handleDownloadPDF = (appointment) => {
    const documentPath = appointment.document;
    if (documentPath) {
      const link = document.createElement('a');
      link.href = `http://localhost:5000/${documentPath}`;
      link.setAttribute('download', documentPath.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
    } else {
      toast.error('No document available for download.');
    }
  };

  const toggleRow = (index) => {
    setExpandedRows((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const Header = () => (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={toggleSidebar} sx={{ mr: 2 }}>
          <Menu />
        </IconButton>
        <img
        src={logo}
        alt="Company Logo"
        style={{ width: 40, height: 40, marginRight: 10 }} // Adjust size and margin as needed
      />
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
      <AppointmentSidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
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
          <Box sx={{ marginBottom: 2, p: 2, borderRadius: 1, boxShadow: 1, backgroundColor: '#f9f9f9' }}>
            <Typography variant="h6">Add New Client</Typography>
            <TextField
              label="Client Name"
              name="name"
              value={clientData.name}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <TextField
              label="Client Address"
              name="address"
              value={clientData.address}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <TextField
              label="Contact Person"
              name="contact"
              value={clientData.contact}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <TextField
              label="Mobile No."
              name="mobileNo"
              value={clientData.mobileNo}
              onChange={handleInputChange}
              fullWidth
              sx={{ marginBottom: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleAddClientSubmit}>Submit</Button>
          </Box>
        )}
        {showAddMachineField && <AddMachine onSubmit={handleAddMachineSubmit} />}
        <Divider sx={{ marginY: 2 }} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem',backgroundColor: headerColor }}>SR. No.</TableCell>
                {['Invoice No','Client Name', 'Client Address', 'Contact Person', 'Mobile No.', 'Appointment Date', 'Appointment Amount', 'Machine Name', 'Model', 'Part No.', 'Serial No.', 'Installation Date', 'Service Frequency', 'Expected Service Date', 'Service Engineer', 'Document'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', fontSize: '1.1rem', backgroundColor: headerColor }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((appointment, index) => (
                <React.Fragment key={appointment._id}>
                  <TableRow onClick={() => toggleRow(index)} sx={{ cursor: 'pointer', '&:hover': { backgroundColor: '#f5f5f5' } }}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{appointment.invoiceNumber}</TableCell>
                    <TableCell>{appointment.clientName}</TableCell>
                    <TableCell>{appointment.clientAddress}</TableCell>
                    <TableCell>{appointment.contactPerson}</TableCell>
                    <TableCell>{appointment.mobileNo}</TableCell>
                    <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                    <TableCell>{typeof appointment.appointmentAmount === 'number' ? `${appointment.appointmentAmount.toFixed(2)}` : 'N/A'}</TableCell>
                    <TableCell>{appointment.machineName}</TableCell>
                    <TableCell>{appointment.model}</TableCell>
                    <TableCell>{appointment.partNo}</TableCell>
                    <TableCell>{appointment.serialNo}</TableCell>
                    <TableCell>{new Date(appointment.installationDate).toLocaleDateString()}</TableCell>
                    <TableCell>{appointment.serviceFrequency}</TableCell>
                    <TableCell>{new Date(appointment.expectedServiceDate).toLocaleDateString()}</TableCell>
                    <TableCell>{appointment.engineer ? appointment.engineer.name : 'N/A'}</TableCell>
                    <TableCell>
                      {appointment.document ? (
                        <Button variant="outlined" color="primary" onClick={() => handleDownloadPDF(appointment)}>
                          <Download />
                        </Button>
                      ) : (
                        <Typography variant="body2" color="textSecondary">No Document</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRows.includes(index) && (
                    <TableRow>
                      <TableCell colSpan={15} sx={{ backgroundColor: '#f5f5f5' }}>
                        <Box sx={{ padding: 2 }}>
                          <Typography>Machine Name: {appointment.machineName}</Typography>
                          <Typography>Model: {appointment.model}</Typography>
                          <Typography>Part No: {appointment.partNo}</Typography>
                          <Typography>Serial No: {appointment.serialNo}</Typography>
                          <Typography>Installation Date: {new Date(appointment.installationDate).toLocaleDateString()}</Typography>
                          <Typography>Service Frequency: {appointment.serviceFrequency}</Typography>
                          <Typography>Expected Service Date: {new Date(appointment.expectedServiceDate).toLocaleDateString()}</Typography>
                          <Typography>Service Engineer: {appointment.engineer ? appointment.engineer.name : 'N/A'}</Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
