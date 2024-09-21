import React, { useEffect, useState } from 'react';
import {
  Box,
  CssBaseline,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled components
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

const StyledTable = styled('table')(({ theme }) => ({
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

const ServiceRequestPage = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [serviceRequests, setServiceRequests] = useState([]);
  const token = localStorage.getItem('token');

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const fetchServiceRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch service requests');
      }

      const data = await response.json();
      // Sort by createdAt date, latest first
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setServiceRequests(sortedData);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to fetch service requests.");
    }
  };

  useEffect(() => {
    fetchServiceRequests();
  }, [token]);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar open={drawerOpen} onClose={handleDrawerToggle} />
      <MainContent>
        <ToolbarSpacer />
        <Container>
          <SectionTitle variant="h4">Service Requests</SectionTitle>
          <Card>
            <TableContainer component={Paper}>
              <StyledTable>
                <TableHead>
                  <TableRow>
                    <TableCell>Client Name</TableCell>
                    <TableCell>Contact Person</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Accountant Name</TableCell>
                    <TableCell>Engineer Assigned</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceRequests.length > 0 ? (
                    serviceRequests.map((request) => (
                      <TableRow key={request._id}>
                        <TableCell>{request.clientName}</TableCell>
                        <TableCell>{request.contactPerson}</TableCell>
                        <TableCell>{request.createdBy.email}</TableCell>
                        <TableCell>{request.mobileNo}</TableCell>
                        <TableCell>{request.createdBy.name}</TableCell>
                        <TableCell>{request.engineer.name}</TableCell>
                        <TableCell>{request.status}</TableCell>
                        <TableCell>{request.appointmentAmount}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No service requests available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </StyledTable>
            </TableContainer>
          </Card>
        </Container>
      </MainContent>
      <ToastContainer />
    </Box>
  );
};

export default ServiceRequestPage;
