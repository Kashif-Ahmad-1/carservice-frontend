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
    { task: "Make safe as instructed in the service manual", done: false, remark: "" },
    { task: "Carry out repair (after obtaining authorization, if needed)", done: false, remark: "" },
    { task: "Check abnormality in Ambient air like Bad odor / Heavy dust", done: false, remark: "" },
    { task: "Check control cabinet / cooler filter mats, clean / replace if necessary", done: false, remark: "" },
    { task: "Check / clean cooler, check fan blades and guarding", done: false, remark: "" },
    { task: "Check coupling / belt tension, tight if necessary", done: false, remark: "" },
    { task: "Check / change oil separator cartridge", done: false, remark: "" },
    { task: "Check oil separator cartridge, diff. pressure", done: false, remark: "" },
    { task: "Check / change the Air filter", done: false, remark: "" },
    { task: "Check Air filter cap, Suction hose for any leak or crack / damage", done: false, remark: "" },
    { task: "Check / change the Oil filter", done: false, remark: "" },
    { task: "Check / change the Oil", done: false, remark: "" },
    { task: "Check / change the Valve kits", done: false, remark: "" },
    { task: "Check motor bearing lubrication, regrease if necessary", done: false, remark: "" },
    { task: "Check electrical connection and tight if necessary", done: false, remark: "" },
    { task: "Check motor overcurrent relays and protection switches", done: false, remark: "" },
    { task: "Check door and guard interlocks and emergency stop function", done: false, remark: "" },
    { task: "Check all sensor connections and tight if necessary", done: false, remark: "" },
    { task: "Check and register if any safety device bypassed", done: false, remark: "" },
    { task: "Check Control voltage; L1 ________V, Logo Power Output ____________V DC.", done: false, remark: "" },
    { task: "Check line voltage: L1 ________V         L2________ V    L3  ___________V …………………….", done: false, remark: "" },
    { task: "Check current consumption: Line U1 ________   A  V1 ________      A  W1 ________    A ……..", done: false, remark: "" },
    { task: "Check Fan motor current Fan 1 U1 ____   A  V1 ____   A  W1 ____  A", done: false, remark: "" },
    { task: "Check Fan motor current Fan 2 U1 ____   A  V1 ____   A  W1 ____  A", done: false, remark: "" },
    { task: "Room temp:____________C,   Airend discharge temp.:____________C ………………………….", done: false, remark: "" },
    { task: "Pressure Setting.: SP_________    bar,     SD___________   bar   ……", done: false, remark: "" },
    { task: "Check for any Air / Oil leakages in the compressor   ………", done: false, remark: "" },
    { task: "Check and maintain ZK filter Eco drain Valve   ……", done: false, remark: "" },
    { task: "Test run, check conditions: start, idle, load and shut-down  …………………………", done: false, remark: "" },
  ];

  const initialRefrigeratorList = [
    { task: "Check refrigerant levels", done: false, remark: "" },
    { task: "Inspect evaporator and condenser coils", done: false, remark: "" },
    { task: "Check door seals for damage", done: false, remark: "" },
    { task: "Clean drain pan and ensure proper drainage", done: false, remark: "" },
    { task: "Verify thermostat operation", done: false, remark: "" },
    { task: "Check / clean Air dryer condenser", done: false, remark: "" },
    { task: "Check condenser fan motor direction", done: false, remark: "" },
    { task: "Check condensate drain function", done: false, remark: "" },
    { task: "Check refrigerant circuit and Air circuit for leaks", done: false, remark: "" },
    { task: "Check compressed air temperature: Inlet ___________°C | Outlet ___________ °C", done: false, remark: "" },
    { task: "Check current consumption: Line U1 _______A  V1 _________A  W1 _________ A", done: false, remark: "" },
    { task: "Check Auto On/Off operation; Switching On ________C, Switching Off__________C", done: false, remark: "" },
    { task: "Pressure dew point [  ] blue   [  ] green   [  ] red   ___________ °F/C", done: false, remark: "" },
    { task: "Check / Replace Air treatment filter cartridge", done: false, remark: "" },
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

  const handleClientInfoChange = (e) => {
    const { name, value } = e.target;
    setClientInfo({ ...clientInfo, [name]: value });
  };

  const handleGeneratePDF = () => {
    const doc = new jsPDF();

    // Client Information
    doc.setFontSize(10);
    doc.text('Client Information', 10, 10);
    doc.text(`Name: ${clientInfo.name}`, 10, 20);
    doc.text(`Phone: ${clientInfo.phone}`, 10, 30);
    doc.text(`Address: ${clientInfo.address}`, 10, 40);
    doc.text(`Authorized Signature: ${authorizedSignature}`, 10, 50);
    
    // Checklists Header
    doc.text('Screw Compressor Checklist', 10, 60);
    
    // Checklist Table
    autoTable(doc, {
      head: [['Task', 'Done', 'Remark']],
      body: checklist.map(item => [item.task, item.done ? 'Yes' : 'No', item.remark]),
      startY: 65,
      styles: { fontSize: 10 },
    });

    // Refrigerator Checklist Header
    doc.text('Refrigerator Checklist', 10, doc.autoTable.previous.finalY + 10); // Adjusted to start after the previous table

    // Refrigerator Checklist Table
    autoTable(doc, {
      head: [['Task', 'Done', 'Remark']],
      body: refrigeratorList.map(item => [item.task, item.done ? 'Yes' : 'No', item.remark]),
      startY: doc.autoTable.previous.finalY + 15, // Starts below the previous table
      styles: { fontSize: 10 },
    });

    doc.save('checklist.pdf');
  };

  return (
    <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "1200px", padding: "20px" }}>
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
              <TableCell sx={{ fontSize: "12px" }}>{item.task}</TableCell>
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
              <TableCell sx={{ fontSize: "12px" }}>{item.task}</TableCell>
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
