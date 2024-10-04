const MessageTemplate = (pdfUrl, template) => {
  return template.replace('{pdfUrl}', pdfUrl);
};

export default MessageTemplate;
// const MessageTemplate = (pdfUrl) => {
//     return `
//       Hello! 📄
  
//       We have generated a new PDF document for you. 
  
//       📑 **Document Title**: Document Title Here
//       ✍️ **Description**: Brief description of what this PDF contains.
//       🔗 **Download Link**: ${pdfUrl}
  
//       If you have any questions, feel free to reach out!
  
//       Thank you! 😊
//     `;
//   };
  
//   export default MessageTemplate;
  


