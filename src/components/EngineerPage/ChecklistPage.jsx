import React, { useState } from "react";
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

const ChecklistPage = () => {
  const initialChecklist = [
    { task: "Make safe as instructed in the service manual", done: false, remark: "", inputs: {} },
    { task: "Carry out repair (after obtaining authorization, if needed)", done: false, remark: "" , inputs: {}},
    { task: "Check abnormality in Ambient air like Bad odor / Heavy dust", done: false, remark: "" , inputs: {}},
    { task: "Check control cabinet / cooler filter mats, clean / replace if necessary", done: false, remark: "", inputs: {} },
    { task: "Check / clean cooler, check fan blades and guarding", done: false, remark: "" , inputs: {}},
    { task: "Check coupling / belt tension, tight if necessary", done: false, remark: "" , inputs: {}},
    { task: "Check / change oil separator cartridge", done: false, remark: "" , inputs: {}},
    { task: "Check oil separator cartridge, diff. pressure", done: false, remark: "" , inputs: {}},
    { task: "Check / change the Air filter", done: false, remark: "" , inputs: {}},
    { task: "Check Air filter cap, Suction hose for any leak or crack / damage", done: false, remark: "" , inputs: {}},
    { task: "Check / change the Oil filter", done: false, remark: "" , inputs: {}},
    { task: "Check / change the Oil", done: false, remark: "", inputs: {} },
    { task: "Check / change the Valve kits", done: false, remark: "" , inputs: {}},
    { task: "Check motor bearing lubrication, regrease if necessary", done: false, remark: "" , inputs: {}},
    { task: "Check electrical connection and tight if necessary", done: false, remark: "" , inputs: {}},
    { task: "Check motor overcurrent relays and protection switches", done: false, remark: "" , inputs: {}},
    { task: "Check door and guard interlocks and emergency stop function", done: false, remark: "" , inputs: {}},
    { task: "Check all sensor connections and tight if necessary", done: false, remark: "" , inputs: {}},
    { task: "Check and register if any safety device bypassed", done: false, remark: "" , inputs: {}},
    { task: "Check Control voltage; L1 <TextField> V, Logo Power Output <TextField> V DC.", done: false, remark: "" , inputs: {}},
    { task: "Check line voltage: L1 <TextField> V, L2 <TextField> V, L3 <TextField> V <TextField>", done: false, remark: "" , inputs: {}},
    { task: "Check current consumption: Line U1 <TextField> A, V1 <TextField> A, W1 <TextField> A ……..", done: false, remark: "", inputs: {}},
    { task: "Check Fan motor current Fan 1 U1 <TextField> A, V1 <TextField> A, W1 <TextField> A", done: false, remark: "", inputs: {} },
    { task: "Check Fan motor current Fan 2 U1 <TextField> A, V1 <TextField> A, W1 <TextField> A", done: false, remark: "", inputs: {} },
    { task: "Room temp: <TextField> C, Airend discharge temp.: <TextField> C <TextField>", done: false, remark: "" , inputs: {}},
    { task: "Pressure Setting: SP <TextField> bar, SD <TextField> bar", done: false, remark: "" , inputs: {}},
    { task: "Check for any Air / Oil leakages in the compressor<TextField>", done: false, remark: "" , inputs: {}},
    { task: "Check and maintain ZK filter Eco drain Valve <TextField>", done: false, remark: "" , inputs: {}},
    { task: "Test run, check conditions: start, idle, load and shut-down <TextField>", done: false, remark: "" , inputs: {}},
  ];

  const initialRefrigeratorList = [
    { task: "Check refrigerant levels", done: false, remark: "", inputs: {} },
    { task: "Inspect evaporator and condenser coils", done: false, remark: "" ,  inputs: {}},
    { task: "Check door seals for damage", done: false, remark: "" ,  inputs: {}},
    { task: "Clean drain pan and ensure proper drainage", done: false, remark: "",  inputs: {} },
    { task: "Verify thermostat operation", done: false, remark: "" , inputs: {}},
    { task: "Check / clean Air dryer condenser", done: false, remark: "" , inputs: {}},
    { task: "Check condenser fan motor direction", done: false, remark: "" , inputs: {}},
    { task: "Check condensate drain function", done: false, remark: "" , inputs: {}},
    { task: "Check refrigerant circuit and Air circuit for leaks", done: false, remark: "" , input:{}, inputs: {}},
    { task: "Check compressed air temperature: Inlet <TextField> °C | Outlet <TextField> °C", done: false, remark: "" ,  inputs: {}},
    { task: "Check current consumption: Line U1 <TextField> A, V1 <TextField> A, W1 <TextField> A", done: false, remark: "" , input:{}, inputs: {}},
    { task: "Check Auto On/Off operation; Switching On <TextField> C, Switching Off <TextField> C", done: false, remark: "" , inputs:{}},
    { task: "Pressure dew point [ ] blue [ ] green [ ] red <TextField> °F/C", done: false, remark: "" , inputs:{}},
    { task: "Check / Replace Air treatment filter cartridge", done: false, remark: "" , inputs:{}},
  ];

  const [checklist, setChecklist] = useState(initialChecklist);
  const [refrigeratorList, setRefrigeratorList] = useState(initialRefrigeratorList);
  const [clientInfo, setClientInfo] = useState({ name: '', phone: '', address: '' });
  const [authorizedSignature, setAuthorizedSignature] = useState('');

  const handleCheckboxChange = (index, type) => {
    const newList = type === "checklist" ? [...checklist] : [...refrigeratorList];
    newList[index].done = !newList[index].done;
    type === "checklist" ? setChecklist(newList) : setRefrigeratorList(newList);
  };

  const handleRemarkChange = (index, type, event) => {
    const newList = type === "checklist" ? [...checklist] : [...refrigeratorList];
    newList[index].remark = event.target.value;
    type === "checklist" ? setChecklist(newList) : setRefrigeratorList(newList);
  };

    const handleInputChange = (index, type, inputName, event) => {
    const newList = type === "checklist" ? [...checklist] : [...refrigeratorList];
    newList[index].inputs[inputName] = event.target.value;
    type === "checklist" ? setChecklist(newList) : setRefrigeratorList(newList);
  };

  const handleClientInfoChange = (e) => {
    const { name, value } = e.target;
    setClientInfo({ ...clientInfo, [name]: value });
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Add logo in the top-right corner
    const logo = "https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_640.png"; // Logo URL
    const logoWidth = 40;
    const logoHeight = 40;
    doc.addImage(logo, 'PNG', doc.internal.pageSize.getWidth() - logoWidth - 10, 10, logoWidth, logoHeight);

    // Company Name
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    doc.text('XYZ Company', 14, 30); // Company name position

    // Service Title
    doc.setFontSize(18);
    doc.setFont("helvetica", "normal");
    doc.text('Service Checklist', 14, 50); // Service title position

    // Client Information Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('Client Information', 14, 65);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${clientInfo.name}`, 14, 75);
    doc.text(`Phone: ${clientInfo.phone}`, 14, 85);
    doc.text(`Address: ${clientInfo.address}`, 14, 95);
    doc.text(`Authorized Signature: ${authorizedSignature}`, 14, 105);

    // Add a horizontal line
    doc.line(10, 110, doc.internal.pageSize.getWidth() - 10, 110);

    // Checklists Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('Screw Compressor Checklist', 14, 125);

    // Checklist Table
    autoTable(doc, {
        head: [['Task', 'Done', 'Remark']],
        body: checklist.map(item => {
                      const inputs = Object.values(item.inputs).join(", "); // Join all input values into a string
                      return [item.task.replace(/<TextField>/g, inputs), item.done ? 'Yes' : 'No', item.remark];
                  }),
        startY: 130,
        styles: {
            fontSize: 10,
            cellPadding: 5,
            halign: 'left',
            valign: 'middle',
            lineColor: [22, 160, 133],
            fillColor: [255, 255, 255],
        },
        headStyles: {
            fillColor: [22, 160, 133], // Header background color
            textColor: [255, 255, 255], // Header text color
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240], // Alternate row background color
        },
        margin: { top: 10 },
    });

    // Refrigerator Checklist Header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text('Refrigerator Checklist', 14, doc.autoTable.previous.finalY + 15);

    // Refrigerator Checklist Table

    autoTable(doc, {
        head: [['Task', 'Done', 'Remark']],
        body: refrigeratorList.map(item => {
            const inputs = Object.values(item.inputs).join(", "); // Join all input values into a string
            return [item.task.replace(/<TextField>/g, inputs), item.done ? 'Yes' : 'No', item.remark];
        }),
        startY: doc.autoTable.previous.finalY + 20,
        styles: {
            fontSize: 10,
            cellPadding: 5,
            halign: 'left',
            valign: 'middle',
            lineColor: [22, 160, 133],
            fillColor: [255, 255, 255],
        },
        headStyles: {
            fillColor: [22, 160, 133],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240],
        },
        margin: { top: 10 },
    });

    // Add footer
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text('Generated on: ' + new Date().toLocaleString(), 14, doc.autoTable.previous.finalY + 15);
    doc.text('© XYZ Company', 14, doc.autoTable.previous.finalY + 20);

    // Save the PDF
    doc.save('checklist.pdf');
};





   return (
    <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "900px", padding: "20px" }}>
      <Typography variant="h4" align="center" sx={{ marginBottom: "10px", fontSize: "20px" }}>
        Screw Compressor Checklist
      </Typography>
      <Box sx={{ marginBottom: "10px", padding: "0 10px" }}>
        <Typography variant="h6" sx={{ marginBottom: "5px", fontSize: "16px" }}>
          Client Information
        </Typography>
        <Grid container spacing={1}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              name="name"
              onChange={handleClientInfoChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Phone"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              name="phone"
              onChange={handleClientInfoChange}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              size="small"
              name="address"
              onChange={handleClientInfoChange}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Screw Compressor Checklist */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "14px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Task</TableCell>
            <TableCell align="center" sx={{ fontSize: "14px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Done</TableCell>
            <TableCell align="center" sx={{ fontSize: "14px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Remark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checklist.map((item, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ fontSize: "12px" }}>
                {item.task.split('<TextField>').map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < item.task.split('<TextField>').length - 1 && (
                      <TextField
                        variant="outlined"
                        size="small"
                        sx={{ width: '60px', marginLeft: '4px', marginRight: '4px' }}
                        onChange={(e) => handleInputChange(index, "checklist", `input${i}`, e)}
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
      <Typography variant="h4" align="center" sx={{ marginTop: "20px", marginBottom: "10px", fontSize: "20px" }}>
        Refrigerator Checklist
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "14px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Task</TableCell>
            <TableCell align="center" sx={{ fontSize: "14px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Done</TableCell>
            <TableCell align="center" sx={{ fontSize: "14px", fontWeight: "bold", backgroundColor: "#f5f5f5" }}>Remark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {refrigeratorList.map((item, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ fontSize: "12px" }}>
                {item.task.split('<TextField>').map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < item.task.split('<TextField>').length - 1 && (
                      <TextField
                        variant="outlined"
                        size="small"
                        sx={{ width: '60px', marginLeft: '4px', marginRight: '4px' }}
                        onChange={(e) => handleInputChange(index, "refrigerator", `input${i}`, e)}
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
      <Button
        variant="contained"
        color="primary"
        sx={{ margin: "20px", display: "block", marginLeft: "auto", marginRight: "auto" }}
        onClick={handleGeneratePDF}
      >
        Done
      </Button>
      <Box sx={{ textAlign: "center", marginTop: "20px", backgroundColor: "#f5f5f5", padding: "10px" }}>
        <Typography variant="body2">Authorized Signature:</Typography>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          sx={{ backgroundColor: "#e0e0e0" }}
          value={authorizedSignature}
          onChange={(e) => setAuthorizedSignature(e.target.value)}
        />
      </Box>
    </TableContainer>
  );
};

export default ChecklistPage;

