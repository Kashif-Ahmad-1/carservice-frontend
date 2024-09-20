import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';

function AddMachine({ onSubmit }) {
  const [machineData, setMachineData] = useState({ name: '', quantity: '' });

  const handleInputChange = (e) => {
    setMachineData({
      ...machineData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSubmit(machineData);
    setMachineData({ name: '', quantity: '' });
  };

  return (
    <Box sx={{ marginBottom: 2 }}>
      <TextField
        label="Machine Name"
        name="name"
        value={machineData.name}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 1 }}
      />
      <TextField
        label="Quantity"
        name="quantity"
        type="number"
        value={machineData.quantity}
        onChange={handleInputChange}
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button variant="contained" color="success" onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  );
}

export default AddMachine;
