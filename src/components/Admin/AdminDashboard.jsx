// AdminDashboard.js
import React, { useState } from 'react';
import { Box, CssBaseline, Container, Grid, Paper, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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
}));

const CardHeaderStyled = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  padding: theme.spacing(1),
  color: theme.palette.common.white,
}));

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const handleDrawerToggle = () => {
    setDrawerOpen(drawerOpen);
  };

  // Dummy data for the chart
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Service Requests',
        data: [30, 45, 28, 50, 40, 60],
        backgroundColor: '#ff4d30',
      },
    ],
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar open={drawerOpen} onClose={handleDrawerToggle} />
      <MainContent>
        <ToolbarSpacer />
        <Container>
          <SectionTitle variant="h4">Dashboard Overview</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardHeaderStyled>Total Mechanics</CardHeaderStyled>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4">23</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    component={Link}
                    to="/mechanics"
                  >
                    View Mechanics
                  </Button>
                </Paper>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardHeaderStyled>Total Accountants</CardHeaderStyled>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4">12</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    component={Link}
                    to="/accountants"
                  >
                    View Accountants
                  </Button>
                </Paper>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardHeaderStyled>Pending Service Requests</CardHeaderStyled>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h4">35</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }}>View Requests</Button>
                </Paper>
              </Card>
            </Grid>
          </Grid>
          <SectionTitle variant="h4" sx={{ mt: 4 }}>Service Requests Trend</SectionTitle>
          <Paper sx={{ p: 2 }}>
            <Bar data={data} options={{ responsive: true }} />
          </Paper>
          <SectionTitle variant="h4" sx={{ mt: 4 }}>Recent Activity</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardHeaderStyled>New Service Request</CardHeaderStyled>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1">A new service request has been created by John Doe.</Typography>
                </Paper>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <Card>
                <CardHeaderStyled>Mechanic Assigned</CardHeaderStyled>
                <Paper sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="body1">Mechanic Jane Smith has been assigned to a new request.</Typography>
                </Paper>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </MainContent>
    </Box>
  );
};

export default AdminDashboard;
