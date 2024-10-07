import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  AppBar,
  Toolbar,

} from "@mui/material";
import Menu from '@mui/icons-material/Menu';
import logo from './../EngineerPage/comp-logo.jpeg';
import './TemplateManager.css'; // Create a new CSS file for the styles
import Sidebar from "./../EngineerPage/Sidebar";
import Footer from "./../Footer";

const Header = ({ onToggleSidebar }) => (
  <AppBar position="fixed" sx={{ backgroundColor: "gray", zIndex: 1201 }}> {/* Ensure zIndex is higher than sidebar */}
    <Toolbar>
    <Button onClick={onToggleSidebar} sx={{ color: 'white' }}>
  <Menu sx={{ fontSize: 30 }} />
</Button>
      <img
        src={logo}
        alt="Company Logo"
        style={{ width: 40, height: 40, marginRight: 10 }}
      />
      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
        AEROLUBE ENGINEERS
      </Typography>
    </Toolbar>
  </AppBar>
);


const TemplateManager = () => {
  
  
  const initialTemplate1 = `Hello! 📄

  We have generated a new PDF document for you. 

  📑 **Document Title**: Document Title Here
  ✍️ **Description**: Brief description of what this PDF contains.
  🔗 **Download Link**: {pdfUrl}

  If you have any questions, feel free to reach out!

  Thank you! 😊`;

  const initialTemplate2 = `Hi! 👋

  Your requested document is ready! 

  📄 **Title**: Your Document Title
  📋 **Details**: This is a brief description of your document.
  🔗 **Access the document**: {pdfUrl}

  Let us know if you need any further assistance!

  Cheers! 😊`;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [template1, setTemplate1] = useState('');
  const [template2, setTemplate2] = useState('');

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };
  // Load templates from localStorage
  useEffect(() => {
    const storedTemplate1 = localStorage.getItem('messageTemplate1');
    const storedTemplate2 = localStorage.getItem('messageTemplate2');

    // Set Template 1 and Template 2 on initial load
    setTemplate1(storedTemplate1 || initialTemplate1);
    setTemplate2(storedTemplate2 || initialTemplate2);

    // If template1 is stored, default to template1
    setMessageTemplate(storedTemplate1 || initialTemplate1);
  }, []);

  // Handle the template change for both Template 1 and Template 2
  const handleTemplateChange = (e) => {
    const newTemplate = e.target.value;
    setSelectedTemplate(newTemplate);
    if (newTemplate === 'template1') {
      setMessageTemplate(template1);
    } else if (newTemplate === 'template2') {
      setMessageTemplate(template2);
    }
  };

  // Handle saving templates to localStorage
  const handleSaveTemplate = () => {
    if (selectedTemplate === 'template1') {
      // Save Template 1's content to localStorage
      localStorage.setItem('messageTemplate1', messageTemplate);
    } else if (selectedTemplate === 'template2') {
      // Save Template 2's content to localStorage
      localStorage.setItem('messageTemplate2', messageTemplate);
    }
    toast.success("Template saved!");
  };

  return (
    <>
    {sidebarOpen && <Sidebar />}
    <Header onToggleSidebar={handleToggleSidebar}  />
    <div className="template-manager">
      <h1 className="header">Manage Message Template</h1>
      
      <div className="template-selection">
        <label className="radio-label">
          <input
            type="radio"
            value="template1"
            checked={selectedTemplate === 'template1'}
            onChange={handleTemplateChange}
          />
          Template 1 (For WhatsApp PDF)
        </label>
        <label className="radio-label">
          <input
            type="radio"
            value="template2"
            checked={selectedTemplate === 'template2'}
            onChange={handleTemplateChange}
          />
          Template 2 (For other PDF generation)
        </label>
      </div>

      <div className="template-card">
        {/* Text area to allow the user to edit the template */}
        <textarea 
          className="template-textarea"
          value={messageTemplate} 
          onChange={(e) => setMessageTemplate(e.target.value)} 
          placeholder="Write your message template here..." 
          rows={10}
        />

        {/* Save Button */}
        <button className="save-button" onClick={handleSaveTemplate}>Save Template</button>
      </div>
      
      <ToastContainer />
    </div>
    <Footer />
    </>
  );
};

export default TemplateManager;
