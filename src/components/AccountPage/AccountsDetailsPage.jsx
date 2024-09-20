import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Button, Divider, TextField, Box } from '@mui/material';
import AddMachine from './AddMachine';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function AppointmentDetailsPage() {
  const [appointments, setAppointments] = useState([]);
  const [showAddClientFields, setShowAddClientFields] = useState(false);
  const [showAddMachineField, setShowAddMachineField] = useState(false);
  const [clientData, setClientData] = useState({ name: '', address: '', contact: '' });
  const [machineData, setMachineData] = useState({ name: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token from local storage
        const response = await fetch('http://localhost:5000/api/appointments/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Use the retrieved token
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointment data', error);
      }
    };

    fetchAppointments();
  }, []);


  
  const handleBackClick = () => {
    navigate('/account-add-client'); 
  };

  const handleAddClientClick = () => {
    setShowAddClientFields(!showAddClientFields);
  };

  const handleAddMachineClick = () => {
    setShowAddMachineField(!showAddMachineField);
  };

  const handleInputChange = (e) => {
    setClientData({
      ...clientData,
      [e.target.name]: e.target.value
    });
  };

  const handleMachineChange = (e) => {
    setMachineData({
      ...machineData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddClientSubmit = () => {
    console.log(clientData);
    setClientData({ name: '', address: '', contact: '' });
    setShowAddClientFields(false);
  };

  // const handleAddClientSubmit = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const response = await fetch('http://localhost:5000/api/clients', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(clientData)
  //     });
  //     if (!response.ok) {
  //       throw new Error('Failed to add client');
  //     }
  //     setClientData({ name: '', address: '', contact: '' });
  //     setShowAddClientFields(false);
  //     // Optionally refresh appointments here
  //   } catch (error) {
  //     console.error('Error adding client:', error);
  //   }
  // };

  const handleAddMachineSubmit = async (machineData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/machines', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machineData),
      });
      if (!response.ok) {
        throw new Error('Failed to create machine');
      }
      console.log('Machine created successfully:', machineData);
      setShowAddMachineField(true);
      toast.success("Appointment booked successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // Optionally, refresh the machine list or show a success message
    } catch (error) {
      console.error('Error creating machine:', error);
    }
  };

  const handleDownloadPDF = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/download-pdf/${id}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Appointment_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Error fetching PDF:', await response.text());
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  if (appointments.length === 0) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <Container sx={{ padding: 4, width: '100%', overflowX: 'hidden' }} maxWidth="xl">
      <Typography variant="h4" gutterBottom>Clients Details</Typography>
      <Typography variant="h6" paragraph>
        View and manage your client appointments here. You can download invoices in PDF format or create new invoices.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={handleBackClick} 
        sx={{ marginRight: 2, marginBottom: 2 }}
      >
        + Create Invoice
      </Button>
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={handleAddClientClick} 
        sx={{ marginRight: 2, marginBottom: 2 }}
      >
        + Add Client
      </Button>
      {showAddClientFields && (
        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Client Name"
            name="name"
            value={clientData.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Client Address"
            name="address"
            value={clientData.address}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 1 }}
          />
          <TextField
            label="Contact Person"
            name="contact"
            value={clientData.contact}
            onChange={handleInputChange}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <Button 
            variant="contained" 
            color="success"
            onClick={handleAddClientSubmit}
          >
            Submit
          </Button>
        </Box>
      )}
      <Button
        variant="contained"
        color="success"
        onClick={handleAddMachineClick}
        sx={{ marginBottom: 2 }}
      >
        + Add Machine
      </Button>
      {showAddMachineField && <AddMachine onSubmit={handleAddMachineSubmit} />}
      <Divider sx={{ marginY: 2 }} />
      <TableContainer component={Paper}>
        <Table sx={{ width: '100%' }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme => theme.palette.grey[200] }}>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Client Name</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '15%' }}>Client Address</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Contact Person</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Mobile No.</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Appointment Date</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Appointment Amount</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Machine Name</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Model</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Part No.</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Serial No.</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Installation Date</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Service Frequency (Days)</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Expected Service Date</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Service Engineer</TableCell>
              <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Upload Document</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => (
              <TableRow key={appointment._id}>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.clientName}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.clientAddress}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.contactPerson}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.mobileNo}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{new Date(appointment.appointmentDate).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>
                  {typeof appointment.appointmentAmount === 'number'
                    ? `$${appointment.appointmentAmount.toFixed(2)}`
                    : 'N/A'}
                </TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.machineName}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.model}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.partNo}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.serialNo}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{new Date(appointment.installationDate).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.serviceFrequency}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{new Date(appointment.expectedServiceDate).toLocaleDateString()}</TableCell>
                <TableCell sx={{ fontSize: '1rem' }}>{appointment.engineer.name}</TableCell>
                <TableCell>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={() => handleDownloadPDF(appointment._id)}
                  >
                    Upload Document
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default AppointmentDetailsPage;




// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Button, Divider, TextField, Box } from '@mui/material';

// function AppointmentDetailsPage() {
//   const [appointments, setAppointments] = useState([]);
//   const [showAddClientFields, setShowAddClientFields] = useState(false);
//   const [showAddMachineField, setShowAddMachineField] = useState(false);
//   const [clientData, setClientData] = useState({ name: '', address: '', contact: '' });
//   const [machineData, setMachineData] = useState({ name: '' });
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/api/appointments/get-appointment');
//         const data = await response.json();
//         setAppointments(data); // Adjusted to handle multiple appointments
//       } catch (error) {
//         console.error('Failed to fetch appointment data', error);
//       }
//     };

//     fetchAppointments();
//   }, []);

//   const handleBackClick = () => {
//     navigate('/account-add-client'); 
//   };

//   const handleAddClientClick = () => {
//     setShowAddClientFields(!showAddClientFields); // Toggle input fields visibility
//   };

//   const handleAddMachineClick = () => {
//     setShowAddMachineField(!showAddMachineField); // Toggle input field visibility
//   };

//   const handleInputChange = (e) => {
//     setClientData({
//       ...clientData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleMachineChange = (e) => {
//     setMachineData({
//       ...machineData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleAddClientSubmit = () => {
//     // Handle form submission here
//     console.log(clientData);
//     // Reset fields and hide form
//     setClientData({ name: '', address: '', contact: '' });
//     setShowAddClientFields(false);
//   };

//   const handleAddMachineSubmit = () => {
//     // Handle form submission here
//     console.log(machineData);
//     // Reset field and hide form
//     setMachineData({ name: '' });
//     setShowAddMachineField(false);
//   };

//   const handleDownloadPDF = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:5000/download-pdf/${id}`);
//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const link = document.createElement('a');
//         link.href = url;
//         link.setAttribute('download', `Appointment_${id}.pdf`);
//         document.body.appendChild(link);
//         link.click();
//         link.remove();
//         window.URL.revokeObjectURL(url); // Clean up URL object
//       } else {
//         console.error('Error fetching PDF:', await response.text());
//       }
//     } catch (error) {
//       console.error('Network error:', error);
//     }
//   };

//   if (appointments.length === 0) {
//     return <Typography variant="h6">Loading...</Typography>;
//   }

//   return (
//     <Container sx={{ padding: 4, width: '100%', overflowX: 'hidden' }} maxWidth="xl">
//       <Typography variant="h4" gutterBottom>Clients Details</Typography>
//       <Typography variant="h6" paragraph>
//         View and manage your client appointments here. You can download invoices in PDF format or create new invoices.
//       </Typography>
//       <Button 
//         variant="contained" 
//         color="primary" 
//         onClick={handleBackClick} 
//         sx={{ marginRight: 2, marginBottom: 2 }}
//       >
//         + Create Invoice
//       </Button>
//       <Button 
//         variant="contained" 
//         color="secondary" 
//         onClick={handleAddClientClick} 
//         sx={{ marginRight: 2, marginBottom: 2 }}
//       >
//         + Add Client
//       </Button>
//       {showAddClientFields && (
//         <Box sx={{ marginBottom: 2 }}>
//           <TextField
//             label="Client Name"
//             name="name"
//             value={clientData.name}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ marginBottom: 1 }}
//           />
//           <TextField
//             label="Client Address"
//             name="address"
//             value={clientData.address}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ marginBottom: 1 }}
//           />
//           <TextField
//             label="Contact Person"
//             name="contact"
//             value={clientData.contact}
//             onChange={handleInputChange}
//             fullWidth
//             sx={{ marginBottom: 2 }}
//           />
//           <Button 
//             variant="contained" 
//             color="success"
//             onClick={handleAddClientSubmit}
//           >
//             Submit
//           </Button>
//         </Box>
//       )}
//       <Button 
//         variant="contained" 
//         color="success" 
//         onClick={handleAddMachineClick} 
//         sx={{ marginBottom: 2 }}
//       >
//         + Add Machine
//       </Button>
//       {showAddMachineField && (
//         <Box sx={{ marginBottom: 2 }}>
//           <TextField
//             label="Machine Name"
//             name="name"
//             value={machineData.name}
//             onChange={handleMachineChange}
//             fullWidth
//             sx={{ marginBottom: 2 }}
//           />
//           <Button 
//             variant="contained" 
//             color="success"
//             onClick={handleAddMachineSubmit}
//           >
//             Submit
//           </Button>
//         </Box>
//       )}
//       <Divider sx={{ marginY: 2 }} />
//       <TableContainer component={Paper}>
//         <Table sx={{ width: '100%' }}>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: theme => theme.palette.grey[200] }}>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Client Name</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '15%' }}>Client Address</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Contact Person</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Mobile No.</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Invoice Date</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Invoice Amount</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Machine Name</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Model</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Part No.</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Serial No.</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Installation Date</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Service Frequency (Days)</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Expected Service Date</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Service Engineer</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', maxWidth: '10%' }}>Upload Document</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {appointments.map((appointment) => (
//               <TableRow key={appointment._id}>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.clientName}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.clientAddress}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.contactPerson}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.mobileNo}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{new Date(appointment.invoiceDate).toLocaleDateString()}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>
//                   {typeof appointment.invoiceAmount === 'number'
//                     ? `$${appointment.invoiceAmount.toFixed(2)}`
//                     : 'N/A'}
//                 </TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.machineName}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.model}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.partNo}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.serialNo}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{new Date(appointment.installationDate).toLocaleDateString()}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.serviceFrequency}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{new Date(appointment.expectedServiceDate).toLocaleDateString()}</TableCell>
//                 <TableCell sx={{ fontSize: '1rem' }}>{appointment.serviceEngineer}</TableCell>
//                 <TableCell>
//                   <Button 
//                     variant="outlined" 
//                     color="primary" 
//                     onClick={() => handleDownloadPDF(appointment._id)}
//                   >
//                     Upload Document
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// }

// export default AppointmentDetailsPage;
