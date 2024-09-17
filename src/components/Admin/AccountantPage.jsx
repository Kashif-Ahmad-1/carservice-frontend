// AccountantPage.js
import React from 'react';
import { Box, CssBaseline, Container, Grid, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

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

const Table = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'collapse',
  '& th, & td': {
    padding: theme.spacing(1),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& th': {
    backgroundColor: theme.palette.grey[200],
  },
}));

const ButtonContainer = styled('div')(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const AccountantPage = () => {
  // Dummy data for the table
  const accountants = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', phone: '555-123-4567' },
    { id: 2, name: 'Bob Brown', email: 'bob@example.com', phone: '555-987-6543' },
    // Add more dummy data as needed
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar />
      <Sidebar />
      <MainContent>
        <ToolbarSpacer />
        <Container>
          <SectionTitle variant="h4">Accountant List</SectionTitle>
          <ButtonContainer>
            <Button variant="contained" color="primary">Add Accountant</Button>
          </ButtonContainer>
          <Card>
            <Typography variant="h6">Accountants</Typography>
            <Paper sx={{ overflowX: 'auto', mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accountants.map(accountant => (
                    <tr key={accountant.id}>
                      <td>{accountant.name}</td>
                      <td>{accountant.email}</td>
                      <td>{accountant.phone}</td>
                      <td>
                        <Button variant="contained" color="secondary" sx={{ mr: 1 }}>Edit</Button>
                        <Button variant="outlined" color="error">Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Paper>
          </Card>
        </Container>
      </MainContent>
    </Box>
  );
};

export default AccountantPage;
