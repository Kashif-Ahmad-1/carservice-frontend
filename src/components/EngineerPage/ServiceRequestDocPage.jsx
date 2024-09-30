import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Container,
  Paper,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  TextField,
} from "@mui/material";
import API_BASE_URL from './../../config';
import logo from './comp-logo.jpeg';
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Download, Menu, Delete } from "@mui/icons-material"; 
import Sidebar from "./Sidebar";
import axios from 'axios';

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
  overflowX: "auto",
}));

const Table = styled("table")(({ theme }) => ({
  width: "100%",
  borderCollapse: "collapse",
  "& th, & td": {
    padding: theme.spacing(1),
    textAlign: "left",
    borderBottom: `1px solid ${theme.palette.divider}`,
    fontSize: "1.2rem",
    fontWeight: "600",
  },
  "& th": {
    backgroundColor: theme.palette.grey[200],
  },
}));

const ServiceRequestDocPage = () => {
  const [checklists, setChecklists] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; 
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const Header = () => (
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={handleToggleSidebar}>
          <Menu />
        </IconButton>
        <img src={logo} alt="Company Logo" style={{ width: 40, height: 40, marginRight: 10 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
        ADHUNIK YANTRA UDYOG PVT. LTD.
        </Typography>
      </Toolbar>
    </AppBar>
  );

  const fetchServiceRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/checklist`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch service requests");
      }

      const data = await response.json();
      const sortedChecklists = data.sort((a, b) => new Date(b.generatedOn) - new Date(a.generatedOn));
      setChecklists(sortedChecklists);
    } catch (error) {
      toast.error(error.message || "Error fetching service requests!");
    }
  };

  const handleDownloadPDF = (cloudinaryUrl) => {
    const link = document.createElement("a");
    link.href = cloudinaryUrl; // Use the Cloudinary URL directly
    link.setAttribute("download", cloudinaryUrl.split("/").pop()); // Extract file name from URL
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDeleteChecklist = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/checklist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete checklist");
      }

      setChecklists((prevChecklists) => prevChecklists.filter((checklist) => checklist._id !== id));
      toast.success("Checklist deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting checklist!");
    }
  };

  const handleSendPdfToMobile = async (pdfPath, mobileNumber) => {
    try {
      const whatsappAuth = 'Basic ' + btoa('kashif2789:test@123');
      const response = await axios.post('https://cors-anywhere.herokuapp.com/https://app.messageautosender.com/api/v1/message/create', {
        receiverMobileNo: mobileNumber,
        message: [`Here is your PDF: ${pdfPath}`],
      }, {
        headers: {
          'Authorization': whatsappAuth,
          'Content-Type': 'application/json',
        }
      });

      toast.success("PDF sent to mobile successfully!");
    } catch (error) {
      toast.error("Error sending PDF to mobile!");
      console.error(error);
    }
  };

  const filteredChecklists = checklists.filter((checklist) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return (
      checklist.clientInfo?.name.toLowerCase().includes(lowerCaseTerm) ||
      checklist.invoiceNo.toLowerCase().includes(lowerCaseTerm) ||
      checklist.clientInfo?.contactPerson?.toLowerCase().includes(lowerCaseTerm) ||
      checklist.clientInfo?.phone?.toLowerCase().includes(lowerCaseTerm)
    );
  });

  const indexOfLastChecklist = currentPage * itemsPerPage;
  const indexOfFirstChecklist = indexOfLastChecklist - itemsPerPage;
  const currentChecklists = filteredChecklists.slice(indexOfFirstChecklist, indexOfLastChecklist);
  const totalPages = Math.ceil(filteredChecklists.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {sidebarOpen && <Sidebar />}
      <MainContent>
        <Header />
        <ToolbarSpacer />
        <Container>
          <SectionTitle variant="h4">Service Record List</SectionTitle>
          <Card>
            <TextField
              variant="outlined"
              placeholder="Search by Client Name, Invoice No, Contact Person, or Phone"
              value={searchTerm}
              onChange={handleSearchChange}
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Service Requests
            </Typography>
            <Paper sx={{ overflowX: "auto", mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>SR No</th>
                    <th>Invoice No</th>
                    <th>Client Name</th>
                    <th>Contact Person</th>
                    <th>Mobile Number</th>
                    <th>Document</th>
                    <th>Actions</th>
                    <th>Send</th>
                  </tr>
                </thead>
                <tbody>
                  {currentChecklists.length > 0 ? (
                    currentChecklists.map((checklist, index) => (
                      <tr key={checklist._id}>
                        <td>{index + 1 + indexOfFirstChecklist}</td>
                        <td>{checklist.invoiceNo || "N/A"}</td>
                        <td>{checklist.clientInfo?.name || "N/A"}</td>
                        <td>{checklist.clientInfo?.contactPerson || "N/A"}</td>
                        <td>{checklist.clientInfo?.phone || "N/A"}</td>
                        <td>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDownloadPDF(checklist.pdfPath)}
                            size="small"
                          >
                            <Download fontSize="small" /> Download
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteChecklist(checklist._id)}
                            size="small"
                          >
                            <Delete fontSize="small" /> Delete
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSendPdfToMobile(checklist.pdfPath, checklist.clientInfo?.phone)}
                            size="small"
                          >
                            Send
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: "center" }}>
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                sx={{ flexGrow: 1, margin: "0.5rem" }}
              >
                Previous
              </Button>
              <Typography variant="body1" sx={{ margin: "0.5rem" }}>
                Page {currentPage} of {totalPages}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                sx={{ flexGrow: 1, margin: "0.5rem" }}
              >
                Next
              </Button>
            </Box>
          </Card>
        </Container>
      </MainContent>
      <ToastContainer />
    </Box>
  );
};

export default ServiceRequestDocPage;
