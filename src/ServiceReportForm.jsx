import React, { useState } from "react";

const ServiceReportForm = () => {
  const [formData, setFormData] = useState({
    visitType: "",
    problemNature: "",
    remarks: "",
    model: "",
    serialNo: "",
    tasks: {
      screwCompressor: false,
      airFilter: false,
      oilFilter: false,
      motorBearing: false,
    },
    customerRemarks: "",
    technicianName: "",
    customerName: "",
    startTime: "",
    endTime: "",
    partsUsed: [{ description: "", partNo: "", quantity: "" }],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTaskChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      tasks: { ...formData.tasks, [name]: checked },
    });
  };

  const handlePartsChange = (index, e) => {
    const { name, value } = e.target;
    const newParts = formData.partsUsed.map((part, i) =>
      i === index ? { ...part, [name]: value } : part
    );
    setFormData({ ...formData, partsUsed: newParts });
  };

  const addPart = () => {
    setFormData({
      ...formData,
      partsUsed: [...formData.partsUsed, { description: "", partNo: "", quantity: "" }],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission (e.g., save to a database or generate a PDF)
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Service Report</h2>
      
      {/* Nature of Visit */}
      <label>Nature of Visit:</label>
      <select name="visitType" value={formData.visitType} onChange={handleInputChange}>
        <option value="">Select</option>
        <option value="AMC">AMC</option>
        <option value="Warranty">Warranty</option>
        <option value="Goodwill">Goodwill</option>
        <option value="Chargeable">Chargeable</option>
      </select>

      {/* Nature of Problem */}
      <label>Nature of Problem:</label>
      <textarea name="problemNature" value={formData.problemNature} onChange={handleInputChange} />

      {/* Equipment Details */}
      <label>Model:</label>
      <input type="text" name="model" value={formData.model} onChange={handleInputChange} />

      <label>Serial No:</label>
      <input type="text" name="serialNo" value={formData.serialNo} onChange={handleInputChange} />

      {/* Tasks Checklist */}
      <h3>Checklist</h3>
      <label>
        <input
          type="checkbox"
          name="screwCompressor"
          checked={formData.tasks.screwCompressor}
          onChange={handleTaskChange}
        />
        Screw Compressor
      </label>
      <label>
        <input
          type="checkbox"
          name="airFilter"
          checked={formData.tasks.airFilter}
          onChange={handleTaskChange}
        />
        Air Filter
      </label>
      <label>
        <input
          type="checkbox"
          name="oilFilter"
          checked={formData.tasks.oilFilter}
          onChange={handleTaskChange}
        />
        Oil Filter
      </label>
      <label>
        <input
          type="checkbox"
          name="motorBearing"
          checked={formData.tasks.motorBearing}
          onChange={handleTaskChange}
        />
        Motor Bearing Lubrication
      </label>

      {/* Customer Remarks */}
      <label>Customer Remarks:</label>
      <textarea name="customerRemarks" value={formData.customerRemarks} onChange={handleInputChange} />

      {/* Technician & Customer Details */}
      <label>Technician Name:</label>
      <input type="text" name="technicianName" value={formData.technicianName} onChange={handleInputChange} />

      <label>Customer Name:</label>
      <input type="text" name="customerName" value={formData.customerName} onChange={handleInputChange} />

      <label>Start Time:</label>
      <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} />

      <label>End Time:</label>
      <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} />

      {/* Parts Used */}
      <h3>Parts Used</h3>
      {formData.partsUsed.map((part, index) => (
        <div key={index}>
          <label>Part Description:</label>
          <input
            type="text"
            name="description"
            value={part.description}
            onChange={(e) => handlePartsChange(index, e)}
          />
          <label>Part No:</label>
          <input
            type="text"
            name="partNo"
            value={part.partNo}
            onChange={(e) => handlePartsChange(index, e)}
          />
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={part.quantity}
            onChange={(e) => handlePartsChange(index, e)}
          />
        </div>
      ))}
      <button type="button" onClick={addPart}>Add Part</button>

      <button type="submit">Submit Report</button>
    </form>
  );
};

export default ServiceReportForm;
