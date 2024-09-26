import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from './comp-logo.jpeg';
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
  Divider,
  Modal,
  List,
  Button,
  ListItem,
  ListItemText,
  IconButton,
  
  
} from "@mui/material";
import {
  Download,
  Menu,
  CheckCircle,
  
  
  History as HistoryIcon,
} from "@mui/icons-material";
import Sidebar from "./Sidebar"; // Adjust path if necessary

// Header Component
const Header = ({ onToggleSidebar }) => (
  <AppBar position="static">
    <Toolbar>
      <Button color="inherit" onClick={onToggleSidebar}>
        <Menu />
      </Button>
      <img
        src={logo}
        alt="Company Logo"
        style={{ width: 40, height: 40, marginRight: 10 }} // Adjust size and margin as needed
      />
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff4081" }}>
        Company Name
      </Typography>
    </Toolbar>
  </AppBar>
)

// Footer Component
const Footer = () => (
  <Box
    sx={{
      padding: 2,
      textAlign: "center",
      backgroundColor: "#f1f1f1",
      marginTop: "auto",
    }}
  >
    <Typography variant="body2">
      © {new Date().getFullYear()} Company Name. All rights reserved.
    </Typography>
  </Box>
);

const headerColor = "#ff4d30"; // Single color code for headers

function EngineerDetailsPage() {
  const { engineerId } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to handle sidebar visibility

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "http://localhost:5000/api/appointments/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Sort appointments by creation date descending
        data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setAppointments(data);
      } catch (error) {
        console.error("Failed to fetch appointment data", error);
        setError(error);
      }
    };

    fetchAppointmentData();
  }, [engineerId]);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev); // Toggle sidebar visibility
  };

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Error: {error.message}
      </Typography>
    );
  }

  if (appointments.length === 0) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const toggleRow = (clientIdentifier) => {
    setExpandedRows((prev) => ({
      ...prev,
      [clientIdentifier]: !prev[clientIdentifier],
    }));
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



  const generateDocumentNumber = (lastDocNumber) => {
    const docPrefix = "DOC:";
    const lastNumber = parseInt(lastDocNumber.replace(docPrefix, ""), 10);
    const nextNumber = isNaN(lastNumber) ? 1 : lastNumber + 1;
    return `${docPrefix}${nextNumber}`;
  };

  const handleEditClick = (appointment) => {

    const lastDocNumber = appointment.checklists.documentNumber || ""; // Replace with your logic to fetch last number
    const newDocumentNumber = generateDocumentNumber(lastDocNumber);

    navigate(`/checklist`, {
      state: {
        appointmentId: appointment._id,
        clientName: appointment.clientName,
        contactPerson: appointment.contactPerson,
        phone: appointment.mobileNo,
        address: appointment.clientAddress,
        engineer: appointment.engineer,
        invoiceNo: appointment.invoiceNumber,
        documentNumber: newDocumentNumber,
      },
    });
  };

  const handleDownloadPDF = (documentPath) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${documentPath}`; // Point to your server path
    link.setAttribute("download", documentPath.split("/").pop()); // Use the file name for downloading
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleServiceHistoryClick = (clientName) => {
    const history = appointments.filter((app) => app.clientName === clientName); // Fetch service history for the client
    setServiceHistory(history);
    setSelectedClient(clientName);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setServiceHistory([]);
    setSelectedClient(null);
  };

  const handleQuatation = (appointment) => {
    navigate(`/pdfcheck`, {
      state: {
        appointmentId: appointment._id,
        clientName: appointment.clientName,
        contactPerson: appointment.contactPerson,
        mobileNo: appointment.mobileNo,
        address: appointment.clientAddress,
        engineer: appointment.engineer,
      },
    });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", minHeight: "100vh" }}>
      {sidebarOpen && <Sidebar />} {/* Conditionally render Sidebar */}
      <Box sx={{ flexGrow: 1 }}>
        <Header onToggleSidebar={handleToggleSidebar} />
        <Container sx={{ padding: 4, flexGrow: 1 }} maxWidth="xl">
          <Typography variant="h4" gutterBottom>
            Client Details
          </Typography>
          <Typography variant="h6" paragraph>
            Here you can find detailed information about the service
            appointments. This includes service history, machine details, and
            upcoming service schedules.
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Invoice No.",
                    "Client Name",
                    "Mobile No.",
                    "Client Address",
                    "Contact Person",
                    "Appointment Date",
                    "Invoice Amount",
                    "Machine Name",
                    "Model",
                    "Part No.",
                    "Serial No.",
                    "Installation Date",
                    "Service Frequency (Days)",
                    "Expected Service Date",
                    "Document",
                    "Checklist",
                    "Invoice",
                    "Service History",
                    "Quotation",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        backgroundColor: headerColor,
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(groupedAppointments).map(
                  ([key, clientAppointments]) => {
                    const [clientName, mobileNo] = key.split("-"); // Destructure client name and mobile number
                    const firstAppointment = clientAppointments[0]; // Get the first appointment to display

                    return (
                      <React.Fragment key={firstAppointment._id}>
                        <TableRow
                          onClick={() => toggleRow(key)}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell>
                            {firstAppointment.invoiceNumber}
                          </TableCell>
                          <TableCell>{clientName}</TableCell>
                          <TableCell>{mobileNo}</TableCell>
                          <TableCell>
                            {firstAppointment.clientAddress}
                          </TableCell>
                          <TableCell>
                            {firstAppointment.contactPerson}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              firstAppointment.appointmentDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {typeof firstAppointment.appointmentAmount ===
                            "number"
                              ? `${firstAppointment.appointmentAmount.toFixed(
                                  2
                                )}`
                              : "N/A"}
                          </TableCell>
                          <TableCell>{firstAppointment.machineName}</TableCell>
                          <TableCell>{firstAppointment.model}</TableCell>
                          <TableCell>{firstAppointment.partNo}</TableCell>
                          <TableCell>{firstAppointment.serialNo}</TableCell>
                          <TableCell>
                            {new Date(
                              firstAppointment.installationDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {firstAppointment.serviceFrequency}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              firstAppointment.expectedServiceDate
                            ).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {firstAppointment.document ? (
                              <span
                                onClick={() =>
                                  handleDownloadPDF(firstAppointment.document)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Download sx={{ color: "blue" }} />
                              </span>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                No Document
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <span
                              onClick={() => handleEditClick(firstAppointment)}
                              style={{ cursor: "pointer" }}
                            >
                              <CheckCircle sx={{ color: "blue" }} />
                            </span>
                          </TableCell>
                          <TableCell>
                            {firstAppointment.checklists.length > 0 ? (
                              // Sort checklists by generatedOn in descending order and get the latest one
                              (() => {
                                const sortedChecklists = [
                                  ...firstAppointment.checklists,
                                ].sort((a, b) => {
                                  return (
                                    new Date(b.generatedOn) -
                                    new Date(a.generatedOn)
                                  );
                                });
                                const latestChecklist = sortedChecklists[0]; // Get the most recent checklist
                                return latestChecklist.pdfPath ? (
                                  <span
                                    onClick={() =>
                                      handleDownloadPDF(latestChecklist.pdfPath)
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    <Download sx={{ color: "blue" }} />
                                  </span>
                                ) : (
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                  >
                                    No Invoice
                                  </Typography>
                                );
                              })()
                            ) : (
                              <Typography variant="body2" color="textSecondary">
                                No Checklist
                              </Typography>
                            )}
                          </TableCell>

                          <TableCell>
                            <span
                              onClick={() =>
                                handleServiceHistoryClick(clientName)
                              }
                              style={{ cursor: "pointer" }}
                            >
                              <HistoryIcon sx={{ color: "blue" }} />
                            </span>
                          </TableCell>
                          <TableCell>
                            <span
                              onClick={() => handleQuatation(firstAppointment)}
                              style={{ cursor: "pointer" }}
                            >
                              <Typography variant="body2" color="blue">
                                View
                              </Typography>
                            </span>
                          </TableCell>
                        </TableRow>
                        {expandedRows[key] && (
                          <TableRow>
                            <TableCell colSpan={17}>
                              <Box
                                sx={{ padding: 2, backgroundColor: "#f9f9f9" }}
                              >
                                <Typography variant="subtitle1">
                                  Other Appointments:
                                </Typography>
                                <Table>
                                  <TableBody>
                                    {clientAppointments.slice(1).map(
                                      (
                                        appointment // Skip the first appointment
                                      ) => (
                                        <TableRow key={appointment._id}>
                                          <TableCell>
                                            {appointment.invoiceNumber}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.clientName}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.mobileNo}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.clientAddress}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.contactPerson}
                                          </TableCell>
                                          <TableCell>
                                            {new Date(
                                              appointment.appointmentDate
                                            ).toLocaleDateString()}
                                          </TableCell>
                                          <TableCell>
                                            {typeof appointment.appointmentAmount ===
                                            "number"
                                              ? `${appointment.appointmentAmount.toFixed(
                                                  2
                                                )}`
                                              : "N/A"}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.machineName}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.model}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.partNo}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.serialNo}
                                          </TableCell>
                                          <TableCell>
                                            {new Date(
                                              appointment.installationDate
                                            ).toLocaleDateString()}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.serviceFrequency}
                                          </TableCell>
                                          <TableCell>
                                            {new Date(
                                              appointment.expectedServiceDate
                                            ).toLocaleDateString()}
                                          </TableCell>
                                          <TableCell>
                                            {appointment.document ? (
                                              <span
                                                onClick={() =>
                                                  handleDownloadPDF(
                                                    appointment.document
                                                  )
                                                }
                                                style={{ cursor: "pointer" }}
                                              >
                                                <Download
                                                  sx={{ color: "blue" }}
                                                />
                                              </span>
                                            ) : (
                                              <Typography
                                                variant="body2"
                                                color="textSecondary"
                                              >
                                                No Document
                                              </Typography>
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            <span
                                              onClick={() =>
                                                handleEditClick(
                                                  firstAppointment
                                                )
                                              }
                                              style={{ cursor: "pointer" }}
                                            >
                                              <CheckCircle
                                                sx={{ color: "blue" }}
                                              />
                                            </span>
                                          </TableCell>
                                          <TableCell>
                                            {firstAppointment.checklists
                                              .length > 0 ? (
                                              // Sort checklists by generatedOn in descending order and get the latest one
                                              (() => {
                                                const sortedChecklists = [
                                                  ...firstAppointment.checklists,
                                                ].sort((a, b) => {
                                                  return (
                                                    new Date(b.generatedOn) -
                                                    new Date(a.generatedOn)
                                                  );
                                                });
                                                const latestChecklist =
                                                  sortedChecklists[0]; // Get the most recent checklist
                                                return latestChecklist.pdfPath ? (
                                                  <span
                                                    onClick={() =>
                                                      handleDownloadPDF(
                                                        latestChecklist.pdfPath
                                                      )
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    <Download
                                                      sx={{ color: "blue" }}
                                                    />
                                                  </span>
                                                ) : (
                                                  <Typography
                                                    variant="body2"
                                                    color="textSecondary"
                                                  >
                                                    No Invoice
                                                  </Typography>
                                                );
                                              })()
                                            ) : (
                                              <Typography
                                                variant="body2"
                                                color="textSecondary"
                                              >
                                                No Checklist
                                              </Typography>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      )
                                    )}
                                  </TableBody>
                                </Table>
                              </Box>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  }
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
        <Footer />
      </Box>
      
      {/* Modal for Service History */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            width: 500,
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: 4,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
            position: 'relative', // Set position relative for positioning the close button
          }}
        >
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            X
          </IconButton>

          <Typography variant="h6">
            {selectedClient}'s Service History
          </Typography>
          <List>
            {serviceHistory.map((historyItem, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`Date: ${new Date(historyItem.appointmentDate).toLocaleDateString()}`}
                  secondary={
                    <>
                      {`Machine: ${historyItem.machineName}`}<br />
                      {historyItem.quotations.map((quote, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                          <span>
                            Quotation No: {quote.quotationNo}, Amount: ${quote.quotationAmount || "N/A"}
                          </span>
                          <IconButton 
                            onClick={() => handleDownloadPDF(quote.pdfPath)} 
                            sx={{ marginLeft: 1 }}
                          >
                            <Download />
                          </IconButton>
                        </div>
                      ))}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Button
            onClick={handleCloseModal}
            variant="contained"
            sx={{ marginTop: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default EngineerDetailsPage;

{
  /* <Modal open={openModal} onClose={handleCloseModal}>
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
                <span onClick={() => handleDownloadPDF(history.document)} style={{ cursor: 'pointer' }}>
                  <Download />
                </span>
              )}
            </Box>
          ))}
          <Button variant="contained" color="primary" size="small" onClick={handleCloseModal}>Close</Button>
        </Box>
      </Modal> */
}
