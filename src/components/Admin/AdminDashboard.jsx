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
  Modal,
} from "@mui/material";
import API_BASE_URL from './../../config';
import { styled } from "@mui/material/styles";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mechanicCount, setMechanicCount] = useState(0);
  const [accountantCount, setAccountantCount] = useState(0);
  const [newServiceRequests, setNewServiceRequests] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);
  const [serviceRequestsData, setServiceRequestsData] = useState({ labels: [], data: [] });
  const [quotationStatusData, setQuotationStatusData] = useState({ labels: [], data: [] });
  const [viewMode, setViewMode] = useState("day");
  const [modalOpen, setModalOpen] = useState(false);
  const [quotationSummary, setQuotationSummary] = useState({});
  const token = localStorage.getItem("token");

  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  const handleModalOpen = () => {
    fetchQuotationSummary();
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const fetchUserCounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/`, {
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
      const response = await fetch(`${API_BASE_URL}/api/appointments/`, {
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

      const requestCountByDay = Array(7).fill(0);
      const requestCountByMonth = Array(12).fill(0);
      const monthsOfYear = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const today = new Date();
      const todayIndex = today.getDay();

      const dayLabels = Array(7).fill("").map((_, index) => {
        const date = new Date();
        date.setDate(today.getDate() - (todayIndex - index));
        return `${daysOfWeek[index]} (${date.getDate()}/${date.getMonth() + 1})`;
      });

      appointments.forEach((appointment) => {
        const date = new Date(appointment.createdAt);
        const day = date.getDay();
        const month = date.getMonth();
        requestCountByDay[day]++;
        requestCountByMonth[month]++;
      });

      for (let i = todayIndex + 1; i < 7; i++) {
        requestCountByDay[i] = 0;
      }

      setServiceRequestsData({
        labels: viewMode === "day" ? dayLabels : monthsOfYear,
        data: viewMode === "day" ? requestCountByDay : requestCountByMonth,
      });

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

  const fetchQuotationCounts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotations/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch quotation counts");
      }
  
      const quotations = await response.json();
      const completedCount = quotations.filter(q => q.status === true).length;
      const pendingCount = quotations.filter(q => q.status === false).length;
  
      setQuotationStatusData({
        labels: ["Completed", "Pending"],
        data: [completedCount, pendingCount],
      });
    } catch (error) {
      console.error("Quotation Count Error:", error);
    }
  };

  useEffect(() => {
    fetchUserCounts();
    fetchAppointmentCounts();
    fetchQuotationCounts();
  }, [token]);

  useEffect(() => {
    fetchAppointmentCounts();
  }, [viewMode]);

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

  const quotationData = {
    labels: quotationStatusData.labels,
    datasets: [
      {
        label: "Quotation Status",
        data: quotationStatusData.data,
        backgroundColor: ["#4caf50", "#ff9800"],
      },
    ],
  };

  const fetchQuotationSummary = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quotations/admin/summary`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quotation summary");
      }

      const summary = await response.json();
      setQuotationSummary(summary);
    } catch (error) {
      console.error("Quotation Summary Error:", error);
    }
  };

  const pieChartData = {
    labels: ['Total Amount', 'Pending Amount', 'Completed Amount'],
    datasets: [{
      data: [
        quotationSummary.totalAmount || 0,
        quotationSummary.pendingAmount || 0,
        quotationSummary.completedAmount || 0,
      ],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    }],
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
                <CardHeaderStyled>Service Record</CardHeaderStyled>
                <Paper sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="h4">{newServiceRequests}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mt: 2 }}
                    component={Link}
                    to="/service-request"
                  >
                    View Record
                  </Button>
                </Paper>
              </Card>
            </Grid>
          </Grid>
          <SectionTitle variant="h4" sx={{ mt: 4 }}>
            Service Requests Trend & Quotation Status
          </SectionTitle>
          <Grid container spacing={3}>
  <Grid item xs={12} sm={6}>
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2, height: '100%' }}>
      <div style={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Bar data={data} options={{ responsive: true }} />
        </div>
      </div>
    </Paper>
  </Grid>
  <Grid item xs={12} sm={6}>
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 2, height: '100%' }}>
      <div style={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1 }}>
          <Bar data={quotationData} options={{ responsive: true }} />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleModalOpen}
          sx={{ mt: 2, width: '100%' }}
        >
          Total Quotation Amount
        </Button>
      </div>
    </Paper>
  </Grid>
</Grid>


          <Modal
            open={modalOpen}
            onClose={handleModalClose}
            aria-labelledby="quotation-summary-title"
            aria-describedby="quotation-summary-description"
          >
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 3,
                p: 4,
                width: '90%',
                maxWidth: '500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography id="quotation-summary-title" variant="h6" component="h2" sx={{ mb: 2 }}>
               Total Quotation Amount
              </Typography>
              <div style={{ height: "300px", width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {quotationSummary.totalAmount || quotationSummary.pendingAmount || quotationSummary.completedAmount ? (
                  <Pie data={pieChartData} options={{ responsive: true }} />
                ) : (
                  <Typography>No Data Available</Typography>
                )}
              </div>
              <Button variant="contained" color="primary" onClick={handleModalClose} sx={{ mt: 2 }}>
                Close
              </Button>
            </Box>
          </Modal>

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
                        <Typography component="span" sx={{ fontWeight: "bold", color: "primary.main" }}>
                          {activity.accountant}
                        </Typography>{" "}
                        to{" "}
                        <Typography component="span" sx={{ fontWeight: "bold", color: "secondary.main" }}>
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
