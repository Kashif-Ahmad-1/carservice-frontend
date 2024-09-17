// src/pages/EngineerDetailsPage.js

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Button, Divider } from '@mui/material';
import axios from 'axios';

function EngineerDetailsPage() {
  const { employerId } = useParams();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  // Dummy data
  const dummyData = {
    employer1: [
      {
        clientName: 'John Doe',
        clientAddress: '123 Elm Street',
        contactPerson: 'Jane Smith',
        mobileNo: '123-456-7890',
        invoiceDate: '2024-09-10',
        invoiceAmount: 150.00,
        machineName: 'Machine A',
        model: 'Model X',
        partNo: 'Part123',
        serialNo: 'SN456789',
        installationDate: '2024-09-01',
        serviceFrequency: 30,
        expectedServiceDate: '2024-10-01',
        serviceEngineer: 'Engineer 1',
        serviceStatus: 'Completed',
        notes: 'The machine was serviced successfully and is running smoothly. The client was satisfied with the service.'
      },
      {
        clientName: 'Alice Johnson',
        clientAddress: '456 Oak Avenue',
        contactPerson: 'Bob Brown',
        mobileNo: '987-654-3210',
        invoiceDate: '2024-09-15',
        invoiceAmount: 200.00,
        machineName: 'Machine B',
        model: 'Model Y',
        partNo: 'Part456',
        serialNo: 'SN987654',
        installationDate: '2024-09-10',
        serviceFrequency: 45,
        expectedServiceDate: '2024-11-01',
        serviceEngineer: 'Engineer 2',
        serviceStatus: 'Pending',
        notes: 'The service is scheduled for the next month. The client requested additional checks for machine performance.'
      },
      {
        clientName: 'Michael Brown',
        clientAddress: '789 Pine Road',
        contactPerson: 'Sara White',
        mobileNo: '456-789-0123',
        invoiceDate: '2024-09-20',
        invoiceAmount: 175.00,
        machineName: 'Machine C',
        model: 'Model Z',
        partNo: 'Part789',
        serialNo: 'SN112233',
        installationDate: '2024-09-05',
        serviceFrequency: 60,
        expectedServiceDate: '2024-12-01',
        serviceEngineer: 'Engineer 3',
        serviceStatus: 'In Progress',
        notes: 'Service is ongoing. The client requested a follow-up in two months.'
      }
    ],
    employer2: [
      {
        clientName: 'Emily Davis',
        clientAddress: '101 Maple Lane',
        contactPerson: 'John White',
        mobileNo: '321-654-9870',
        invoiceDate: '2024-09-22',
        invoiceAmount: 250.00,
        machineName: 'Machine D',
        model: 'Model A',
        partNo: 'Part999',
        serialNo: 'SN123456',
        installationDate: '2024-09-12',
        serviceFrequency: 30,
        expectedServiceDate: '2024-10-12',
        serviceEngineer: 'Engineer 4',
        serviceStatus: 'Completed',
        notes: 'The machine was serviced. All issues were resolved and the client was pleased with the outcome.'
      },
      {
        clientName: 'Sophia Wilson',
        clientAddress: '202 Birch Street',
        contactPerson: 'David Green',
        mobileNo: '654-321-0987',
        invoiceDate: '2024-09-18',
        invoiceAmount: 300.00,
        machineName: 'Machine E',
        model: 'Model B',
        partNo: 'Part888',
        serialNo: 'SN789012',
        installationDate: '2024-09-08',
        serviceFrequency: 45,
        expectedServiceDate: '2024-11-08',
        serviceEngineer: 'Engineer 5',
        serviceStatus: 'Pending',
        notes: 'Pending service. The client has requested an additional inspection before the next service.'
      },
      {
        clientName: 'Daniel Lee',
        clientAddress: '303 Cedar Road',
        contactPerson: 'Linda Harris',
        mobileNo: '789-123-4560',
        invoiceDate: '2024-09-25',
        invoiceAmount: 220.00,
        machineName: 'Machine F',
        model: 'Model C',
        partNo: 'Part777',
        serialNo: 'SN345678',
        installationDate: '2024-09-15',
        serviceFrequency: 60,
        expectedServiceDate: '2024-12-15',
        serviceEngineer: 'Engineer 6',
        serviceStatus: 'In Progress',
        notes: 'Service in progress. Client has reported intermittent issues and has requested a follow-up.'
      }
    ]
 
  };

  useEffect(() => {
    const fetchAppointmentData = async () => {
      try {
        // Using dummy data for now
        const data = dummyData[employerId];
        if (!data) {
          throw new Error('Appointments not found');
        }
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointment data', error);
        setError(error.message);
      }
    };

    fetchAppointmentData();
  }, [employerId]);




  if (error) {
    return <Typography variant="h6" color="error">Error: {error}</Typography>;
  }

  if (appointments.length === 0) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  const handleEditClick = () => {
    navigate(`/checklist`);
  };

  return (
    <Container sx={{ padding: 4 }} maxWidth="xl">
      <Typography variant="h4" gutterBottom>Client Details</Typography>
      <Typography variant="h6" paragraph>
        Here you can find detailed information about the service appointments. This includes service history, 
        machine details, and upcoming service schedules.
      </Typography>
      <Divider sx={{ marginY: 2 }} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme => theme.palette.grey[200] }}>
              <TableCell sx={{ fontSize: '1.1rem' }}>Client Name</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Client Address</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Contact Person</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Mobile No.</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Invoice Date</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Invoice Amount</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Machine Name</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Model</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Part No.</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Serial No.</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Installation Date</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Service Frequency (Days)</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Expected Service Date</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Service Status</TableCell>
              <TableCell sx={{ fontSize: '1.1rem' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment, index) => (
              <TableRow key={index}>
                <TableCell>{appointment.clientName}</TableCell>
                <TableCell>{appointment.clientAddress}</TableCell>
                <TableCell>{appointment.contactPerson}</TableCell>
                <TableCell>{appointment.mobileNo}</TableCell>
                <TableCell>{appointment.invoiceDate}</TableCell>
                <TableCell>${appointment.invoiceAmount.toFixed(2)}</TableCell>
                <TableCell>{appointment.machineName}</TableCell>
                <TableCell>{appointment.model}</TableCell>
                <TableCell>{appointment.partNo}</TableCell>
                <TableCell>{appointment.serialNo}</TableCell>
                <TableCell>{appointment.installationDate}</TableCell>
                <TableCell>{appointment.serviceFrequency}</TableCell>
                <TableCell>{appointment.expectedServiceDate}</TableCell>
                <TableCell>{appointment.serviceStatus}</TableCell>
                <TableCell sx={{ display: 'flex', justifyContent: 'space-around' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ marginRight: 1 }}
                    onClick={handleEditClick}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined" color="secondary">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default EngineerDetailsPage;


// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Container, Button, Divider } from '@mui/material';

// function EngineerDetailsPage() {
//   const { employerId } = useParams();
//   const navigate = useNavigate();
//   const [appointment, setAppointment] = useState(null);
//   const [error, setError] = useState(null);

//   // Dummy data
//   const dummyData = {
//     employer1: {
//       clientName: 'John Doe',
//       clientAddress: '123 Elm Street',
//       contactPerson: 'Jane Smith',
//       mobileNo: '123-456-7890',
//       invoiceDate: '2024-09-10',
//       invoiceAmount: 150.00,
//       machineName: 'Machine A',
//       model: 'Model X',
//       partNo: 'Part123',
//       serialNo: 'SN456789',
//       installationDate: '2024-09-01',
//       serviceFrequency: 30,
//       expectedServiceDate: '2024-10-01',
//       serviceEngineer: 'Engineer 1',
//       serviceStatus: 'Completed',
//       notes: 'The machine was serviced successfully and is running smoothly. The client was satisfied with the service.'
//     },
//     employer1: {
//       clientName: 'Alice Johnson',
//       clientAddress: '456 Oak Avenue',
//       contactPerson: 'Bob Brown',
//       mobileNo: '987-654-3210',
//       invoiceDate: '2024-09-15',
//       invoiceAmount: 200.00,
//       machineName: 'Machine B',
//       model: 'Model Y',
//       partNo: 'Part456',
//       serialNo: 'SN987654',
//       installationDate: '2024-09-10',
//       serviceFrequency: 45,
//       expectedServiceDate: '2024-11-01',
//       serviceEngineer: 'Engineer 2',
//       serviceStatus: 'Pending',
//       notes: 'The service is scheduled for the next month. The client requested additional checks for machine performance.'
//     }
//   };

//   useEffect(() => {
//     const fetchAppointmentData = async () => {
//       try {
//         // Using dummy data for now
//         const data = dummyData[employerId];
//         if (!data) {
//           throw new Error('Appointment not found');
//         }
//         setAppointment(data);
//       } catch (error) {
//         console.error('Failed to fetch appointment data', error);
//         setError(error.message);
//       }
//     };

//     fetchAppointmentData();
//   }, [employerId]);

//   if (error) {
//     return <Typography variant="h6" color="error">Error: {error}</Typography>;
//   }

//   if (!appointment) {
//     return <Typography variant="h6">Loading...</Typography>;
//   }

//   const handleEditClick = () => {
//     navigate(`/checklist/${employerId}`);
//   };

//   return (
//     <Container sx={{ padding: 4 }} maxWidth="xl">
//       <Typography variant="h4" gutterBottom>Client Details</Typography>
//       <Typography variant="h6" paragraph>
//         Here you can find detailed information about the service appointment. This includes service history, 
//         machine details, and upcoming service schedules.
//       </Typography>
//       <Divider sx={{ marginY: 2 }} />
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }}>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: theme => theme.palette.grey[200] }}>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Client Name</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Client Address</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Contact Person</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Mobile No.</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Invoice Date</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Invoice Amount</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Machine Name</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Model</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Part No.</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Serial No.</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Installation Date</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Service Frequency (Days)</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Expected Service Date</TableCell>
//               {/* <TableCell sx={{ fontSize: '1.1rem' }}>Service Engineer</TableCell> */}
//               <TableCell sx={{ fontSize: '1.1rem' }}>Service Status</TableCell>
//               <TableCell sx={{ fontSize: '1.1rem' }}>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             <TableRow>
//               <TableCell>{appointment.clientName}</TableCell>
//               <TableCell>{appointment.clientAddress}</TableCell>
//               <TableCell>{appointment.contactPerson}</TableCell>
//               <TableCell>{appointment.mobileNo}</TableCell>
//               <TableCell>{appointment.invoiceDate}</TableCell>
//               <TableCell>${appointment.invoiceAmount.toFixed(2)}</TableCell>
//               <TableCell>{appointment.machineName}</TableCell>
//               <TableCell>{appointment.model}</TableCell>
//               <TableCell>{appointment.partNo}</TableCell>
//               <TableCell>{appointment.serialNo}</TableCell>
//               <TableCell>{appointment.installationDate}</TableCell>
//               <TableCell>{appointment.serviceFrequency}</TableCell>
//               <TableCell>{appointment.expectedServiceDate}</TableCell>
//               {/* <TableCell>{appointment.serviceEngineer}</TableCell> */}
//               <TableCell>{appointment.serviceStatus}</TableCell>
//               <TableCell sx={{ display: 'flex', justifyContent: 'space-around' }}>
//                 <Button
//                   variant="contained"
//                   color="primary"
//                   sx={{ marginRight: 1 }}
//                   onClick={handleEditClick}
//                 >
//                   Edit
//                 </Button>
//                 <Button variant="outlined" color="secondary">Delete</Button>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// }

// export default EngineerDetailsPage;
