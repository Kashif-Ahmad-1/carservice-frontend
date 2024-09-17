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
} from "@mui/material";

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
  ];

  const [checklist, setChecklist] = useState(initialChecklist);

  const handleCheckboxChange = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].done = !newChecklist[index].done;
    setChecklist(newChecklist);
  };

  const handleRemarkChange = (index, event) => {
    const newChecklist = [...checklist];
    newChecklist[index].remark = event.target.value;
    setChecklist(newChecklist);
  };

  return (
    <TableContainer component={Paper} style={{ margin: "20px auto", maxWidth: "1200px" }}>
      <Typography variant="h4" align="center" sx={{ margin: "20px 0", fontSize: "32px" }}>
        Screw Compressor Checklist
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontSize: "18px", fontWeight: "bold" }}>Task</TableCell>
            <TableCell align="center" sx={{ fontSize: "18px", fontWeight: "bold" }}>Done</TableCell>
            <TableCell align="center" sx={{ fontSize: "18px", fontWeight: "bold" }}>Remark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {checklist.map((item, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ fontSize: "16px" }}>{item.task}</TableCell>
              <TableCell align="center">
                <Checkbox
                  checked={item.done}
                  onChange={() => handleCheckboxChange(index)}
                  color="primary"
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  value={item.remark}
                  onChange={(e) => handleRemarkChange(index, e)}
                  variant="outlined"
                  size="small"
                  fullWidth
                  sx={{ fontSize: "16px" }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ChecklistPage;
