import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, Button, Divider } from '@mui/material';
import axios from 'axios';
import Sidebar from './Sidebar'; // Adjust path if necessary

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
  const { engineerId } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/appointments/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const allAppointments = response.data;
        const engineerAppointments = allAppointments.filter(appointment => appointment.engineer._id === engineerId);
        
        const filteredAppointments = engineerAppointments.map(appointment => ({
          clientName: appointment.clientName,
          clientAddress: appointment.clientAddress,
          contactPerson: appointment.contactPerson,
          mobileNo: appointment.mobileNo,
          invoiceDate: appointment.appointmentDate,
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
    <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
      <Sidebar /> {/* Add Sidebar here */}
      <Box sx={{ flexGrow: 1 }}>
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
                <TableRow>
                  {/* Table Headers */}
                  {["Client Name", "Client Address", "Contact Person", "Mobile No.", "Invoice Date", "Invoice Amount", "Machine Name", "Model", "Part No.", "Serial No.", "Installation Date", "Service Frequency (Days)", "Expected Service Date", "Actions"].map(header => (
                    <TableCell key={header} sx={{ fontSize: '1.1rem' }}>{header}</TableCell>
                  ))}
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
                      <Button variant="contained" color="primary" sx={{ marginRight: 1 }} onClick={handleEditClick}>
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
    </Box>
  );
}

export default EngineerDetailsPage;
