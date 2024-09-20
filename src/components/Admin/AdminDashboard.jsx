// AdminDashboard.js
import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Styled components
const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const ToolbarSpacer = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const Card = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: '100%', // Make all cards the same height
}));

const CardHeaderStyled = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary.light,
  padding: theme.spacing(1),
  color: theme.palette.common.white,
}));

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mechanicCount, setMechanicCount] = useState(0);
  const [accountantCount, setAccountantCount] = useState(0);
  const [newServiceRequests, setNewServiceRequests] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const token = localStorage.getItem("token");

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const fetchUserCounts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user counts");
      }

      const data = await response.json();
      const mechanics = data.filter((user) => user.role === "engineer").length;
      const accountants = data.filter((user) => user.role === "accountant").length;

      setMechanicCount(mechanics);
      setAccountantCount(accountants);
    } catch (error) {
      console.error("User Count Error:", error);
    }
  };

  const fetchAppointmentCounts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointment counts");
      }

      const appointments = await response.json();
      const newRequests = appointments.filter((appointment) => !appointment.completed).length;
      const activities = appointments
        .map((appointment) => ({
          accountant: appointment.createdBy.name,
          engineer: appointment.engineer.name,
          serviceDate: new Date(appointment.appointmentDate).toLocaleString(),
        }))
        .slice(-3);

      setNewServiceRequests(newRequests);
      setRecentActivities(activities);
    } catch (error) {
      console.error("Appointment Count Error:", error);
    }
  };

  useEffect(() => {
    fetchUserCounts();
    fetchAppointmentCounts();
  }, [token]);

  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Service Requests",
        data: [30, 45, 28, 50, 40, 60],
        backgroundColor: "#ff4d30",
      },
    ],
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Navbar onMenuClick={handleDrawerToggle} />
      <Sidebar open={drawerOpen} onClose={handleDrawerToggle} />
      <MainContent>
        <ToolbarSpacer />
        <Container>
          <SectionTitle variant="h4">Dashboard Overview</SectionTitle>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeaderStyled>Total Engineer</CardHeaderStyled>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4">{mechanicCount}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    component={Link}
                    to="/engineer-list"
                  >
                    View Mechanics
                  </Button>
                </Paper>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeaderStyled>Total Accountants</CardHeaderStyled>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4">{accountantCount}</Typography>
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
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardHeaderStyled>New Service Requests</CardHeaderStyled>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4">{newServiceRequests}</Typography>
                  <Button variant="contained" color="primary" sx={{ mt: 2 }} component={Link} to="/service-request">
                    View Requests
                  </Button>
                </Paper>
              </Card>
            </Grid>
          </Grid>
          <SectionTitle variant="h4" sx={{ mt: 4 }}>
            Service Requests Trend
          </SectionTitle>
          <Paper sx={{ p: 2 }}>
            <Bar data={data} options={{ responsive: true }} />
          </Paper>
          <SectionTitle variant="h4" sx={{ mt: 4 }}>
            Recent Activity
          </SectionTitle>
          <Grid container spacing={3}>
            {recentActivities.map((activity, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardHeaderStyled>
                    New Service Request by {activity.accountant}
                  </CardHeaderStyled>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body1">
                      A new request has been assigned by{" "}
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bold", color: "primary.main" }}
                      >
                        {activity.accountant}
                      </Typography>{" "}
                      to{" "}
                      <Typography
                        component="span"
                        sx={{ fontWeight: "bold", color: "secondary.main" }}
                      >
                        {activity.engineer}
                      </Typography>{" "}
                      on {activity.serviceDate}.
                    </Typography>
                  </Paper>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </MainContent>
    </Box>
  );
};

export default AdminDashboard;
