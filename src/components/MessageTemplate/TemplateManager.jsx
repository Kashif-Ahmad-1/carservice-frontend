import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Link
} from "@mui/material";
import Menu from '@mui/icons-material/Menu';
import Sidebar from "./../EngineerPage/Sidebar";

import axios from 'axios';
import './TemplateManager.css'
const Header = ({ onToggleSidebar }) => (
  <AppBar position="fixed" sx={{ backgroundColor: "gray", zIndex: 1201 }}>
    <Toolbar>
      <Button onClick={onToggleSidebar} sx={{ color: 'white' }}>
        <Menu sx={{ fontSize: 30 }} />
      </Button>
      <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
        AEROLUBE ENGINEERS
      </Typography>
    </Toolbar>
  </AppBar>
);


const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: 'grey',
        color: 'white',
        padding: 2,
        position: 'fixed',
        // position: 'relative',
        bottom: 0,
        width: '100%',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} AEROLUBE ENGINEERS All rights reserved.
      </Typography>
      <Typography variant="body2">
        {/* <Link href="#" color="inherit" underline="hover">Privacy Policy</Link> |  */}
        <Link href="#" color="inherit" underline="hover"> Design and Developed By ❤️ @SmartITBox</Link>
      </Typography>
    </Box>
  );
};
const TemplateManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('template1');
  const [messageTemplate, setMessageTemplate] = useState('');
  const [templates, setTemplates] = useState({ template1: '', template2: '' });

  const handleToggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    // Fetch templates from backend
    const fetchTemplates = async () => {
      const response = await axios.get('http://localhost:5000/templates');
      setTemplates(response.data);
      setMessageTemplate(response.data.template1);
    };
    fetchTemplates();
  }, []);

  const handleTemplateChange = (e) => {
    const newTemplate = e.target.value;
    setSelectedTemplate(newTemplate);
    setMessageTemplate(templates[newTemplate]);
  };

  const handleSaveTemplate = async () => {
    const updatedTemplates = {
      template1: selectedTemplate === 'template1' ? messageTemplate : templates.template1,
      template2: selectedTemplate === 'template2' ? messageTemplate : templates.template2,
    };

    await axios.post('http://localhost:5000/templates', updatedTemplates);
    toast.success("Template saved!");
  };

  return (
    <>
      {sidebarOpen && <Sidebar />}
      <Header onToggleSidebar={handleToggleSidebar} />
     
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
            Template 1 (For Service Record PDF)
          </label>
          <label className="radio-label">
            <input
              type="radio"
              value="template2"
              checked={selectedTemplate === 'template2'}
              onChange={handleTemplateChange}
            />
            Template 2 (For Quotation Record PDF)
          </label>
        </div>

        <div className="template-card">
          <textarea
            className="template-textarea"
            value={messageTemplate}
            onChange={(e) => setMessageTemplate(e.target.value)}
            placeholder="Write your message template here..."
            rows={10}
          />

          <button className="save-button" onClick={handleSaveTemplate}>Save Template</button>
        </div>

        <ToastContainer />
        
      </div>
      <Footer  />
      
    </>
  );
};

export default TemplateManager;
