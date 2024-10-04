// src/components/TemplateManager.js
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TemplateManager = () => {
    const initialTemplate = `Hello! 📄
  
    We have generated a new PDF document for you. 
  
    📑 **Document Title**: Document Title Here
    ✍️ **Description**: Brief description of what this PDF contains.
    🔗 **Download Link**: {pdfUrl}
  
    If you have any questions, feel free to reach out!
  
    Thank you! 😊`;

    const [messageTemplate, setMessageTemplate] = useState('');

    useEffect(() => {
        const storedTemplate = localStorage.getItem('messageTemplate');
        setMessageTemplate(storedTemplate || initialTemplate);
    }, []);

    const handleTemplateChange = (e) => {
        setMessageTemplate(e.target.value);
    };

    const handleSaveTemplate = () => {
        localStorage.setItem('messageTemplate', messageTemplate);
        toast.success("Template saved!");
    };

    return (
        <div>
            <h1>Manage Message Template</h1>
            <textarea 
                value={messageTemplate} 
                onChange={handleTemplateChange} 
                placeholder="Write your message template here..." 
                rows={10}
                style={{ width: '100%' }}
            />
            <button onClick={handleSaveTemplate}>Save Template</button>
            <ToastContainer />
        </div>
    );
};

export default TemplateManager;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const TemplateManager = (pdfUrl) => {
//     const [messageTemplate, setMessageTemplate] = useState('');

//     const initialTemplate = `Hello! 📄
  
//     We have generated a new PDF document for you. 
  
//     📑 *Document Title*: Document Title Here
//     ✍️ *Description*: Brief description of what this PDF contains.
//     🔗 *Download Link*: {pdfUrl}  // Use this placeholder for the PDF URL
  
//     If you have any questions, feel free to reach out!
  
//     Thank you! 😊`;

//     useEffect(() => {
//         const fetchTemplate = async () => {
//             try {
//                 const res = await axios.get('http://localhost:5000/api/template');
//                 setMessageTemplate(res.data?.template || initialTemplate);
//             } catch (error) {
//                 setMessageTemplate(initialTemplate);
//             }
//         };
//         fetchTemplate();
//     }, []);

//     const handleTemplateChange = (e) => {
//         setMessageTemplate(e.target.value);
//     };

//     const handleSaveTemplate = async () => {
//         try {
//             await axios.post('http://localhost:5000/api/template', { template: messageTemplate });
//             toast.success("Template saved!");
//         } catch (error) {
//             toast.error("Error saving template!");
//         }
//     };

//     return (
//         <div>
//             <h1>Manage Message Template</h1>
//             <textarea 
//                 value={messageTemplate} 
//                 onChange={handleTemplateChange} 
//                 placeholder="Write your message template here..." 
//                 rows={10}
//                 style={{ width: '100%' }}
//             />
//             <button onClick={handleSaveTemplate}>Save Template</button>
//             <ToastContainer />
//         </div>
//     );
// };

// export default TemplateManager;
