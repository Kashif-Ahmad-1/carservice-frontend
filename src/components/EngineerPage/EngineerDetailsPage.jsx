import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "./comp-logo.jpeg";
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
  Pagination,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  Download,
  Menu,
  CheckCircle,
  Search,
  History as HistoryIcon,
} from "@mui/icons-material";
import Sidebar from "./Sidebar"; // Adjust path if necessary
import API_BASE_URL from "./../../config";
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
      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
        ADHUNIK YANTRA UDYOG PVT. LTD.
      </Typography>
    </Toolbar>
  </AppBar>
);

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
  // const [expandedRows, setExpandedRows] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [serviceHistory, setServiceHistory] = useState([]);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State to handle sidebar visibility
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const appointmentsPerPage = 10; // Number of appointments per page
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [nextServiceDates, setNextServiceDates] = useState({});

  const [expandedRows, setExpandedRows] = useState(null);

  const handleNextServiceDateChange = (appointmentId, newDate) => {
    setNextServiceDates((prev) => ({
      ...prev,
      [appointmentId]: newDate,
    }));

    // Assuming you have a way to get the auth token
    const token = localStorage.getItem("token"); // or however you store the token

    fetch(`${API_BASE_URL}/api/appointments/${appointmentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Add the authorization header
      },
      body: JSON.stringify({ nextServiceDate: newDate }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update the appointment");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Updated appointment:", data);
        window.location.reload();
        setAppointments((prevAppointments) => {
          return prevAppointments.map((appointment) =>
            appointment._id === appointmentId
              ? { ...appointment, nextServiceDate: newDate }
              : appointment
          );
        });
      })
      .catch((error) => {
        console.error("Error updating appointment:", error);
      });
  };

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/appointments/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        // Sort appointments by expected service date ascending
        data.sort(
          (a, b) =>
            new Date(a.expectedServiceDate) - new Date(b.expectedServiceDate)
        );
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

  const toggleRow = (clientName) => {
    setExpandedRows((prev) => (prev === clientName ? null : clientName));
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

    // Check for NaN and handle it
    if (isNaN(lastNumber)) {
      console.warn(
        `Invalid document number format: ${lastDocNumber}. Starting from 1.`
      );
      return `${docPrefix}1`;
    }

    const nextNumber = lastNumber + 1;
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

  const handleDownloadPDF = (cloudinaryUrl) => {
    const link = document.createElement("a");
    link.href = cloudinaryUrl; // Use the Cloudinary URL directly
    link.setAttribute("download", cloudinaryUrl.split("/").pop()); // Extract file name from URL
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
        engineer: appointment.engineer.name,
        invoiceNumber: appointment.invoiceNumber,
      },
    });
  };

  // Get current appointments to display
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = Object.entries(groupedAppointments).slice(
    indexOfFirstAppointment,
    indexOfLastAppointment
  );
  const handleChangePage = (event, value) => {
    setCurrentPage(value); // Update the current page
  };
  // Calculate total pages
  const totalPages = Math.ceil(
    Object.keys(groupedAppointments).length / appointmentsPerPage
  );
  // ..................Search Functionality ............................//
  const filteredAppointments = currentAppointments.filter(
    ([key, clientAppointments]) => {
      const [clientName, mobileNo] = key.split("-");
      const firstAppointment = clientAppointments[0];

      const matchesSearch =
        clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (firstAppointment.invoiceNumber &&
          firstAppointment.invoiceNumber.toString().includes(searchTerm)) ||
        (mobileNo && mobileNo.includes(searchTerm)) ||
        (firstAppointment.clientAddress &&
          firstAppointment.clientAddress
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (firstAppointment.contactPerson &&
          firstAppointment.contactPerson
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (firstAppointment.machineName &&
          firstAppointment.machineName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (firstAppointment.model &&
          firstAppointment.model
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (firstAppointment.partNo &&
          firstAppointment.partNo
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (firstAppointment.serialNo &&
          firstAppointment.serialNo
            .toLowerCase()
            .includes(searchTerm.toLowerCase()));

      const matchesFilter =
        filter === "all" ||
        (filter === "completed" && firstAppointment.status === "completed");

      return matchesSearch && matchesFilter;
    }
  );

  // .................................................
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
      }}
    >
      {sidebarOpen && <Sidebar />}
      <Box sx={{ flexGrow: 1 }}>
        <Header onToggleSidebar={handleToggleSidebar} />
        <Container sx={{ padding: 4, flexGrow: 1 }} maxWidth="xl">
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold" }}>
            Client Details
          </Typography>
          <Typography
            variant="h6"
            paragraph
            sx={{ color: "#555", fontSize: "1rem" }}
          >
            Here you can find detailed information about the service
            appointments.
          </Typography>
          <Divider sx={{ marginY: 2 }} />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Search by Client Name"
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ width: "300px" }}
            />
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                displayEmpty
              >
                <MenuItem value="all">All Appointments</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer
            component={Paper}
            elevation={2}
            sx={{ overflowY: "hidden", overflowX: "auto" }}
          >
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  {[
                    "Invoice No.",
                    "Client Name",
                    "Mobile No.",
                    "Client Address",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        fontSize: "1rem",
                        fontWeight: "bold",
                        backgroundColor: "#007acc",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                  {/* Additional headers visible only on larger screens */}
                  {[
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
                    "Next Service Date",
                    "Document",
                    "Checklist",
                    "Invoice",
                    "Service History",
                    "Quotation",
                  ].map((header) => (
                    <TableCell
                      key={header}
                      sx={{
                        display: { xs: "none", md: "table-cell" },
                        fontSize: "1rem",
                        fontWeight: "bold",
                        backgroundColor: "#007acc",
                        color: "#fff",
                        textAlign: "center",
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {appointments.map((appointment) => (
                  <React.Fragment key={appointment._id}>
                    {/* Desktop View */}

                    <TableRow
                      onClick={() => toggleRow(appointment.clientName)}
                      sx={{
                        cursor: "pointer",
                        "&:hover": { backgroundColor: "#e1f5fe" },
                      }}
                    >
                      <TableCell sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                        {appointment.invoiceNumber}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                        {appointment.clientName}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                        {appointment.mobileNo}
                      </TableCell>
                      <TableCell sx={{ fontSize: "1.2rem", fontWeight: 700 }}>
                        {appointment.clientAddress}
                      </TableCell>

                      {/* Additional columns visible only on larger screens */}
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {appointment.contactPerson}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {new Date(
                          appointment.appointmentDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {typeof appointment.appointmentAmount === "number"
                          ? `${appointment.appointmentAmount.toFixed(2)}`
                          : "N/A"}
                      </TableCell>

                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {appointment.machineName}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {appointment.model}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {appointment.partNo}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {appointment.serialNo}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {new Date(
                          appointment.installationDate
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {appointment.serviceFrequency}
                      </TableCell>
                      <TableCell
                        sx={{
                          display: { xs: "none", md: "table-cell" },
                          fontSize: "1.2rem",
                          fontWeight: 700,
                        }}
                      >
                        {new Date(
                          appointment.expectedServiceDate
                        ).toLocaleDateString()}
                      </TableCell>

                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <TextField
                          type="date"
                          variant="outlined"
                          size="small"
                          value={
                            nextServiceDates[appointment._id] ||
                            new Date(appointment.expectedServiceDate)
                              .toISOString()
                              .split("T")[0]
                          }
                          onChange={(e) =>
                            handleNextServiceDateChange(
                              appointment._id,
                              e.target.value
                            )
                          }
                        />
                      </TableCell>

                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        {appointment.document ? (
                          <span
                            onClick={() =>
                              handleDownloadPDF(appointment.document)
                            }
                            style={{ cursor: "pointer" }}
                          >
                            <Download
                              sx={{ color: "blue", fontSize: "1.5rem" }}
                            />
                          </span>
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No Document
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <span
                          onClick={() => handleEditClick(appointment)}
                          style={{ cursor: "pointer" }}
                        >
                          <CheckCircle
                            sx={{ color: "blue", fontSize: "1.5rem" }}
                          />
                        </span>
                      </TableCell>
                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        {appointment.checklists.length > 0 ? (
                          (() => {
                            const sortedChecklists = [
                              ...appointment.checklists,
                            ].sort(
                              (a, b) =>
                                new Date(b.generatedOn) -
                                new Date(a.generatedOn)
                            );
                            const latestChecklist = sortedChecklists[0];
                            return latestChecklist.pdfPath ? (
                              <span
                                onClick={() =>
                                  handleDownloadPDF(latestChecklist.pdfPath)
                                }
                                style={{ cursor: "pointer" }}
                              >
                                <Download
                                  sx={{ color: "blue", fontSize: "1.5rem" }}
                                />
                              </span>
                            ) : (
                              <Typography variant="body2" color="textSecondary">
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
                            handleServiceHistoryClick(appointment.clientName)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <HistoryIcon sx={{ color: "blue" }} />
                        </span>
                      </TableCell>

                      <TableCell
                        sx={{ display: { xs: "none", md: "table-cell" } }}
                      >
                        <span
                          onClick={() => handleQuatation(appointment)}
                          style={{ cursor: "pointer" }}
                        >
                          <Typography
                            variant="body2"
                            color="blue"
                            sx={{ fontSize: "1.2rem", fontWeight: 700 }}
                          >
                            View
                          </Typography>
                        </span>
                      </TableCell>
                    </TableRow>

                    {/* Desktop view End */}
                    {expandedRows === appointment.clientName && (
                      <TableRow>
                        <TableCell colSpan={4}>
                          {/* Mobile Data */}
                          <Box
                            sx={{
                              padding: 2,
                              backgroundColor: "#ffffff",
                              borderRadius: 2,
                              boxShadow: 1,
                              marginBottom: 2,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                marginBottom: 1,
                                fontSize: "1.5rem",
                              }}
                            >
                              Contact Details
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#555", fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Contact Person:</strong>{" "}
                              {appointment.contactPerson}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#555", fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Appointment Date:</strong>{" "}
                              {new Date(
                                appointment.appointmentDate
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#555", fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Invoice Amount:</strong>{" "}
                              {typeof appointment.appointmentAmount === "number"
                                ? `$${appointment.appointmentAmount.toFixed(2)}`
                                : "N/A"}
                            </Typography>

                            <Divider sx={{ marginY: 2 }} />

                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                marginBottom: 1,
                                fontSize: "1.5rem",
                              }}
                            >
                              Machine Details
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Machine Name:</strong>{" "}
                              {appointment.machineName}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Model:</strong> {appointment.model}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Part No:</strong> {appointment.partNo}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Serial No:</strong> {appointment.serialNo}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Installation Date:</strong>{" "}
                              {new Date(
                                appointment.installationDate
                              ).toLocaleDateString()}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Service Frequency:</strong>{" "}
                              {appointment.serviceFrequency}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Expected Service Date:</strong>{" "}
                              {new Date(
                                appointment.expectedServiceDate
                              ).toLocaleDateString()}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{ marginTop: 2, fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Next Service Date:</strong>
                              <TextField
                                type="date"
                                variant="outlined"
                                size="small"
                                sx={{ marginLeft: 1, width: "auto" }}
                                value={
                                  nextServiceDates[appointment._id] ||
                                  new Date(appointment.expectedServiceDate)
                                    .toISOString()
                                    .split("T")[0]
                                }
                                onChange={(e) =>
                                  handleNextServiceDateChange(
                                    appointment._id,
                                    e.target.value
                                  )
                                }
                              />
                            </Typography>

                            <Divider sx={{ marginY: 2 }} />

                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: "bold",
                                marginBottom: 1,
                                fontSize: "1.5rem",
                              }}
                            >
                              Documents
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Document:</strong>
                              {appointment.document ? (
                                <span
                                  onClick={() =>
                                    handleDownloadPDF(appointment.document)
                                  }
                                  style={{
                                    cursor: "pointer",
                                    color: "#007acc",
                                    textDecoration: "underline",
                                  }}
                                >
                                  <Download sx={{ color: "blue" }} />
                                </span>
                              ) : (
                                " No Document"
                              )}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Edit:</strong>
                              <span
                                onClick={() => handleEditClick(appointment)}
                                style={{
                                  cursor: "pointer",
                                  color: "#007acc",
                                  textDecoration: "underline",
                                  marginLeft: 1,
                                }}
                              >
                                <CheckCircle />
                              </span>
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Checklist:</strong>
                              {appointment.checklists.length > 0
                                ? (() => {
                                    const sortedChecklists = [
                                      ...appointment.checklists,
                                    ].sort(
                                      (a, b) =>
                                        new Date(b.generatedOn) -
                                        new Date(a.generatedOn)
                                    );
                                    const latestChecklist = sortedChecklists[0];
                                    return latestChecklist.pdfPath ? (
                                      <span
                                        onClick={() =>
                                          handleDownloadPDF(
                                            latestChecklist.pdfPath
                                          )
                                        }
                                        style={{
                                          cursor: "pointer",
                                          color: "#007acc",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        <Download sx={{ color: "blue" }} />
                                      </span>
                                    ) : (
                                      " No Invoice"
                                    );
                                  })()
                                : " No Checklist"}
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Service History:</strong>
                              <span
                                onClick={() =>
                                  handleServiceHistoryClick(
                                    appointment.clientName
                                  )
                                }
                                style={{
                                  cursor: "pointer",
                                  color: "#007acc",
                                  textDecoration: "underline",
                                  marginLeft: 1,
                                }}
                              >
                                <HistoryIcon sx={{ color: "blue" }} />
                              </span>
                            </Typography>

                            <Typography
                              variant="body2"
                              sx={{ fontSize: "1.1rem", mb: 1 }}
                            >
                              <strong>Quotation:</strong>
                              <span
                                onClick={() => handleQuatation(appointment)}
                                style={{
                                  cursor: "pointer",
                                  color: "#007acc",
                                  textDecoration: "underline",
                                  marginLeft: 1,
                                }}
                              >
                                View
                              </span>
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handleChangePage}
            color="primary"
            sx={{ marginY: 3, display: "flex", justifyContent: "center" }}
          />
        </Container>
      </Box>

      {/* Modal for Service History */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            width: { xs: "90%", sm: 500 },
            maxHeight: "70vh",
            overflowY: "auto",
            padding: 4,
            backgroundColor: "white",
            margin: "auto",
            marginTop: "10%",
            borderRadius: 2,
            boxShadow: 24,
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setOpenModal(false)}
            sx={{ position: "absolute", top: 8, right: 8 }}
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
                  primary={`Date: ${new Date(
                    historyItem.appointmentDate
                  ).toLocaleDateString()}`}
                  secondary={<>{`Machine: ${historyItem.machineName}`}</>}
                />
              </ListItem>
            ))}
          </List>
          <Button
            onClick={() => setOpenModal(false)}
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
