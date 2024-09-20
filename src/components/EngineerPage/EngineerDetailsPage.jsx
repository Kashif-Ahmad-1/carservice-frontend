import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Button, Divider } from '@mui/material';
import axios from 'axios';


// Header Component
const Header = () => (
  <AppBar position="static">
    <Toolbar>
      <Typography variant="h6">Company Name</Typography>
    </Toolbar>
  </AppBar>
);

// Footer Component
const Footer = () => (
  <Box sx={{ padding: 2, textAlign: 'center', backgroundColor: '#f1f1f1', marginTop: 'auto' }}>
    <Typography variant="body2">© {new Date().getFullYear()} Company Name. All rights reserved.</Typography>
  </Box>
);

function EngineerDetailsPage() {
  const { engineerId } = useParams(); // Assuming you have engineerId in the URL params
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const token = localStorage.getItem('token'); // Ensure you have the correct token here
        const response = await axios.get('http://localhost:5000/api/appointments/', {
          headers: {
            Authorization: `Bearer ${token}`, // Set the authorization header
          },
        });

        const allAppointments = response.data;

        // Filter appointments for the specific engineer
        const engineerAppointments = allAppointments.filter(appointment => appointment.engineer._id === engineerId);
        
        // Map to extract only the needed fields
        const filteredAppointments = engineerAppointments.map(appointment => ({
          clientName: appointment.clientName,
          clientAddress: appointment.clientAddress,
          contactPerson: appointment.contactPerson,
          mobileNo: appointment.mobileNo,
          invoiceDate: appointment.appointmentDate, // This is treated as the Invoice Date
          invoiceAmount: appointment.appointmentAmount,
          machineName: appointment.machineName,
          model: appointment.model,
          partNo: appointment.partNo,
          serialNo: appointment.serialNo,
          installationDate: appointment.installationDate,
          serviceFrequency: appointment.serviceFrequency,
          expectedServiceDate: appointment.expectedServiceDate,
        }));

        setAppointments(filteredAppointments);
      } catch (error) {
        console.error('Failed to fetch appointment data', error);
        setError('Failed to fetch appointment data');
      }
    };

    fetchAppointmentData();
  }, [engineerId]);

  if (error) {
    return <Typography variant="h6" color="error">Error: {error}</Typography>;
  }

  if (appointments.length === 0) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const handleEditClick = () => {
    navigate(`/checklist`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container sx={{ padding: 4, flexGrow: 1 }} maxWidth="xl">
        <Typography variant="h4" gutterBottom>Client Details</Typography>
        <Typography variant="h6" paragraph>
          Here you can find detailed information about the service appointments. This includes service history, 
          machine details, and upcoming service schedules.
        </Typography>
        <Divider sx={{ marginY: 2 }} />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: theme => theme.palette.grey[200] }}>
                <TableCell sx={{ fontSize: '1.1rem' }}>Client Name</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Client Address</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Contact Person</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Mobile No.</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Invoice Date</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Invoice Amount</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Machine Name</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Model</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Part No.</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Serial No.</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Installation Date</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Service Frequency (Days)</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Expected Service Date</TableCell>
                <TableCell sx={{ fontSize: '1.1rem' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.clientName}>
                  <TableCell>{appointment.clientName}</TableCell>
                  <TableCell>{appointment.clientAddress}</TableCell>
                  <TableCell>{appointment.contactPerson}</TableCell>
                  <TableCell>{appointment.mobileNo}</TableCell>
                  <TableCell>{new Date(appointment.invoiceDate).toLocaleDateString()}</TableCell>
                  <TableCell>${appointment.invoiceAmount.toFixed(2)}</TableCell>
                  <TableCell>{appointment.machineName}</TableCell>
                  <TableCell>{appointment.model}</TableCell>
                  <TableCell>{appointment.partNo}</TableCell>
                  <TableCell>{appointment.serialNo}</TableCell>
                  <TableCell>{new Date(appointment.installationDate).toLocaleDateString()}</TableCell>
                  <TableCell>{appointment.serviceFrequency}</TableCell>
                  <TableCell>{new Date(appointment.expectedServiceDate).toLocaleDateString()}</TableCell>
                  <TableCell sx={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ marginRight: 1 }}
                      onClick={handleEditClick}
                    >
                      Checklist
                    </Button>
                    <Button variant="outlined" color="secondary">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </Box>
  );
}

export default EngineerDetailsPage;

