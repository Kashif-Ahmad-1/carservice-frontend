import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "./comp-logo.jpeg";
import {
    Typography,
    AppBar,
    Toolbar,
    IconButton,
    Menu,
  } from "@mui/material";
import axios from "axios";
import { toast } from 'react-toastify';
import { API_BASE_URL } from './../../config';
import "../Pdf Generator/PdfGenerator.css";
import Sidebar from "./Sidebar";
import Footer from "../Footer";

const EditQuotation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    clientInfo: { name: "", contactPerson: "", phone: "", address: "" },
    appointmentId: "",
    quotationNo: "",
    quotationAmount: 0,
    items: [],
    gst: 0,
  });

  const [itemData, setItemData] = useState({
    itemName: "",
    quantity: 0,
    rate: 0,
  });


  // Function to toggle the sidebar visibility
  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Function to handle drawer toggle
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

   // Header Component
   const Header = () => (
    <AppBar position="fixed" sx={{ backgroundColor: 'gray', zIndex: 1201 }}>
      <Toolbar>
        <IconButton color="inherit" onClick={handleToggleSidebar}>
          <Menu />
        </IconButton>
        <img
          src={logo}
          alt="Company Logo"
          style={{ width: 40, height: 40, marginRight: 10 }}
        />
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: 'bold' }}
        >
          AEROLUBE ENGINEERS
        </Typography>
      </Toolbar>
    </AppBar>
  );

  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/quotations/edit/${id}`);
        setFormData(response.data.quotation);
      } catch (error) {
        console.error("Error fetching quotation:", error);
        toast.error("Failed to load quotation.");
      }
    };
    fetchQuotation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("clientInfo.")) {
      const field = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        clientInfo: {
          ...prevData.clientInfo,
          [field]: value,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
  
    // Update the specific field
    updatedItems[index][name] = value;
  
    // Parse the values correctly
    const quantity = parseFloat(updatedItems[index].quantity) || 0;
    const rate = parseFloat(updatedItems[index].rate) || 0;
    const gstPercentage = parseFloat(updatedItems[index].gstPercentage) || 0;
  
    // Calculate values
    const total = quantity * rate;
    const gstAmount = (total * gstPercentage) / 100;
    const totalWithGST = total + gstAmount;
  
    // Update calculated values
    updatedItems[index].gstAmount = gstAmount;
    updatedItems[index].totalWithGST = totalWithGST;
  
    // Update the state
    setFormData(prevData => ({
      ...prevData,
      items: updatedItems,
      quotationAmount: calculateTotalAmount(updatedItems),
    }));
  };
  

  
  

  const calculateTotalAmount = (items) => {
    return items.reduce((total, item) => {
      const totalWithGST = Number(item.totalWithGST) || 0;
      return total + totalWithGST;
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/api/quotations/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      toast.success("Quotation updated successfully!");
      navigate("/quotation-list");
    } catch (error) {
      console.error("Error updating quotation:", error);
      toast.error("Failed to update quotation.");
    }
  };

  const addItem = () => {
    const quantity = parseFloat(itemData.quantity) || 0;
    const rate = parseFloat(itemData.rate) || 0;
    const gstPercentage = parseFloat(formData.gst) || 0; // This gets the default GST percentage
  
    const total = quantity * rate;
    const gstAmount = (total * gstPercentage) / 100;
    const totalWithGST = total + gstAmount;
  
    const newItem = {
      ...itemData,
      gstPercentage, // Add GST percentage here
      gstAmount,
      totalWithGST,
    };
  
    setFormData(prevData => {
      const updatedItems = [...prevData.items, newItem];
      return {
        ...prevData,
        items: updatedItems,
        quotationAmount: calculateTotalAmount(updatedItems),
      };
    });
  
    // Reset item data
    setItemData({ itemName: "", quantity: 0, rate: 0 });
  };
  

  return (
    <>
    {sidebarOpen && <Sidebar />}
    <Header />
    <div className="container-pdf">
      <h2>Quotations</h2>
      <form className="form-box" onSubmit={handleSubmit}>
        <h4>Buyer Details</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Buyer Name:</label>
            <input type="text" name="buyerName" value={formData.clientInfo.name} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Quotation No:</label>
            <input type="text" name="quotationNo" value={formData.quotationNo} readOnly />
          </div>
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="address" value={formData.clientInfo.address} onChange={handleChange} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Contact Person:</label>
            <input type="text" name="contactPerson" value={formData.clientInfo.contactPerson} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Mobile No:</label>
            <input type="text" name="mobileNo" value={formData.clientInfo.phone} onChange={handleChange} />
          </div>
        </div>
        <h4>Item Details</h4>
{formData.items.map((item, index) => (
  <div key={index} className="item-entry">
    <div className="form-row">
      <div className="form-group">
        <label>Item Name:</label>
        <input type="text" name="itemName" value={item.itemName} onChange={(e) => handleItemChange(index, e)} />
      </div>
      <div className="form-group">
        <label>Quantity:</label>
        <input type="number" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} />
      </div>
      <div className="form-group">
        <label>Rate:</label>
        <input type="number" name="rate" value={item.rate} onChange={(e) => handleItemChange(index, e)} />
      </div>
      <div className="form-group">
        <label>GST (%):</label>
        <input 
          type="number" 
          name="gstPercentage" 
          value={item.gstPercentage || 0} 
          onChange={(e) => handleItemChange(index, e)} // Allow changes to GST percentage
        />
      </div>
      {/* <div className="form-group">
        <label>GST Amount:</label>
        <input 
          type="number" 
          name="gstAmount" 
          value={item.gstAmount} 
           // Keep GST amount read-only
        />
      </div> */}
      <div className="form-group">
        <label>Total:</label>
        <input type="number" name="totalWithGST" value={item.totalWithGST} readOnly />
      </div>
    </div>
  </div>
))}


        <h4>Add New Item</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Item Name:</label>
            <input type="text" name="itemName" value={itemData.itemName} onChange={(e) => setItemData({ ...itemData, itemName: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input type="number" name="quantity" value={itemData.quantity} onChange={(e) => setItemData({ ...itemData, quantity: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Rate:</label>
            <input type="number" name="rate" value={itemData.rate} onChange={(e) => setItemData({ ...itemData, rate: e.target.value })} />
          </div>
          <div className="form-group">
            <label>GST (%):</label>
            <input type="number" name="gst" value={formData.gst} onChange={(e) => setFormData({ ...formData, gst: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Total:</label>
            <input type="number" value={(itemData.quantity * itemData.rate * (1 + formData.gst / 100)).toFixed(2) || 0} readOnly />
          </div>
          <button type="button" onClick={addItem}>
            Add Item
          </button>
        </div>

        <h4>Additional Details</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Total Quotation Amount:</label>
            <input type="number" name="totalAmount" value={formData.quotationAmount} readOnly />
          </div>
        </div>
        <div className="button-container">
          <button type="submit">Update Quotation</button>
        </div>
      </form>
    </div>
    <Footer />
    </>
  );
};

export default EditQuotation;
