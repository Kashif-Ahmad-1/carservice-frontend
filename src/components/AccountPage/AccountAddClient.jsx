
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AccountAddPage.css";

function AppointmentPage() {
  const navigate = useNavigate();

  const [installationDate, setInstallationDate] = useState("");
  const [serviceFrequency, setServiceFrequency] = useState("");
  const [expectedServiceDate, setExpectedServiceDate] = useState("");
  const [engineers, setEngineers] = useState([]);
  const [machines, setMachines] = useState([]);
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentAmount, setAppointmentAmount] = useState(0);
  const [machineName, setMachineName] = useState("");
  const [model, setModel] = useState("");
  const [partNo, setPartNo] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [engineerId, setEngineerId] = useState("");


  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/users/engineers",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setEngineers(data);
        } else {
          console.error("Failed to fetch engineers:", data.message);
        }
      } catch (error) {
        console.error("Error fetching engineers:", error);
      }
    };

    fetchEngineers();
  }, []);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/machines", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setMachines(data);
      } catch (error) {
        console.error("Error fetching machines:", error);
      }
    };

    fetchMachines();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const appointmentData = {
      clientName,
      clientAddress,
      contactPerson,
      mobileNo,
      appointmentDate,
      appointmentAmount,
      machineName,
      model,
      partNo,
      serialNo,
      installationDate,
      serviceFrequency,
      expectedServiceDate,
      engineer: engineerId,
      createdBy: localStorage.getItem("userId"), // Assuming user ID is stored in localStorage
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        "http://localhost:5000/api/appointments/",
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      toast.success("Appointment booked successfully!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setTimeout(() => {
        navigate("/accountspage");
      }, 3000);
    } catch (error) {
      toast.error("Failed to save appointment data.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };



  const handleBackClick = () => {
    navigate("/accountspage");
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
      const expectedDate = installDate.toISOString().split("T")[0];
      setExpectedServiceDate(expectedDate);
    }
  };



  return (
    <div className="appointment-page">
    
      <div className="appointment-container">
        <h2>Book Your Appointment</h2>
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clientName">Enter Client Name:</label>
              <input type="text" id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required />
              
            </div>
            <div className="form-group">
              <label htmlFor="clientAddress">Client Address:</label>
              <input
                type="text"
                id="clientAddress"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactPerson">Contact Person Name:</label>
              <input
                type="text"
                id="contactPerson"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobileNo">Mobile No.:</label>
              <input type="tel" id="mobileNo" value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date:</label>
              <input type="date" id="appointmentDate" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="appointmentAmount">Appointment Amount:</label>
              <input
                type="number"
                id="appointmentAmount"
                value={appointmentAmount}
                onChange={(e) => setAppointmentAmount(Number(e.target.value))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="machineName">Machine Name:</label>
              <select id="machineName" value={machineName} onChange={(e) => setMachineName(e.target.value)} required>
                <option value="">Select a Machine</option>
                {machines.map((machine) => (
                  <option key={machine._id} value={machine.name}>
                    {machine.name} 
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="model">Model:</label>
              <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="partNo">Part No.:</label>
              <input type="text" id="partNo" value={partNo} onChange={(e) => setPartNo(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="serialNo">Serial No.:</label>
              <input type="text" id="serialNo" value={serialNo} onChange={(e) => setSerialNo(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="installationDate">Installation Date:</label>
              <input
                type="date"
                id="installationDate"
                value={installationDate}
                onChange={handleDateChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="serviceFrequency">Service Frequency (Days):</label>
              <input
                type="number"
                id="serviceFrequency"
                value={serviceFrequency}
                onChange={handleFrequencyChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="expectedServiceDate">Expected Service Date:</label>
              <input
                type="date"
                id="expectedServiceDate"
                value={expectedServiceDate}
                readOnly
              />
            </div>
            <div className="form-group">
              <label htmlFor="serviceEngineer">Select Service Engineer Name:</label>
              <select id="serviceEngineer" value={engineerId} onChange={(e) => setEngineerId(e.target.value)} required>
                <option value="">Select...</option>
                {engineers.map((engineer) => (
                  <option key={engineer._id} value={engineer._id}>
                    {engineer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button
              type="button"
              className="back-button"
              onClick={handleBackClick}
            >
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
