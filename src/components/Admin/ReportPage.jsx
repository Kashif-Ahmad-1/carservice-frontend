import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Line } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement,
  CategoryScale,
} from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, Title, Tooltip, Legend, Filler, BarElement, CategoryScale);

const ReportPage = () => {
  const [quotationData, setQuotationData] = useState([]);
  const [dailyData, setDailyData] = useState({ labels: [], amounts: [], counts: [] });
  const [appointmentData, setAppointmentData] = useState({ statistics: {}, accountantCount: 0 });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyQuotationAmount, setDailyQuotationAmount] = useState(0);
  const [dailyQuotationCount, setDailyQuotationCount] = useState(0);
  const [timeRange, setTimeRange] = useState(7); // Default to 7 days
  const [drawerOpen, setDrawerOpen] = useState(false);
  const token = localStorage.getItem("token");

  const handleToggleSidebar = () => {
    setDrawerOpen((prev) => !prev);
  };

  const fetchQuotations = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/quotations/', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch quotations");
      }

      const data = await response.json();
      setQuotationData(data);
      processDailyData(data); // Process data after fetching
    } catch (error) {
      console.error("Error fetching quotations:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/statistics', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointment statistics");
      }

      const data = await response.json();
      console.log("Fetched Appointment Data:", data);
      setAppointmentData(data);
    } catch (error) {
      console.error("Error fetching appointment statistics:", error);
    }
  };

  const processDailyData = (quotations) => {
    const amounts = {};
    const counts = {};
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - timeRange);

    for (let i = 0; i <= timeRange; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      amounts[date.toDateString()] = 0;
      counts[date.toDateString()] = 0;
    }

    quotations.forEach(quotation => {
      const createdOn = new Date(quotation.generatedOn);
      if (createdOn >= startDate && createdOn <= today) {
        amounts[createdOn.toDateString()] += quotation.quotationAmount || 0;
        counts[createdOn.toDateString()] += 1;
      }
    });

    const labels = [];
    const dataAmounts = [];
    const dataCounts = [];

    for (let i = 0; i <= timeRange; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      labels.push(date.toDateString());
      dataAmounts.push(amounts[date.toDateString()]);
      dataCounts.push(counts[date.toDateString()]);
    }

    setDailyData({
      labels,
      amounts: dataAmounts,
      counts: dataCounts,
    });
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleTimeRangeChange = (event) => {
    const newTimeRange = event.target.value;
    setTimeRange(newTimeRange);
    processDailyData(quotationData);
  };

  const checkDailyQuotations = () => {
    const date = new Date(selectedDate);
    let totalAmount = 0;
    let totalCount = 0;

    quotationData.forEach(quotation => {
      const createdOn = new Date(quotation.generatedOn);
      if (createdOn.toDateString() === date.toDateString()) {
        totalAmount += quotation.quotationAmount || 0;
        totalCount += 1;
      }
    });

    setDailyQuotationAmount(totalAmount);
    setDailyQuotationCount(totalCount);
  };

  useEffect(() => {
    fetchQuotations();
    fetchAppointments();
  }, [token]);

  useEffect(() => {
    if (quotationData.length > 0) {
      processDailyData(quotationData);
    }
  }, [quotationData, timeRange]);

  const chartData = {
    labels: dailyData.labels,
    datasets: [
      {
        label: 'Total Amount (Day-wise)',
        data: dailyData.amounts,
        fill: false,
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
        yAxisID: 'y1',
      },
      {
        label: 'Total Quotations (Count)',
        data: dailyData.counts,
        fill: false,
        backgroundColor: '#2196F3',
        borderColor: '#2196F3',
        yAxisID: 'y2',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y1: { type: 'linear', position: 'left' },
      y2: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
      },
    },
  };

  const appointmentLabels = [];
  const appointmentAmounts = [];
  const appointmentCounts = [];

  for (const [id, stat] of Object.entries(appointmentData.statistics)) {
    appointmentLabels.push(stat.engineerName);
    appointmentAmounts.push(stat.totalAmount || 0);
    appointmentCounts.push(stat.appointmentCount || 0);
  }

  const accountantCount = appointmentData.accountantCount || 0;

  const appointmentChartData = {
    labels: appointmentLabels,
    datasets: [
      {
        label: 'Invoice Amount',
        data: appointmentAmounts,
        backgroundColor: '#FF6384',
        yAxisID: 'y1',
      },
      {
        label: 'Invoice Count',
        data: appointmentCounts,
        backgroundColor: '#36A2EB',
        yAxisID: 'y',
      },
    ],
  };

  const appointmentOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Invoice Count' } },
      y1: {
        beginAtZero: true,
        position: 'right',
        title: { display: true, text: 'Total Amount' },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar onMenuClick={handleToggleSidebar} />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar open={drawerOpen} onClose={handleToggleSidebar} />
        <Container sx={{ flex: 1, padding: 2 }}>
          <Typography variant="h4" sx={{ mb: 4 }}>Daily Quotation Report</Typography>

          <Paper sx={{ padding: 3, overflow: 'hidden' }}>
            <Typography variant="h6">Quotations Generated Amount and Count by Day</Typography>
            <FormControl variant="outlined" sx={{ mb: 2, minWidth: 120 }}>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                onChange={handleTimeRangeChange}
                label="Time Range"
              >
                <MenuItem value={7}>Last 7 Days</MenuItem>
                <MenuItem value={15}>Last 15 Days</MenuItem>
                <MenuItem value={30}>Last 30 Days</MenuItem>
                <MenuItem value={60}>Last 60 Days</MenuItem>
                <MenuItem value={90}>Last 90 Days</MenuItem>
                <MenuItem value={365}>Last Year</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ height: 300, position: 'relative' }}>
              <Line data={chartData} options={options} />
            </Box>
          </Paper>

          {/* <Box sx={{ mt: 4 }}>
            <Typography variant="h6">Check Quotations on a Specific Date</Typography>
            <TextField
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              sx={{ mr: 2 }}
            />
            <Button variant="contained" onClick={checkDailyQuotations}>Check Amount</Button>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total Quotations Generated on {selectedDate}: {dailyQuotationCount} (Total Amount: {dailyQuotationAmount})
            </Typography>
          </Box> */}

          {/* Appointment Statistics Chart */}
          <Paper sx={{ padding: 3, mt: 4 }}>
            <Typography variant="h6">Invoice Statistics</Typography>
            <Box sx={{ height: 300, position: 'relative' }}>
              {appointmentLabels.length > 0 ? (
                <Bar data={appointmentChartData} options={appointmentOptions} />
              ) : (
                <Typography>No invoice statistics available.</Typography>
              )}
            </Box>
            <Typography variant="body1" sx={{ mt: 2 }}>
              Total Accountants: {accountantCount}
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ReportPage;
