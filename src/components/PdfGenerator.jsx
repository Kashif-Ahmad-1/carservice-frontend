import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './PdfGenerator.css';
import html2canvas from 'html2canvas';

const PdfGenerator = () => {
  const formRef = useRef(); // Create a ref for the form
  const [formData, setFormData] = useState({
    buyerName: '',
    quotationNo: '',
    docDate: '',
    address: '',
    contactPerson: '',
    mobileNo: '',
    email: '',
    items: [],
    amountInWords: '',
    gst: 18, // Default GST
    totalAmount: 0,
    totalWithGST: 0,
    advance: '',
    validity: '',
    authorisedSignatory: ''
  });

  const [itemData, setItemData] = useState({
    itemName: '',
    quantity: '',
    rate: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Update the total for the current item whenever quantity or rate changes
    if (name === 'quantity' || name === 'rate') {
      const quantity = parseFloat(value) || 0;
      const rate = parseFloat(itemData.rate) || 0;
      const total = quantity * rate;
      setItemData((prev) => ({
        ...prev,
        total: total.toFixed(2)
      }));
    }
  };

  const addItem = () => {
    if (itemData.itemName && itemData.quantity && itemData.rate) {
      const total = parseFloat(itemData.quantity) * parseFloat(itemData.rate);
      const newItem = { ...itemData, total };
      setFormData((prevData) => ({
        ...prevData,
        items: [...prevData.items, newItem]
      }));
      setItemData({
        itemName: '',
        quantity: '',
        rate: '',
      });
      updateTotalAmount(); // Update total amount after adding an item
    }
  };

  const updateTotalAmount = () => {
    const totalAmount = formData.items.reduce((acc, item) => acc + (item.total || 0), 0);
    setFormData((prevData) => ({
      ...prevData,
      totalAmount: totalAmount,
    }));
  };

  useEffect(() => {
    const totalAmount = formData.items.reduce((acc, item) => acc + (item.total || 0), 0);
    const gstAmount = (totalAmount * formData.gst) / 100;
    const totalWithGST = totalAmount + gstAmount;

    setFormData((prevData) => ({
      ...prevData,
      totalAmount: totalAmount,
      totalWithGST: totalWithGST,
      amountInWords: convertNumberToWords(totalWithGST)
    }));
  }, [formData.items]);

  const convertNumberToWords = (num) => {
    const a = [
      '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
      'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
      'eighteen', 'nineteen'
    ];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const g = ['hundred', 'thousand'];

    if (num === 0) return 'zero';
    if (num < 20) return a[num];
    if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + a[num % 10] : '');
    if (num < 1000) return a[Math.floor(num / 100)] + ' ' + g[0] + (num % 100 !== 0 ? ' and ' + convertNumberToWords(num % 100) : '');
    if (num < 10000) return a[Math.floor(num / 1000)] + ' ' + g[1] + (num % 1000 !== 0 ? ' ' + convertNumberToWords(num % 1000) : '');

    return num.toString(); // Fallback for larger numbers
  };

  const generatePDF = () => {
    html2canvas(formRef.current, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait', 
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgAspectRatio = imgWidth / imgHeight;
      const pdfAspectRatio = pdfWidth / pdfHeight;

      let width, height;

      if (imgAspectRatio > pdfAspectRatio) {
        width = pdfWidth;
        height = pdfWidth / imgAspectRatio;
      } else {
        width = pdfHeight * imgAspectRatio;
        height = pdfHeight;
      }

      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save('quotation.pdf');
    });
  };

  return (
    <div className="container" ref={formRef}>
      <h2>Fill the details for PDF generation</h2>
      <form className="form-box">
        <h4>Buyer Details</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Buyer Name:</label>
            <input type="text" name="buyerName" value={formData.buyerName} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Quotation No:</label>
            <input type="text" name="quotationNo" value={formData.quotationNo} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Doc Date:</label>
            <input type="text" name="docDate" value={formData.docDate} onChange={handleInputChange} />
          </div>
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Contact Person:</label>
            <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Mobile No:</label>
            <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
          </div>
        </div>

        <h4>Item Details</h4>
        {formData.items.map((item, index) => (
          <div key={index} className="item-entry">
            <div className="form-row">
              <div className="form-group">
                <label>Item Name:</label>
                <input type="text" value={item.itemName} readOnly />
              </div>
              <div className="form-group">
                <label>Quantity:</label>
                <input type="number" value={item.quantity} readOnly />
              </div>
              <div className="form-group">
                <label>Rate:</label>
                <input type="number" value={item.rate} readOnly />
              </div>
              <div className="form-group">
                <label>Total:</label>
                <input type="number" value={item.total.toFixed(2)} readOnly />
              </div>
            </div>
          </div>
        ))}

        <h4>Add New Item</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Item Name:</label>
            <input type="text" name="itemName" value={itemData.itemName} onChange={handleItemChange} />
          </div>
          <div className="form-group">
            <label>Quantity:</label>
            <input type="number" name="quantity" value={itemData.quantity} onChange={handleItemChange} />
          </div>
          <div className="form-group">
            <label>Rate:</label>
            <input type="number" name="rate" value={itemData.rate} onChange={handleItemChange} />
          </div>
          <div className="form-group">
            <label>Total:</label>
            <input type="number" value={itemData.total || 0} readOnly />
          </div>
          <button type="button" onClick={addItem}>Add Item</button>
          <button type="button" onClick={updateTotalAmount}>OK</button>
        </div>

        <h4>Additional Details</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Whole Total Amount Item:</label>
            <input type="number" value={formData.totalAmount.toFixed(2)} readOnly />
          </div>
          <div className="form-group">
            <label>Advance Payment Details:</label>
            <input type="text" name="advance" value={formData.advance} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Validity:</label>
            <input type="text" name="validity" value={formData.validity} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Authorised Signatory:</label>
            <input type="text" name="authorisedSignatory" value={formData.authorisedSignatory} onChange={handleInputChange} />
          </div>
        </div>
        <button type="button" onClick={generatePDF}>Generate PDF</button>
      </form>
    </div>
  );
};

export default PdfGenerator;











// import React, { useState, useEffect } from 'react';
// import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import './PdfGenerator.css';

// const PdfGenerator = () => {
//   const [formData, setFormData] = useState({
//     buyerName: '',
//     quotationNo: '',
//     docDate: '',
//     address: '',
//     contactPerson: '',
//     mobileNo: '',
//     email: '',
//     items: [],
//     amountInWords: '',
//     gst: 18, // Default GST
//     totalAmount: 0,
//     totalWithGST: 0,
//     advance: '',
//     validity: '',
//     authorisedSignatory: ''
//   });

//   const [itemData, setItemData] = useState({
//     itemName: '',
//     deliveryDate: '',
//     unit: '',
//     quantity: '',
//     rate: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleItemChange = (e) => {
//     const { name, value } = e.target;
//     setItemData({
//       ...itemData,
//       [name]: value
//     });
//   };

//   const addItem = () => {
//     if (itemData.itemName && itemData.quantity && itemData.rate) {
//       const total = parseFloat(itemData.quantity) * parseFloat(itemData.rate);
//       const newItem = { ...itemData, total };
//       setFormData((prevData) => ({
//         ...prevData,
//         items: [...prevData.items, newItem]
//       }));
//       setItemData({
//         itemName: '',
//         deliveryDate: '',
//         unit: '',
//         quantity: '',
//         rate: ''
//       });
//     }
//   };

//   useEffect(() => {
//     const totalAmount = formData.items.reduce((acc, item) => acc + (item.total || 0), 0);
//     const gstAmount = (totalAmount * formData.gst) / 100;
//     const totalWithGST = totalAmount + gstAmount;

//     setFormData((prevData) => ({
//       ...prevData,
//       totalAmount: totalAmount,
//       totalWithGST: totalWithGST,
//       amountInWords: convertNumberToWords(totalWithGST)
//     }));
//   }, [formData.items]);

//   const convertNumberToWords = (num) => {
//     const a = [
//       '', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
//       'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen',
//       'eighteen', 'nineteen'
//     ];
//     const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
//     const g = ['hundred', 'thousand'];

//     if (num === 0) return 'zero';
//     if (num < 20) return a[num];
//     if (num < 100) return b[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + a[num % 10] : '');
//     if (num < 1000) return a[Math.floor(num / 100)] + ' ' + g[0] + (num % 100 !== 0 ? ' and ' + convertNumberToWords(num % 100) : '');
//     if (num < 10000) return a[Math.floor(num / 1000)] + ' ' + g[1] + (num % 1000 !== 0 ? ' ' + convertNumberToWords(num % 1000) : '');

//     return num.toString(); // Fallback for larger numbers
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();

//     // Company Information Box
//     doc.setDrawColor(200);
//     doc.setFillColor(240, 240, 240);
//     doc.rect(10, 10, 190, 40, 'F'); // Company box
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.text('Company Information', 10, 18);
//     doc.setFont("helvetica", "normal");
//     doc.text('Works: B-2 Sara Industrial Estate, Shankarpur, Hukumatpur, Dehradun-248197', 10, 26);
//     doc.text('Office: C-111/112 New Multan Nagar, New Delhi-110056', 10, 32);
//     doc.text('GST NO . 05AAACA1814D1ZI', 10, 38);

//     // Quotation Title
//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.text('QUOTATION', 105, 50, null, null, 'center');

//     // Buyer's Details Box
//     doc.setDrawColor(200);
//     doc.setFillColor(240, 240, 240);
//     doc.rect(10, 55, 190, 60, 'F'); // Draw filled rectangle for buyer's details
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.text(`BUYER'S DETAILS`, 10, 62);

//     // Two Column Layout for Buyer's Details
//     const buyerDetails = [
//         [`Quotation No: ${formData.quotationNo}`, `Doc Date: ${formData.docDate}`],
//         [`Customer: ${formData.buyerName}`, `Address: ${formData.address}`],
//         [`Contact: ${formData.contactPerson}`, `Mobile: ${formData.mobileNo}`],
//         [`Email: ${formData.email}`, '']
//     ];

//     // Position for buyer details
//     const buyerStartY = 68;
//     buyerDetails.forEach((line, index) => {
//         doc.text(line[0], 10, buyerStartY + index * 6);
//         if (line[1]) {
//             doc.text(line[1], 110, buyerStartY + index * 6); // Right column
//         }
//     });

//     // Item Details Table Header
//     const itemColumns = ['Sr. No', 'Item Name', 'Ex-Delivery Date', 'Unit', 'Quantity', 'Rate', 'Amount'];

//     // Create a fixed number of empty rows
//     const itemRows = Array.from({ length: 10 }, (_, index) => [
//         index + 1,
//         '',  // Item Name
//         '',  // Ex-Delivery Date
//         '',  // Unit
//         '',  // Quantity
//         '',  // Rate
//         ''   // Amount
//     ]);

//     // Add existing item rows
//     formData.items.forEach((item, index) => {
//         if (index < 10) {
//             itemRows[index][1] = item.itemName;
//             itemRows[index][2] = item.deliveryDate;
//             itemRows[index][3] = item.unit;
//             itemRows[index][4] = item.quantity;
//             itemRows[index][5] = item.rate;
//             itemRows[index][6] = item.total.toFixed(2);
//         }
//     });

//     doc.autoTable(itemColumns, itemRows, { startY: 120 });

//     // Amount Summary Box
//     const amountSummaryY = doc.lastAutoTable.finalY + 10;
//     doc.setDrawColor(200);
//     doc.setFillColor(240, 240, 240);
//     doc.rect(10, amountSummaryY, 190, 50, 'F'); // Draw filled rectangle for amount summary
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.text(`AMOUNT PAYABLE`, 10, amountSummaryY + 8);

//     doc.setFont("helvetica", "normal");
//     doc.text(`Total Amount: ${formData.totalAmount.toFixed(2)}`, 10, amountSummaryY + 16);
//     doc.text(`GST (18%): ${(formData.totalAmount * 0.18).toFixed(2)}`, 10, amountSummaryY + 22);
//     doc.text(`Total (Incl. GST): ${(formData.totalAmount * 1.18).toFixed(2)}`, 10, amountSummaryY + 28);
//     doc.text(`Amount In Words: ${formData.amountInWords}`, 10, amountSummaryY + 34);

//     // Authorised Signatory Box
//     const signatoryY = amountSummaryY + 60;
//     doc.setDrawColor(200);
//     doc.setFillColor(240, 240, 240);
//     doc.rect(10, signatoryY, 190, 30, 'F'); // Draw filled rectangle for signatory
//     doc.setFontSize(12);
//     doc.setFont("helvetica", "bold");
//     doc.text('Authorised Signatory:', 10, signatoryY + 10);
//     doc.setFont("helvetica", "normal");
//     doc.text(formData.authorisedSignatory, 10, signatoryY + 16);

//     doc.save('quotation.pdf');
// };



//   return (
//     <div className="container">
//       <h2>Fill the details for PDF generation</h2>
//       <form className="form-box">
//         <h4>Buyer Details</h4>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Buyer Name:</label>
//             <input type="text" name="buyerName" value={formData.buyerName} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Quotation No:</label>
//             <input type="text" name="quotationNo" value={formData.quotationNo} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Doc Date:</label>
//             <input type="text" name="docDate" value={formData.docDate} onChange={handleInputChange} />
//           </div>
//         </div>
//         <div className="form-group">
//           <label>Address:</label>
//           <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
//         </div>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Contact Person:</label>
//             <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Mobile No:</label>
//             <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Email:</label>
//             <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
//           </div>
//         </div>

//         <h4>Item Details</h4>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Item Name:</label>
//             <input type="text" name="itemName" value={itemData.itemName} onChange={handleItemChange} />
//           </div>
//           <div className="form-group">
//             <label>Delivery Date:</label>
//             <input type="text" name="deliveryDate" value={itemData.deliveryDate} onChange={handleItemChange} />
//           </div>
//           {/* <div className="form-group">
//             <label>Unit:</label>
//             <input type="text" name="unit" value={itemData.unit} onChange={handleItemChange} />
//           </div> */}
//           <div className="form-group">
//             <label>Quantity:</label>
//             <input type="number" name="quantity" value={itemData.quantity} onChange={handleItemChange} />
//           </div>
//           <div className="form-group">
//             <label>Rate:</label>
//             <input type="number" name="rate" value={itemData.rate} onChange={handleItemChange} />
//           </div>
//           <button type="button" onClick={addItem}>Add Item</button>
//         </div>

//         <h4>Item Summary</h4>
//         <div className="item-summary">
//           {formData.items.length > 0 ? (
//             <table>
//               <thead>
//                 <tr>
//                   <th>Item Name</th>
//                   <th>Delivery Date</th>
//                   <th>Unit</th>
//                   <th>Quantity</th>
//                   <th>Rate</th>
//                   <th>Amount</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {formData.items.map((item, index) => (
//                   <tr key={index}>
//                     <td>{item.itemName}</td>
//                     <td>{item.deliveryDate}</td>
//                     <td>{item.unit}</td>
//                     <td>{item.quantity}</td>
//                     <td>{item.rate}</td>
//                     <td>{item.total.toFixed(2)}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <p>No items added yet.</p>
//           )}
//         </div>

//         <h4>Total Amount Details</h4>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Total Amount:</label>
//             <input type="text" value={formData.totalAmount.toFixed(2)} readOnly />
//           </div>
//           <div className="form-group">
//             <label>Total Amount (Including GST):</label>
//             <input type="text" value={formData.totalWithGST.toFixed(2)} readOnly />
//           </div>
//         </div>

//         <h4>Additional Details</h4>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Advance Payment Details:</label>
//             <input type="text" name="advance" value={formData.advance} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Validity:</label>
//             <input type="text" name="validity" value={formData.validity} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Authorised Signatory:</label>
//             <input type="text" name="authorisedSignatory" value={formData.authorisedSignatory} onChange={handleInputChange} />
//           </div>
//         </div>
//         <button type="button" onClick={generatePDF}>Generate PDF</button>
//         <button type="button" onClick={generatePDF}>Generate this page PDF</button>
//       </form>
//     </div>
//   );
// };

// export default PdfGenerator;









// import React, { useState, useEffect } from 'react';
// import { jsPDF } from 'jspdf';
// import './PdfGenerator.css';

// const PdfGenerator = () => {
//   const [formData, setFormData] = useState({
//     buyerName: '',
//     quotationNo: '',
//     docDate: '',
//     address: '',
//     contactPerson: '',
//     mobileNo: '',
//     email: '',
//     items: [],
//     amountInWords: '',
//     gst: 18, // Default GST
//     totalAmount: '',
//     totalWithGST: '',
//     advance: '',
//     validity: '',
//     authorisedSignatory: ''
//   });

//   const [itemData, setItemData] = useState({
//     itemName: '',
//     deliveryDate: '',
//     unit: '',
//     quantity: '',
//     rate: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleItemChange = (e) => {
//     const { name, value } = e.target;
//     setItemData({
//       ...itemData,
//       [name]: value
//     });
//   };

//   const addItem = () => {
//     if (itemData.itemName && itemData.quantity && itemData.rate) {
//       const total = parseFloat(itemData.quantity) * parseFloat(itemData.rate);
//       const newItem = { ...itemData, total };
//       setFormData((prevData) => ({
//         ...prevData,
//         items: [...prevData.items, newItem]
//       }));
//       setItemData({
//         itemName: '',
//         deliveryDate: '',
//         unit: '',
//         quantity: '',
//         rate: ''
//       });
//     }
//   };

//   // Calculate total amount and amount in words whenever items change
//   useEffect(() => {
//     const totalAmount = formData.items.reduce((acc, item) => acc + item.total, 0);
//     const gstAmount = (totalAmount * formData.gst) / 100;
//     const totalWithGST = totalAmount + gstAmount;

//     setFormData((prevData) => ({
//       ...prevData,
//       totalAmount,
//       totalWithGST,
//       amountInWords: convertNumberToWords(totalWithGST)
//     }));
//   }, [formData.items]);

//   const convertNumberToWords = (num) => {
//     const units = [
//       '', 'One', 'Two', 'Three', 'Four', 'Five',
//       'Six', 'Seven', 'Eight', 'Nine', 'Ten',
//       'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen',
//       'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
//     ];
//     const tens = [
//       '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty',
//       'Sixty', 'Seventy', 'Eighty', 'Ninety'
//     ];
//     const thousands = ['', 'Thousand'];

//     if (num === 0) return 'Zero';
    
//     let words = '';
//     let i = 0;

//     while (num > 0) {
//       let rem = num % 100;
//       if (rem) {
//         words = (rem < 20) ? units[rem] : tens[Math.floor(rem / 10)] + (rem % 10 ? ' ' + units[rem % 10] : '');
//         words += ' ' + thousands[i] + ' ' + words;
//       }
//       num = Math.floor(num / 100);
//       i++;
//     }
//     return words.trim();
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(12);
//     doc.text('Works:  B-2 Sara Industrial Estate,  Shankarpur, Hukumatpur, Dehradun-248197', 10, 10);
//     doc.text('Office: C-111/112 New Multan Nagar, New Delhi-110056', 10, 16);
//     doc.text('GST NO . 05AAACA1814D1ZI', 10, 22);

//     doc.setFontSize(16);
//     doc.setFont("helvetica", "bold");
//     doc.text('QUOTATION', 105, 30, null, null, 'center');

//     doc.setFontSize(12);
//     doc.setFont("helvetica", "normal");
//     doc.text(`BUYER'S DETAILS`, 10, 40);
//     doc.text(`Quotation No.#: ${formData.quotationNo}`, 10, 46);
//     doc.text(`Doc Date: ${formData.docDate}`, 10, 52);
//     doc.text(`Customer: ${formData.buyerName}`, 10, 58);
//     doc.text(`Address: ${formData.address}`, 10, 64);
//     doc.text(`Contact Person: ${formData.contactPerson}`, 10, 70);
//     doc.text(`Mobile No.: ${formData.mobileNo}`, 10, 76);
//     doc.text(`Email: ${formData.email}`, 10, 82);

//     // Item Details Table Header
//     doc.text('Sr. No  |  Item Name  |  Ex-Delivery date  |  Unit  |  Qty  |  Rate  |  Amount', 10, 92);
//     doc.line(10, 94, 200, 94); // Table line

//     // Item Rows
//     formData.items.forEach((item, index) => {
//       const yPosition = 102 + index * 8;
//       doc.text(`${index + 1}  |  ${item.itemName}  |  ${item.deliveryDate}  |  ${item.unit}  |  ${item.quantity}  |  ${item.rate}  |  ${item.total}`, 10, yPosition);
//     });

//     // Total Amount and other details
//     const startY = 112 + formData.items.length * 8;
//     doc.text(`Total Amount: ${formData.totalAmount}`, 10, startY);
//     doc.text(`GST (18%): ${(formData.totalAmount * 0.18).toFixed(2)}`, 10, startY + 6);
//     doc.text(`Total Amount (Including GST): ${formData.totalWithGST}`, 10, startY + 12);
//     doc.text(`Amount In Words: ${formData.amountInWords}`, 10, startY + 18);

//     // Terms and Conditions
//     const termsY = startY + 28;
//     doc.setFontSize(14);
//     doc.text('TERMS AND CONDITIONS', 10, termsY);
//     doc.setFontSize(12);
//     doc.text(`Price: F.O.R. Destination`, 10, termsY + 8);
//     doc.text(`Delivery: ${formData.validity}`, 10, termsY + 14);
//     doc.text(`Taxes: GST extra on above price`, 10, termsY + 20);
//     doc.text(`Payment: ${formData.advance}`, 10, termsY + 26);
//     doc.text(`Validity: ${formData.validity}`, 10, termsY + 32);

//     // Footer
//     doc.text('Authorised Signatory:', 10, termsY + 40);
//     doc.text(formData.authorisedSignatory, 10, termsY + 46);

//     doc.save('quotation.pdf');
//   };

//   return (
//     <div className="container">
//       <h2>Fill the details for PDF generation</h2>
//       <form className="form-box">
//         <div className="form-row">
//           <div className="form-group">
//             <label>Buyer Name:</label>
//             <input type="text" name="buyerName" value={formData.buyerName} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Quotation No:</label>
//             <input type="text" name="quotationNo" value={formData.quotationNo} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Doc Date:</label>
//             <input type="text" name="docDate" value={formData.docDate} onChange={handleInputChange} />
//           </div>
//         </div>

//         <div className="form-row">
//           <div className="form-group">
//             <label>Address:</label>
//             <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Contact Person:</label>
//             <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Mobile No:</label>
//             <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Email:</label>
//             <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
//           </div>
//         </div>

//         <h3>Item Details</h3>
//         <div className="form-row">
//           <div className="form-group">
//             <label>Item Name:</label>
//             <input type="text" name="itemName" value={itemData.itemName} onChange={handleItemChange} />
//           </div>
//           <div className="form-group">
//             <label>Delivery Date:</label>
//             <input type="text" name="deliveryDate" value={itemData.deliveryDate} onChange={handleItemChange} />
//           </div>
//           <div className="form-group">
//             <label>Unit:</label>
//             <input type="text" name="unit" value={itemData.unit} onChange={handleItemChange} />
//           </div>
//           <div className="form-group">
//             <label>Quantity:</label>
//             <input type="number" name="quantity" value={itemData.quantity} onChange={handleItemChange} />
//           </div>
//           <div className="form-group">
//             <label>Rate:</label>
//             <input type="number" name="rate" value={itemData.rate} onChange={handleItemChange} />
//           </div>
//           <button type="button" onClick={addItem}>Add Item</button>
//         </div>

//         <h4>Added Items</h4>
//         {formData.items.map((item, index) => (
//           <div key={index} className="item-summary">
//             {`${index + 1}. ${item.itemName} | Qty: ${item.quantity} | Rate: ${item.rate} | Amount: ${item.total}`}
//           </div>
//         ))}

//         <div className="form-row">
//           <div className="form-group">
//             <label>Total Amount:</label>
//             <input type="text" value={formData.totalAmount} readOnly />
//           </div>
//           <div className="form-group">
//             <label>Total Amount (Including GST):</label>
//             <input type="text" value={formData.totalWithGST} readOnly />
//           </div>
//           <div className="form-group">
//             <label>Advance Payment Details:</label>
//             <input type="text" name="advance" value={formData.advance} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Validity:</label>
//             <input type="text" name="validity" value={formData.validity} onChange={handleInputChange} />
//           </div>
//           <div className="form-group">
//             <label>Authorised Signatory:</label>
//             <input type="text" name="authorisedSignatory" value={formData.authorisedSignatory} onChange={handleInputChange} />
//           </div>
//         </div>
        
//         <button type="button" onClick={generatePDF}>Generate PDF</button>
//       </form>
//     </div>
//   );
// };

// export default PdfGenerator;
