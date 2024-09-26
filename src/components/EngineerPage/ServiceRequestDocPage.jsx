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
import logo from './comp-logo.jpeg';
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Download, Menu, Delete } from "@mui/icons-material"; 
import Sidebar from "./Sidebar";

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
        <img
        src={logo}
        alt="Company Logo"
        style={{ width: 40, height: 40, marginRight: 10 }} // Adjust size and margin as needed
      />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#ff4081" }}>
          Company Name
        </Typography>
      </Toolbar>
    </AppBar>
  );

  const fetchServiceRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/checklist", {
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

  const handleDownloadPDF = (documentPath) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${documentPath}`;
    link.setAttribute("download", documentPath.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDeleteChecklist = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/checklist/${id}`, {
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

  // Search functionality
  const filteredChecklists = checklists.filter((checklist) => {
    const lowerCaseTerm = searchTerm.toLowerCase();
    return (
      checklist.clientInfo?.name.toLowerCase().includes(lowerCaseTerm) ||
      checklist.invoiceNo.toLowerCase().includes(lowerCaseTerm) ||
      checklist.clientInfo?.contactPerson?.toLowerCase().includes(lowerCaseTerm) ||
      checklist.clientInfo?.phone?.toLowerCase().includes(lowerCaseTerm)
    );
  });

  // Pagination logic
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
    setCurrentPage(1); // Reset to first page on new search
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
                          >
                            <Download /> Download
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleDeleteChecklist(checklist._id)}
                          >
                            <Delete /> Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        No results found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Paper>
            {/* Pagination Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button
                variant="contained"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Typography variant="body1">
                Page {currentPage} of {totalPages}
              </Typography>
              <Button
                variant="contained"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
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
