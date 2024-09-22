import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card as MuiCard,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Styled components
const MainContent = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
}));

const ToolbarSpacer = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontWeight: "bold",
  color: theme.palette.primary.main,
}));

const Card = styled(MuiCard)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  height: "100%",
  boxShadow: theme.shadows[3],
  transition: "transform 0.2s",
  "&:hover": {
    transform: "scale(1.03)",
    boxShadow: theme.shadows[5],
  },
}));

const CardHeaderStyled = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(1),
  color: theme.palette.common.white,
  borderRadius: theme.shape.borderRadius,
}));

const RecentActivityCard = styled(Card)(({ theme }) => ({
  borderLeft: `5px solid ${theme.palette.secondary.main}`,
}));

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [mechanicCount, setMechanicCount] = useState(0);
  const [accountantCount, setAccountantCount] = useState(0);
  const [newServiceRequests, setNewServiceRequests] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [serviceRequestsData, setServiceRequestsData] = useState({ labels: [], data: [] });
  const [viewMode, setViewMode] = useState("day"); // New state for dropdown
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

        // Calculate service requests by day or month
        const requestCountByDay = Array(7).fill(0);
        const requestCountByMonth = Array(12).fill(0);
        
        const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayLabels = Array(7).fill("").map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (date.getDay() - index));
            return `${daysOfWeek[index]} (${date.getDate()}/${date.getMonth() + 1})`;
        });

        appointments.forEach((appointment) => {
            const date = new Date(appointment.createdAt);
            const day = date.getDay();
            requestCountByDay[day]++;
        });

        const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        // Set initial data based on current viewMode
        setServiceRequestsData({
            labels: viewMode === "day" ? dayLabels : monthsOfYear,
            data: viewMode === "day" ? requestCountByDay : requestCountByMonth,
        });

        // Reverse the activities to show the latest first
        const activities = appointments
            .map((appointment) => ({
                accountant: appointment.createdBy ? appointment.createdBy.name : "Unknown Accountant",
                engineer: appointment.engineer ? appointment.engineer.name : "Unknown Engineer",
                createdAt: new Date(appointment.createdAt).toLocaleString(),
            }))
            .reverse()
            .slice(0, 3);

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

  useEffect(() => {
    fetchAppointmentCounts(); // Re-fetch data when viewMode changes
  }, [viewMode]); // Depend on viewMode

  const data = {
    labels: serviceRequestsData.labels,
    datasets: [
      {
        label: "Service Requests",
        data: serviceRequestsData.data,
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
                <CardHeaderStyled>Total Engineers</CardHeaderStyled>
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
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    component={Link}
                    to="/service-request"
                  >
                    View Requests
                  </Button>
                </Paper>
              </Card>
            </Grid>
          </Grid>
          <SectionTitle variant="h4" sx={{ mt: 4 }}>
            Service Requests Trend
          </SectionTitle>
          <FormControl variant="outlined" sx={{ minWidth: 120, mb: 2 }}>
            <InputLabel>View Mode</InputLabel>
            <Select
              value={viewMode}
              onChange={(e) => {
                setViewMode(e.target.value);
              }}
            >
              <MenuItem value="day">Day Wise</MenuItem>
              <MenuItem value="month">Month Wise</MenuItem>
            </Select>
          </FormControl>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2, width: '100%' }}>
            <div style={{ height: "380px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Bar data={data} options={{ responsive: true }} />
            </div>
          </Paper>
          <SectionTitle variant="h4" sx={{ mt: 4 }}>
            Recent Activity
          </SectionTitle>
          <Grid container spacing={3}>
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <RecentActivityCard>
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
                        on {activity.createdAt}.
                      </Typography>
                    </Paper>
                  </RecentActivityCard>
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <RecentActivityCard>
                  <CardHeaderStyled>No Recent Activity</CardHeaderStyled>
                  <Paper sx={{ p: 2, textAlign: "center" }}>
                    <Typography variant="body1">
                      There are currently no recent activities to display.
                    </Typography>
                  </Paper>
                </RecentActivityCard>
              </Grid>
            )}
          </Grid>
        </Container>
      </MainContent>
    </Box>
  );
};

export default AdminDashboard;
