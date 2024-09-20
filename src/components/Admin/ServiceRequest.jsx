import React from 'react';
import { Box, CssBaseline, Container, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Dummy data
  const serviceRequests = [
    {
      clientName: "John Doe",
      contactPerson: "Jane Doe",
      email: "jane.doe@example.com",
      phone: "123-456-7890",
      accountant: "Accountant 1",
      engineer: "Engineer 1",
      status: "Pending",
      payment: "Pending",
    },
    {
      clientName: "Alice Smith",
      contactPerson: "Bob Smith",
      email: "bob.smith@example.com",
      phone: "987-654-3210",
      accountant: "Accountant 2",
      engineer: "Engineer 2",
      status: "Completed",
      payment: "Paid",
    },
    {
      clientName: "Charlie Brown",
      contactPerson: "Lucy Brown",
      email: "lucy.brown@example.com",
      phone: "555-555-5555",
      accountant: "Accountant 3",
      engineer: "Engineer 3",
      status: "In Progress",
      payment: "Pending",
    },
  ];

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
                    <TableCell>Accountant</TableCell>
                    <TableCell>Engineer</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Payment</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceRequests.map((request, index) => (
                    <TableRow key={index}>
                      <TableCell>{request.clientName}</TableCell>
                      <TableCell>{request.contactPerson}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>{request.phone}</TableCell>
                      <TableCell>{request.accountant}</TableCell>
                      <TableCell>{request.engineer}</TableCell>
                      <TableCell>{request.status}</TableCell>
                      <TableCell>{request.payment}</TableCell>
                    </TableRow>
                  ))}
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
