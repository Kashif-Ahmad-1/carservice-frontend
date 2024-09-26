import React, { useEffect, useState } from "react";
import logo from "./comp-logo.jpeg";
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
import { styled } from "@mui/material/styles";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Download, Menu } from "@mui/icons-material";
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

const QuotationPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [filteredQuotations, setFilteredQuotations] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Items per page
  const [searchTerm, setSearchTerm] = useState("");

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  useEffect(() => {
    setFilteredQuotations(
      quotations.filter(
        (quotation) =>
          quotation.clientInfo.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          quotation.quotationNo
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          quotation.clientInfo.contactPerson
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    );
    setCurrentPage(1); // Reset to first page on search
  }, [searchTerm, quotations]);

  // Header Component
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
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#ff4081" }}
        >
          Company Name
        </Typography>
      </Toolbar>
    </AppBar>
  );

  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("http://localhost:5000/api/quotations", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to fetch quotations: ${response.status} - ${errorData.message}`
        );
      }

      const data = await response.json();
      // Optional: Validate the data structure
      const validData = data.filter((quotation) => quotation.clientInfo); // Only keep valid quotations
      // Sort quotations by created date (assuming there is a `createdAt` field)
    validData.sort((a, b) => new Date(b.generatedOn) - new Date(a.generatedOn));
      setQuotations(validData);
    } catch (error) {
      toast.error(error.message || "Error fetching quotations!");
    }
  };

  const handleStatusUpdate = async (quotation) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/quotations/${quotation._id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success("Quotation status updated!");
      fetchQuotations();
    } catch (error) {
      toast.error(error.message);
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

  // Pagination logic
  const indexOfLastQuotation = currentPage * itemsPerPage;
  const indexOfFirstQuotation = indexOfLastQuotation - itemsPerPage;
  const currentQuotations = filteredQuotations.slice(
    indexOfFirstQuotation,
    indexOfLastQuotation
  );
  const totalPages = Math.ceil(filteredQuotations.length / itemsPerPage);

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
          <SectionTitle variant="h4">Quotation List</SectionTitle>
          <Card>
            <TextField
              variant="outlined"
              placeholder="Search by Client Name, Quotation No, or Contact Person"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
            />
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              Quotations
            </Typography>
            <Paper sx={{ overflowX: "auto", mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>SR No</th>
                    <th>Quotation No</th>
                    <th>Client</th>
                    <th>Contact Person</th>
                    <th>Mobile Number</th>
                    <th>Quotation Amount (Rs)</th>
                    <th>Status</th>
                    <th>Document</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQuotations.length > 0 ? (
                    currentQuotations.map((quotation, index) => (
                      <tr key={quotation._id}>
                        <td>{index + 1 + indexOfFirstQuotation}</td>
                        <td>{quotation.quotationNo}</td>
                        <td>{quotation.clientInfo.name}</td>
                        <td>{quotation.clientInfo.contactPerson}</td>

                        <td>{quotation.clientInfo.phone}</td>
                        <td>{quotation.quotationAmount}</td>
                        <td>
                          <Button
                            variant="contained"
                            color={quotation.status ? "success" : "warning"}
                            onClick={() => handleStatusUpdate(quotation)}
                          >
                            {quotation.status ? "Complete" : "Pending"}
                          </Button>
                        </td>
                        <td>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleDownloadPDF(quotation.pdfPath)}
                          >
                            <Download /> Download
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
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}
            >
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

export default QuotationPage;
