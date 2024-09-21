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
  const [suggestions, setSuggestions] = useState([]);
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const fetchEngineers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users/engineers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
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

  useEffect(() => {
    const draftData = JSON.parse(localStorage.getItem("appointmentDraft"));
    if (draftData) {
      setClientName(draftData.clientName);
      setClientAddress(draftData.clientAddress);
      setContactPerson(draftData.contactPerson);
      setMobileNo(draftData.mobileNo);
      setAppointmentDate(draftData.appointmentDate);
      setAppointmentAmount(draftData.appointmentAmount);
      setMachineName(draftData.machineName);
      setModel(draftData.model);
      setPartNo(draftData.partNo);
      setSerialNo(draftData.serialNo);
      setInstallationDate(draftData.installationDate);
      setServiceFrequency(draftData.serviceFrequency);
      setExpectedServiceDate(draftData.expectedServiceDate);
      setEngineerId(draftData.engineer);
    }
  }, []);

  const handleClientNameChange = async (e) => {
    const value = e.target.value;
    setClientName(value);
  
    if (value.length >= 2) {
      try {
        const response = await fetch(`http://localhost:5000/api/companies/search?name=${encodeURIComponent(value)}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
  
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching company suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const appointmentData = new FormData();
    appointmentData.append("clientName", clientName);
    appointmentData.append("clientAddress", clientAddress);
    appointmentData.append("contactPerson", contactPerson);
    appointmentData.append("mobileNo", mobileNo);
    appointmentData.append("appointmentDate", appointmentDate);
    appointmentData.append("appointmentAmount", appointmentAmount);
    appointmentData.append("machineName", machineName);
    appointmentData.append("model", model);
    appointmentData.append("partNo", partNo);
    appointmentData.append("serialNo", serialNo);
    appointmentData.append("installationDate", installationDate);
    appointmentData.append("serviceFrequency", serviceFrequency);
    appointmentData.append("expectedServiceDate", expectedServiceDate);
    appointmentData.append("engineer", engineerId);
    appointmentData.append("document", document);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/appointments/", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: appointmentData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      localStorage.removeItem("appointmentDraft");

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

  const handleDraftSave = () => {
    const draftData = {
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
    };
    localStorage.setItem("appointmentDraft", JSON.stringify(draftData));
    toast.success("Draft saved successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
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
        <h2>Register Invoice / Assign Engineer</h2>
        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clientName">Enter Client Name:</label>
              <input 
                type="text" 
                id="clientName" 
                value={clientName} 
                onChange={handleClientNameChange} 
                required 
              />
              {suggestions.length > 0 && (
                <ul className="suggestions-list">
                  {suggestions.map((suggestion) => (
                    <li key={suggestion._id} onClick={() => {
                      setClientName(suggestion.clientName);
                      setClientAddress(suggestion.clientAddress);
                      setContactPerson(suggestion.contactPerson);
                      setMobileNo(suggestion.mobileNo);
                      setSuggestions([]);
                    }}>
                      {suggestion.clientName}
                    </li>
                  ))}
                </ul>
              )}
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
              <input 
                type="tel" 
                id="mobileNo" 
                value={mobileNo} 
                onChange={(e) => setMobileNo(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="appointmentDate">Appointment Date:</label>
              <input 
                type="date" 
                id="appointmentDate" 
                value={appointmentDate} 
                onChange={(e) => setAppointmentDate(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="appointmentAmount">Appointment Amount:</label>
              <input 
                type="number" 
                id="appointmentAmount" 
                value={appointmentAmount} 
                onChange={(e) => setAppointmentAmount(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="machineName">Machine Name:</label>
              <input 
                type="text" 
                id="machineName" 
                value={machineName} 
                onChange={(e) => setMachineName(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="model">Model:</label>
              <input 
                type="text" 
                id="model" 
                value={model} 
                onChange={(e) => setModel(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="partNo">Part No.:</label>
              <input 
                type="text" 
                id="partNo" 
                value={partNo} 
                onChange={(e) => setPartNo(e.target.value)} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="serialNo">Serial No.:</label>
              <input 
                type="text" 
                id="serialNo" 
                value={serialNo} 
                onChange={(e) => setSerialNo(e.target.value)} 
                required 
              />
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
              <label htmlFor="engineer">Assign Engineer:</label>
              <select 
                id="engineer" 
                value={engineerId} 
                onChange={(e) => setEngineerId(e.target.value)} 
                required 
              >
                <option value="">Select Engineer</option>
                {engineers.map((engineer) => (
                  <option key={engineer._id} value={engineer._id}>
                    {engineer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="document">Upload Document:</label>
              <input 
                type="file" 
                id="document" 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                onChange={(e) => setDocument(e.target.files[0])} 
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" className="draft-button" onClick={handleDraftSave}>
              Save Draft
            </button>
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
