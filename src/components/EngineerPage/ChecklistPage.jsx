import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  Paper,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios"; // Import axios for API calls

const ChecklistPage = () => {
  const initialChecklist = [
    {
      task: "Make safe as instructed in the service manual",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Carry out repair (after obtaining authorization, if needed)",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check abnormality in Ambient air like Bad odor / Heavy dust",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check control cabinet / cooler filter mats, clean / replace if necessary",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check / clean cooler, check fan blades and guarding",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check coupling / belt tension, tight if necessary",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check / change oil separator cartridge",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check oil separator cartridge, diff. pressure",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check / change the Air filter",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check Air filter cap, Suction hose for any leak or crack / damage",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check / change the Oil filter",
      done: false,
      remark: "",
      inputs: {},
    },
    { task: "Check / change the Oil", done: false, remark: "", inputs: {} },
    {
      task: "Check / change the Valve kits",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check motor bearing lubrication, regrease if necessary",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check electrical connection and tight if necessary",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check motor overcurrent relays and protection switches",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check door and guard interlocks and emergency stop function",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check all sensor connections and tight if necessary",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check and register if any safety device bypassed",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check Control voltage; L1 <TextField> V, Logo Power Output <TextField> V DC.",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check line voltage: L1 <TextField> V, L2 <TextField> V, L3 <TextField> V <TextField>",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check current consumption: Line U1 <TextField> A, V1 <TextField> A, W1 <TextField> A ……..",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check Fan motor current Fan 1 U1 <TextField> A, V1 <TextField> A, W1 <TextField> A",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check Fan motor current Fan 2 U1 <TextField> A, V1 <TextField> A, W1 <TextField> A",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Room temp: <TextField> C, Airend discharge temp.: <TextField> C <TextField>",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Pressure Setting: SP <TextField> bar, SD <TextField> bar",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check for any Air / Oil leakages in the compressor<TextField>",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check and maintain ZK filter Eco drain Valve <TextField>",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Test run, check conditions: start, idle, load and shut-down <TextField>",
      done: false,
      remark: "",
      inputs: {},
    },
  ];

  const initialRefrigeratorList = [
    { task: "Check refrigerant levels", done: false, remark: "", inputs: {} },
    {
      task: "Inspect evaporator and condenser coils",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check door seals for damage",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Clean drain pan and ensure proper drainage",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Verify thermostat operation",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check / clean Air dryer condenser",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check condenser fan motor direction",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check condensate drain function",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check refrigerant circuit and Air circuit for leaks",
      done: false,
      remark: "",
      input: {},
      inputs: {},
    },
    {
      task: "Check compressed air temperature: Inlet <TextField> °C | Outlet <TextField> °C",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check current consumption: Line U1 <TextField> A, V1 <TextField> A, W1 <TextField> A",
      done: false,
      remark: "",
      input: {},
      inputs: {},
    },
    {
      task: "Check Auto On/Off operation; Switching On <TextField> C, Switching Off <TextField> C",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Pressure dew point [ ] blue [ ] green [ ] red <TextField> °F/C",
      done: false,
      remark: "",
      inputs: {},
    },
    {
      task: "Check / Replace Air treatment filter cartridge",
      done: false,
      remark: "",
      inputs: {},
    },
  ];

  const [checklist, setChecklist] = useState(initialChecklist);
  const [refrigeratorList, setRefrigeratorList] = useState(
    initialRefrigeratorList
  );
  const [clientInfo, setClientInfo] = useState({
    name: "",
    contactPerson: "",
    phone: "",
    address: "",
    engineer: ""
  });
  const [authorizedSignature, setAuthorizedSignature] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const location = useLocation();
  
 
  useEffect(() => {
    
    if (location.state) {
      setClientInfo({
        name: location.state.clientName || "",
        contactPerson: location.state.contactPerson || "",
        phone: location.state.phone || "",
        address: location.state.address || "",
        engineer: location.state.engineer.name || ""
      });
      setAppointmentId(location.state.appointmentId); // Store appointment ID
      console.log(appointmentId)
    }
  }, [location.state]);

  const handleCheckboxChange = (index, type) => {
    const newList =
      type === "checklist" ? [...checklist] : [...refrigeratorList];
    newList[index].done = !newList[index].done;
    type === "checklist" ? setChecklist(newList) : setRefrigeratorList(newList);
  };

  const handleRemarkChange = (index, type, event) => {
    const newList =
      type === "checklist" ? [...checklist] : [...refrigeratorList];
    newList[index].remark = event.target.value;
    type === "checklist" ? setChecklist(newList) : setRefrigeratorList(newList);
  };

  const handleInputChange = (index, type, inputName, event) => {
    const newList =
      type === "checklist" ? [...checklist] : [...refrigeratorList];
    newList[index].inputs[inputName] = event.target.value;
    type === "checklist" ? setChecklist(newList) : setRefrigeratorList(newList);
  };

  const handleClientInfoChange = (e) => {
    const { name, value } = e.target;
    setClientInfo({ ...clientInfo, [name]: value });
  };

  const handleGeneratePDFAndSubmit = async () => {
    const doc = new jsPDF();
  
    // Add logo in the top-right corner
    const logo = "https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_640.png"; // Logo URL
    const logoWidth = 40;
    const logoHeight = 40;
    doc.addImage(
      logo,
      "PNG",
      doc.internal.pageSize.getWidth() - logoWidth - 10,
      10,
      logoWidth,
      logoHeight
    );
  
    // Company Name
    doc.setFontSize(14); // Smaller font size
    doc.setFont("helvetica", "bold");
    doc.text("XYZ Company", 14, 20); // Move company name up
  
    // Service Title
    doc.setFontSize(12); // Smaller font size
    doc.setFont("helvetica", "normal");
    doc.text("Service Checklist", 14, 30); // Move service title up
  
    // Client Information Section
    doc.setFontSize(10); // Smaller font size
    doc.setFont("helvetica", "bold");
    doc.text("Client Information", 14, 40); // Move client info header up
  
    // Compact client information
    doc.setFontSize(8); // Even smaller font size
    doc.setFont("helvetica", "normal");
    const clientInfoLines = [
      `Name: ${clientInfo.name}`,
      `Contact: ${clientInfo.contactPerson} | Phone: ${clientInfo.phone}`,
      `Address: ${clientInfo.address}`,
      `Authorized Signature: ${clientInfo.engineer}`
    ];
  
    clientInfoLines.forEach((line, index) => {
      doc.text(line, 14, 50 + (index * 5)); // Adjust line spacing
    });
  
    // Add a horizontal line
    doc.line(10, 80, doc.internal.pageSize.getWidth() - 10, 80); // Move the line up
  
    // Checklists Header
    doc.setFontSize(12); // Smaller font size
    doc.setFont("helvetica", "bold");
    doc.text("Screw Compressor Checklist", 14, 85); // Move header up
  
    // Checklist Table
    autoTable(doc, {
      head: [["Task", "Done", "Remark"]],
      body: checklist.map((item) => {
        const inputs = Object.values(item.inputs).join(", "); // Join all input values into a string
        return [
          item.task.replace(/<TextField>/g, inputs),
          item.done ? "Yes" : "No",
          item.remark,
        ];
      }),
      startY: 90, // Move table up
      styles: {
        fontSize: 9, // Smaller font size for table
        cellPadding: 3, // Smaller padding
        halign: "left",
        valign: "middle",
        lineColor: [22, 160, 133],
        fillColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [22, 160, 133], // Header background color
        textColor: [255, 255, 255], // Header text color
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Alternate row background color
      },
      margin: { top: 10 },
    });
  
    // Refrigerator Checklist Header
    doc.setFontSize(12); // Smaller font size
    doc.setFont("helvetica", "bold");
    doc.text("Refrigerator Checklist", 14, doc.autoTable.previous.finalY + 10); // Adjust positioning
  
    // Refrigerator Checklist Table
    autoTable(doc, {
      head: [["Task", "Done", "Remark"]],
      body: refrigeratorList.map((item) => {
        const inputs = Object.values(item.inputs).join(", "); // Join all input values into a string
        return [
          item.task.replace(/<TextField>/g, inputs),
          item.done ? "Yes" : "No",
          item.remark,
        ];
      }),
      startY: doc.autoTable.previous.finalY + 15, // Move table up
      styles: {
        fontSize: 9, // Smaller font size for table
        cellPadding: 3, // Smaller padding
        halign: "left",
        valign: "middle",
        lineColor: [22, 160, 133],
        fillColor: [255, 255, 255],
      },
      headStyles: {
        fillColor: [22, 160, 133],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
      margin: { top: 10 },
    });
  
    // Add footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(
      "Generated on: " + new Date().toLocaleString(),
      14,
      doc.autoTable.previous.finalY + 15
    );
    doc.text("© XYZ Company", 14, doc.autoTable.previous.finalY + 20);
  
    // Backend upload
    const pdfBlob = doc.output("blob");
    const pdfFile = new File([pdfBlob], "checklist.pdf", { type: "application/pdf" });
  
    // Prepare FormData to send to backend
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    formData.append("checklistData", JSON.stringify({
      clientInfo,
      appointmentId,
      checklist,
      refrigeratorList,
    }));
  
    try {
      // Send the checklist data and PDF to the backend
    const response =  await axios.post("http://localhost:5000/api/checklist", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Checklist and PDF uploaded successfully", response.data);
      const { checklist, appointment } = response.data;
    
      // You can now use checklist and appointment data as needed
      console.log("Saved Checklist:", checklist);
      console.log("Appointment Details:", appointment);
    } catch (error) {
      console.error("Error uploading checklist and PDF:", error);
    }
  
    // Save the PDF locally (optional)
    doc.save("checklist.pdf");
  };
  return (
    <TableContainer
      component={Paper}
      style={{ margin: "20px auto", maxWidth: "900px", padding: "20px" }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{ marginBottom: "10px", fontSize: "20px" }}
      >
        Screw Compressor Checklist
      </Typography>
      <Box sx={{ marginBottom: "10px", padding: "0 10px" }}>
        <Typography variant="h6" sx={{ marginBottom: "5px", fontSize: "16px" }}>
          Client Information
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} md={3}>
            <TextField
              label="Client Name"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              name="name"
              value={clientInfo.name}
              onChange={handleClientInfoChange}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: "#f5f5f5" }, // Light grey background
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Contact Person"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              name="contactPerson" // Fixed the name to "contactPerson"
              value={clientInfo.contactPerson}
              onChange={handleClientInfoChange}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Mobile"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              name="phone"
              value={clientInfo.phone}
              onChange={handleClientInfoChange}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              name="address"
              value={clientInfo.address}
              onChange={handleClientInfoChange}
              InputProps={{
                readOnly: true,
                style: { backgroundColor: "#f5f5f5" },
              }}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Screw Compressor Checklist */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
              }}
            >
              Task
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
              }}
            >
              Done
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
              }}
            >
              Remark
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checklist.map((item, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ fontSize: "12px" }}>
                {item.task.split("<TextField>").map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < item.task.split("<TextField>").length - 1 && (
                      <TextField
                        variant="outlined"
                        size="small"
                        sx={{
                          width: "60px",
                          marginLeft: "4px",
                          marginRight: "4px",
                        }}
                        onChange={(e) =>
                          handleInputChange(index, "checklist", `input${i}`, e)
                        }
                      />
                    )}
                  </span>
                ))}
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={item.done}
                  onChange={() => handleCheckboxChange(index, "checklist")}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  value={item.remark}
                  onChange={(e) => handleRemarkChange(index, "checklist", e)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ fontSize: "12px" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Refrigerator Checklist */}
      <Typography
        variant="h4"
        align="center"
        sx={{ marginTop: "20px", marginBottom: "10px", fontSize: "20px" }}
      >
        Refrigerator Checklist
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
              }}
            >
              Task
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
              }}
            >
              Done
            </TableCell>
            <TableCell
              align="center"
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                backgroundColor: "#f5f5f5",
              }}
            >
              Remark
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {refrigeratorList.map((item, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ fontSize: "12px" }}>
                {item.task.split("<TextField>").map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < item.task.split("<TextField>").length - 1 && (
                      <TextField
                        variant="outlined"
                        size="small"
                        sx={{
                          width: "60px",
                          marginLeft: "4px",
                          marginRight: "4px",
                        }}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "refrigerator",
                            `input${i}`,
                            e
                          )
                        }
                      />
                    )}
                  </span>
                ))}
              </TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={item.done}
                  onChange={() => handleCheckboxChange(index, "refrigerator")}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  value={item.remark}
                  onChange={(e) => handleRemarkChange(index, "refrigerator", e)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ fontSize: "12px" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box
        sx={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}
      >
        <TextField
          label="Authorized Signature"
          variant="outlined"
          size="small"
          value={clientInfo.engineer}
          InputProps={{
            readOnly: true,
            style: { backgroundColor: "#f5f5f5" }, // Light grey background
          }}
          onChange={(e) => setAuthorizedSignature(e.target.value)}
          sx={{ marginRight: "10px" }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleGeneratePDFAndSubmit}
        >
          Submit and Generate PDF
        </Button>
      </Box>
    </TableContainer>
  );
};

export default ChecklistPage;
