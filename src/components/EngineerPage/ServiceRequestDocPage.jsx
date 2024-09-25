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
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Download, Menu, Delete } from "@mui/icons-material"; // Import Delete icon
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
  const itemsPerPage = 20; // Items to display per page
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#ff4081" }}
        >
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

      // Sort checklists by createdAt in descending order
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

      // Update the state to remove the deleted checklist
      setChecklists((prevChecklists) =>
        prevChecklists.filter((checklist) => checklist._id !== id)
      );

      toast.success("Checklist deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Error deleting checklist!");
    }
  };

  // Pagination logic
  const indexOfLastChecklist = currentPage * itemsPerPage;
  const indexOfFirstChecklist = indexOfLastChecklist - itemsPerPage;
  const currentChecklists = checklists.slice(indexOfFirstChecklist, indexOfLastChecklist);
  const totalPages = Math.ceil(checklists.length / itemsPerPage);

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

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {sidebarOpen && <Sidebar />}
      <MainContent>
        <Header />
        <ToolbarSpacer />
        <Container>
          <SectionTitle variant="h4">Service Request List</SectionTitle>
          <Card>
            <Typography variant="h6">Service Requests</Typography>
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
                  {currentChecklists.map((checklist, index) => (
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
                  ))}
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
