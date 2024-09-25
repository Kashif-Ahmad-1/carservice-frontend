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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev); // Toggle sidebar visibility
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  // Header Component
  const Header = () => (
    <AppBar position="static">
      <Toolbar>
        <IconButton color="inherit" onClick={handleToggleSidebar}>
          <Menu />
        </IconButton>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#ff4081" }}>
          Company Name
        </Typography>
      </Toolbar>
    </AppBar>
  );

  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming you store the token in localStorage
      const response = await fetch("http://localhost:5000/api/quotations", {
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
      setQuotations(data);
    } catch (error) {
      toast.error(error.message || "Error fetching quotations!");
    }
  };

  const handleStatusUpdate = async (quotation) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/quotations/${quotation._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success("Quotation status updated!");
      fetchQuotations(); // Refresh the list after updating
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDownloadPDF = (documentPath) => {
    const link = document.createElement("a");
    link.href = `http://localhost:5000/${documentPath}`; // Point to your server path
    link.setAttribute("download", documentPath.split("/").pop()); // Use the file name for downloading
    document.body.appendChild(link);
    link.click();
    link.remove();
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
            <Typography variant="h6">Quotations</Typography>
            <Paper sx={{ overflowX: "auto", mt: 2 }}>
              <Table>
                <thead>
                  <tr>
                    <th>SR No</th>
                    <th>Quotation</th>
                    <th>Client</th>
                    <th>Contact Person</th>
                    <th>Mobile Number</th>
                    <th>Status</th>
                    <th>Document</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map((quotation, index) => (
                    <tr key={quotation._id}>
                      <td>{index + 1}</td>
                      <td>{quotation.quotationNo}</td>
                      <td>{quotation.clientInfo.name}</td>
                      <td>{quotation.clientInfo.contactPerson}</td>
                      <td>{quotation.clientInfo.phone}</td>
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
                          onClick={() => handleDownloadPDF(quotation.pdfPath)} // Call download on click
                        >
                          <Download /> Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Paper>
          </Card>
        </Container>
      </MainContent>
      <ToastContainer />
    </Box>
  );
};

export default QuotationPage;