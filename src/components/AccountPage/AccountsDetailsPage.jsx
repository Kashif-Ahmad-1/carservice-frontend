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
  IconButton,
  Tooltip,
  Toolbar,
  AppBar,
  Collapse,
} from '@mui/material';
import AddMachine from './AddMachine';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Add, Download, ExpandMore, ExpandLess } from '@mui/icons-material';

function AppointmentDetailsPage() {
  const [appointments, setAppointments] = useState([]);
  const [showAddClientFields, setShowAddClientFields] = useState(false);
  const [showAddMachineField, setShowAddMachineField] = useState(false);
  const [clientData, setClientData] = useState({ name: '', address: '', contact: '', mobileNo: '' });
  const [machineData, setMachineData] = useState({ name: '' });
  const [openRows, setOpenRows] = useState({});
  const navigate = useNavigate();

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

  const handleRowClick = (id) => {
    setOpenRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (appointments.length === 0) {
    return <Typography variant="h6">Loading...</Typography>;
  }
  const Header = () => (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6">Company Name</Typography>
      </Toolbar>
    </AppBar>
  );
  
  const Footer = () => (
    <Box sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f1f1f1', marginTop: 'auto' }}>
      <Typography variant="body2">© {new Date().getFullYear()} Company Name. All rights reserved.</Typography>
    </Box>
  );

  return (
    <Container sx={{ padding: 2, width: '100%', overflowX: 'hidden', display: 'flex', flexDirection: 'column', minHeight: '100vh' }} maxWidth="xl">
      <Header />
      <br />
      <br />
      <br />
      <ToastContainer />
      <Typography variant="h4" gutterBottom>
        Clients Details
      </Typography>
      <Typography variant="h6" paragraph>
        {/* Write the Text whatever the company Wants */}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', marginBottom: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBackClick}
          sx={{ marginBottom: { xs: 1, sm: 0 }, marginRight: 2 }}
          startIcon={<Add />}
        >
          Create Invoice
        </Button>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddClientClick}
            sx={{ marginBottom: { xs: 1, sm: 0 }, marginRight: 2 }}
            startIcon={<Add />}
          >
            Add Client
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddMachineClick}
            startIcon={<Add />}
          >
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
            sx={{ marginBottom: 2 }}
          />
          <Button variant="contained" color="success" onClick={handleAddClientSubmit}>
            Submit
          </Button>
        </Box>
      )}
      {showAddMachineField && <AddMachine onSubmit={handleAddMachineSubmit} />}
      <Divider sx={{ marginY: 2 }} />
      <TableContainer component={Paper}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme => theme.palette.grey[200] }}>
              {window.innerWidth <= 600 ? (
                <>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Client Name</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Client Address</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Contact Person</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Actions</TableCell>
                </>
              ) : (
                <>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Client Name</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Client Address</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Contact Person</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Mobile No.</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Appointment Date</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Appointment Amount</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Machine Name</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Model</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Part No.</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Serial No.</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Installation Date</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Service Frequency (Days)</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Expected Service Date</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Service Engineer</TableCell>
                  <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Upload Document</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <React.Fragment key={appointment._id}>
                <TableRow onClick={() => handleRowClick(appointment._id)} sx={{ cursor: 'pointer' }}>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.clientAddress}</TableCell>
                  <TableCell>{appointment.contactPerson}</TableCell>
                  {window.innerWidth <= 600 && (
                    <TableCell>
                      <IconButton>
                        {openRows[appointment._id] ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </TableCell>
                  )}
                  {window.innerWidth > 600 && (
                    <>
                      <TableCell>{appointment.mobileNo}</TableCell>
                      <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        {typeof appointment.appointmentAmount === 'number'
                          ? `$${appointment.appointmentAmount.toFixed(2)}`
                          : 'N/A'}
                      </TableCell>
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
                    </>
                  )}
                </TableRow>
                {window.innerWidth <= 600 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Collapse in={openRows[appointment._id]} timeout="auto" unmountOnExit>
                        <Box sx={{ padding: 1 }}>
                          <Typography variant="body2">Mobile No: {appointment.mobileNo}</Typography>
                          <Typography variant="body2">
                            Appointment Date: {new Date(appointment.appointmentDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            Appointment Amount: {typeof appointment.appointmentAmount === 'number'
                              ? `$${appointment.appointmentAmount.toFixed(2)}`
                              : 'N/A'}
                          </Typography>
                          <Typography variant="body2">Machine Name: {appointment.machineName}</Typography>
                          <Typography variant="body2">Model: {appointment.model}</Typography>
                          <Typography variant="body2">Part No: {appointment.partNo}</Typography>
                          <Typography variant="body2">Serial No: {appointment.serialNo}</Typography>
                          <Typography variant="body2">
                            Installation Date: {new Date(appointment.installationDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">Service Frequency: {appointment.serviceFrequency}</Typography>
                          <Typography variant="body2">
                            Expected Service Date: {new Date(appointment.expectedServiceDate).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">Service Engineer: {appointment.engineer.name}</Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Footer />
    </Container>
  );
  
}

export default AppointmentDetailsPage;





