import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AccountAddPage.css'; 

function AppointmentPage() {
  const navigate = useNavigate();

  const [installationDate, setInstallationDate] = useState('');
  const [serviceFrequency, setServiceFrequency] = useState('');
  const [expectedServiceDate, setExpectedServiceDate] = useState('');
  const [engineers, setEngineers] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API or database
    const fetchEngineers = async () => {
      // Dummy data for now
      const dummyEngineers = [
        { id: 'engineer1', name: 'Engineer 1' },
        { id: 'engineer2', name: 'Engineer 2' },
        { id: 'engineer3', name: 'Engineer 3' },
        { id: 'engineer4', name: 'Engineer 4' }
      ];
      setEngineers(dummyEngineers);
    };

    fetchEngineers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
  
    try {
      const response = await fetch('http://localhost:5000/api/appointments/save-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data) // Convert form data to JSON
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      toast.success('Appointment booked successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
  
      setTimeout(() => {
        navigate('/accountspage');
      }, 3000);
    } catch (error) {
      toast.error('Failed to save appointment data.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleBackClick = () => {
    navigate('/accountspage'); 
  };

  const handleDateChange = (e) => {
    setInstallationDate(e.target.value);
    calculateExpectedServiceDate(e.target.value, serviceFrequency);
  };

  const handleFrequencyChange = (e) => {
    setServiceFrequency(e.target.value);
    calculateExpectedServiceDate(installationDate, e.target.value);
  };

  const calculateExpectedServiceDate = (installationDate, serviceFrequency) => {
    if (installationDate && serviceFrequency) {
      const installDate = new Date(installationDate);
      installDate.setDate(installDate.getDate() + parseInt(serviceFrequency, 10));
      const expectedDate = installDate.toISOString().split('T')[0]; // Format as yyyy-mm-dd
      setExpectedServiceDate(expectedDate);
    }
  };

  // List of all compressor machine names
  const compressorList = [
    "Rotary Screw Compressor",
    "Reciprocating Compressor",
    "Scroll Compressor",
    "Centrifugal Compressor",
    "Axial Compressor",
    "Diaphragm Compressor",
    "Turbo Compressor",
    "Rotary Vane Compressor",
    "Liquid Ring Compressor",
    "Oil-Free Compressor",
    "Magnetic Bearing Compressor",
    "Helical Lobe Compressor"
  ];

  return (
    <div className="appointment-page">
      <div className="appointment-container">
        <h2>Book Your Appointment</h2>
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clientName">Enter Client Name:</label>
              <input type="text" id="clientName" name="clientName" required />
            </div>
            <div className="form-group">
              <label htmlFor="clientAddress">Client Address:</label>
              <input type="text" id="clientAddress" name="clientAddress" required />
            </div>
            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person Name:</label>
              <input type="text" id="contactPerson" name="contactPerson" required />
            </div>
            <div className="form-group">
              <label htmlFor="mobileNo">Mobile No.:</label>
              <input type="tel" id="mobileNo" name="mobileNo" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="invoiceDate">Invoice Date:</label>
              <input type="date" id="invoiceDate" name="invoiceDate" required />
            </div>
            <div className="form-group">
              <label htmlFor="invoiceAmount">Invoice Amount:</label>
              <input type="number" id="invoiceAmount" name="invoiceAmount" required />
            </div>
            <div className="form-group">
              <label htmlFor="machineName">Machine Name:</label>
              <select id="machineName" name="machineName" required>
                <option value="">Select a Machine</option>
                {compressorList.map((machine, index) => (
                  <option key={index} value={machine}>{machine}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="model">Model:</label>
              <input type="text" id="model" name="model" required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="partNo">Part No.:</label>
              <input type="text" id="partNo" name="partNo" required />
            </div>
            <div className="form-group">
              <label htmlFor="serialNo">Serial No.:</label>
              <input type="text" id="serialNo" name="serialNo" required />
            </div>
            <div className="form-group">
              <label htmlFor="installationDate">Installation Date:</label>
              <input 
                type="date" 
                id="installationDate" 
                name="installationDate" 
                required 
                onChange={handleDateChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="serviceFrequency">Service Frequency (Days):</label>
              <input 
                type="number" 
                id="serviceFrequency" 
                name="serviceFrequency" 
                required 
                onChange={handleFrequencyChange} 
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expectedServiceDate">Expected Service Date:</label>
              <input 
                type="date" 
                id="expectedServiceDate" 
                name="expectedServiceDate" 
                value={expectedServiceDate} 
                readOnly 
              />
            </div>
            <div className="form-group">
              <label htmlFor="serviceEngineer">Select Service Engineer Name:</label>
              <select id="serviceEngineer" name="serviceEngineer" required>
                <option value="">Select...</option>
                {engineers.map(engineer => (
                  <option key={engineer.id} value={engineer.id}>
                    {engineer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" className="back-button" onClick={handleBackClick}>
              Back To Home
            </button>
          </div>
        </form>
      </div>
      <ToastContainer /> 
    </div>
  );
}

export default AppointmentPage;





// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { ExpandMore, ExpandLess } from '@mui/icons-material';
// import './AccountAddPage.css';

// function AppointmentPage() {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
    
//     const formData = new FormData(event.target);
//     const data = {};
//     formData.forEach((value, key) => {
//       data[key] = value;
//     });
  
//     try {
//       const response = await fetch('http://localhost:5000/save-appointment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data) // Convert form data to JSON
//       });
  
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
  
//       toast.success('Appointment booked successfully!', {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
  
//       setTimeout(() => {
//         navigate('/appointment-details');
//       }, 3000);
//     } catch (error) {
//       toast.error('Failed to save appointment data.', {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: false,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       });
//     }
//   };

//   const handleBackClick = () => {
//     navigate('/accountspage'); 
//   };

//   const toggleDropdown = () => {
//     setDropdownOpen(!dropdownOpen);
//   };

//   return (
//     <div className="appointment-page">
//       <div className="appointment-container">
//         <h2>Book Your Appointment</h2>
//         <form className="appointment-form" onSubmit={handleSubmit}>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="clientName">
//                 Enter Client Name:
//                 <span onClick={toggleDropdown} className="dropdown-toggle">
//                   {dropdownOpen ? <ExpandLess /> : <ExpandMore />}
//                 </span>
//               </label>
//               <input type="text" id="clientName" name="clientName" required />
//               {dropdownOpen && (
//                 <div className="dropdown-content">
//                   {/* Additional fields for dropdown */}
//                   <div className="dropdown-item">
//                     <label htmlFor="additionalField1">Additional Field 1:</label>
//                     <input type="text" id="additionalField1" name="additionalField1" />
//                   </div>
//                   <div className="dropdown-item">
//                     <label htmlFor="additionalField2">Additional Field 2:</label>
//                     <input type="text" id="additionalField2" name="additionalField2" />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="clientAddress">Client Address:</label>
//               <input type="text" id="clientAddress" name="clientAddress" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="contactPerson">Contact Person Name:</label>
//               <input type="text" id="contactPerson" name="contactPerson" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="mobileNo">Mobile No.:</label>
//               <input type="tel" id="mobileNo" name="mobileNo" required />
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="invoiceDate">Invoice Date:</label>
//               <input type="date" id="invoiceDate" name="invoiceDate" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="invoiceAmount">Invoice Amount:</label>
//               <input type="number" id="invoiceAmount" name="invoiceAmount" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="machineName">Machine Name:</label>
//               <input type="text" id="machineName" name="machineName" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="model">Model:</label>
//               <input type="text" id="model" name="model" required />
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="partNo">Part No.:</label>
//               <input type="text" id="partNo" name="partNo" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="serialNo">Serial No.:</label>
//               <input type="text" id="serialNo" name="serialNo" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="installationDate">Installation Date:</label>
//               <input type="date" id="installationDate" name="installationDate" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="serviceFrequency">Service Frequency (Days):</label>
//               <input type="number" id="serviceFrequency" name="serviceFrequency" required />
//             </div>
//           </div>
//           <div className="form-row">
//             <div className="form-group">
//               <label htmlFor="expectedServiceDate">Expected Service Date:</label>
//               <input type="date" id="expectedServiceDate" name="expectedServiceDate" required />
//             </div>
//             <div className="form-group">
//               <label htmlFor="serviceEngineer">Select Service Engineer Name:</label>
//               <select id="serviceEngineer" name="serviceEngineer" required>
//                 <option value="">Select...</option>
//                 <option value="engineer1">Engineer 1</option>
//                 <option value="engineer2">Engineer 2</option>
//                 <option value="engineer3">Engineer 3</option>
//                 {/* Add more options as needed */}
//               </select>
//             </div>
//           </div>
//           <div className="form-actions">
//             <button type="submit">Submit</button>
//             <button type="button" className="back-button" onClick={handleBackClick}>
//               Back To Home
//             </button>
//           </div>
//         </form>
//       </div>
//       <ToastContainer />
//     </div>
//   );
// }

// export default AppointmentPage;




