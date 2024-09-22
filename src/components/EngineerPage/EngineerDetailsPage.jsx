import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Container,
  Button,
  Divider,
  Modal,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Download, Menu } from '@mui/icons-material';
import Sidebar from './Sidebar'; // Adjust path if necessary

// Header Component
const Header = ({ onToggleSidebar }) => (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" onClick={onToggleSidebar}>
        <Menu />
      </Button>
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
  const [expandedRows, setExpandedRows] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true); // State to handle sidebar visibility

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/appointments/', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Sort appointments by creation date descending
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointment data', error);
        setError(error);
      }
    };

    fetchAppointmentData();
  }, [engineerId]);

  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev); // Toggle sidebar visibility
  };

  if (error) {
    return <Typography variant="h6" color="error">Error: {error.message}</Typography>;
  }

  if (appointments.length === 0) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const toggleRow = (clientIdentifier) => {
    setExpandedRows(prev => ({ ...prev, [clientIdentifier]: !prev[clientIdentifier] }));
  };

  // Group appointments by client name and mobile number
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const key = `${appointment.clientName}-${appointment.mobileNo}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(appointment);
    return acc;
  }, {});

  const handleEditClick = (appointment) => {
    navigate(`/checklist`, {
      state: {
        clientName: appointment.clientName,
        contactPerson: appointment.contactPerson,
        phone: appointment.mobileNo,
        address: appointment.clientAddress,
        engineer: appointment.engineer,
      },
    });
  };

  const handleDownloadPDF = (documentPath) => {
    const link = document.createElement('a');
    link.href = `http://localhost:5000/${documentPath}`; // Point to your server path
    link.setAttribute('download', documentPath.split('/').pop()); // Use the file name for downloading
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleServiceHistoryClick = (clientName) => {
    const history = appointments.filter(app => app.clientName === clientName); // Fetch service history for the client
    setServiceHistory(history);
    setSelectedClient(clientName);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setServiceHistory([]);
    setSelectedClient(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
      {sidebarOpen && <Sidebar />} {/* Conditionally render Sidebar */}
      <Box sx={{ flexGrow: 1 }}>
        <Header onToggleSidebar={handleToggleSidebar} />
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
                  {["Client Name", "Mobile No.", "Client Address", "Contact Person", "Appointment Date", "Invoice Amount", "Machine Name", "Model", "Part No.", "Serial No.", "Installation Date", "Service Frequency (Days)", "Expected Service Date", "Document", "Checklist", "Service History"].map(header => (
                    <TableCell key={header} sx={{ fontSize: '1.1rem' }}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedAppointments).map(([key, clientAppointments]) => {
                  const [clientName, mobileNo] = key.split('-'); // Destructure client name and mobile number
                  const firstAppointment = clientAppointments[0]; // Get the first appointment to display
                  return (
                    <React.Fragment key={firstAppointment._id}>
                      <TableRow onClick={() => toggleRow(key)} style={{ cursor: 'pointer' }}>
                        <TableCell>{clientName}</TableCell>
                        <TableCell>{mobileNo}</TableCell>
                        <TableCell>{firstAppointment.clientAddress}</TableCell>
                        <TableCell>{firstAppointment.contactPerson}</TableCell>
                        <TableCell>{new Date(firstAppointment.appointmentDate).toLocaleDateString()}</TableCell>
                        <TableCell>{typeof firstAppointment.appointmentAmount === 'number' ? `${firstAppointment.appointmentAmount.toFixed(2)}` : 'N/A'}</TableCell>
                        <TableCell>{firstAppointment.machineName}</TableCell>
                        <TableCell>{firstAppointment.model}</TableCell>
                        <TableCell>{firstAppointment.partNo}</TableCell>
                        <TableCell>{firstAppointment.serialNo}</TableCell>
                        <TableCell>{new Date(firstAppointment.installationDate).toLocaleDateString()}</TableCell>
                        <TableCell>{firstAppointment.serviceFrequency}</TableCell>
                        <TableCell>{new Date(firstAppointment.expectedServiceDate).toLocaleDateString()}</TableCell>
                        <TableCell>
                          {firstAppointment.document ? (
                            <Button variant="outlined" color="primary" onClick={() => handleDownloadPDF(firstAppointment.document)}>
                              <Download />
                            </Button>
                          ) : (
                            <Typography variant="body2" color="textSecondary">No Document</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button variant="contained" color="primary" onClick={() => handleEditClick(firstAppointment)}>
                            Checklist
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" color="secondary" onClick={() => handleServiceHistoryClick(clientName)}>
                            History
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRows[key] && (
                        <TableRow>
                          <TableCell colSpan={15}>
                            <Box sx={{ padding: 2, backgroundColor: '#f9f9f9' }}>
                              <Typography variant="subtitle1">Other Appointments:</Typography>
                              <Table>
                                <TableBody>
                                  {clientAppointments.slice(1).map((appointment) => ( // Skip the first appointment
                                    <TableRow key={appointment._id}>
                                      <TableCell>{appointment.clientName}</TableCell>
                                      <TableCell>{appointment.mobileNo}</TableCell>
                                      <TableCell>{appointment.clientAddress}</TableCell>
                                      <TableCell>{appointment.contactPerson}</TableCell>
                                      <TableCell>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                                      <TableCell>{typeof appointment.appointmentAmount === 'number' ? `${appointment.appointmentAmount.toFixed(2)}` : 'N/A'}</TableCell>
                                      <TableCell>{appointment.machineName}</TableCell>
                                      <TableCell>{appointment.model}</TableCell>
                                      <TableCell>{appointment.partNo}</TableCell>
                                      <TableCell>{appointment.serialNo}</TableCell>
                                      <TableCell>{new Date(appointment.installationDate).toLocaleDateString()}</TableCell>
                                      <TableCell>{appointment.serviceFrequency}</TableCell>
                                      <TableCell>{new Date(appointment.expectedServiceDate).toLocaleDateString()}</TableCell>
                                      <TableCell>
                                        {appointment.document ? (
                                          <Button variant="outlined" color="primary" onClick={() => handleDownloadPDF(appointment.document)}>
                                            <Download />
                                          </Button>
                                        ) : (
                                          <Typography variant="body2" color="textSecondary">No Document</Typography>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Footer />
      </Box>

      {/* Modal for Service History */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{ bgcolor: 'white', padding: 4, borderRadius: 2, width: 600, margin: 'auto', marginTop: '15%' }}>
          <Typography variant="h6" gutterBottom>Service History for {selectedClient}</Typography>
          {serviceHistory.map((history) => (
            <Box key={history._id} sx={{ marginBottom: 2 }}>
              <ListItem>
                <ListItemText
                  primary={`Date: ${new Date(history.appointmentDate).toLocaleDateString()}`}
                  secondary={`Amount: ${history.appointmentAmount.toFixed(2)}`}
                />
              </ListItem>
              {history.document && (
                <Button variant="outlined" onClick={() => handleDownloadPDF(history.document)}>
                  Download Document
                </Button>
              )}
            </Box>
          ))}
          <Button variant="contained" color="primary" onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default EngineerDetailsPage;
