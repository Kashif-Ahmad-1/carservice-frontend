import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './PdfGenerator.css';


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
    }
  };

  const calculateTotalAmount = () => {
    const totalAmount = formData.items.reduce((acc, item) => acc + (item.total || 0), 0);
    return totalAmount;
  };

  useEffect(() => {
    const totalAmount = calculateTotalAmount();
    const gstAmount = (totalAmount * formData.gst) / 100;
    const totalWithGST = totalAmount + gstAmount;

    setFormData((prevData) => ({
      ...prevData,
      totalAmount: totalAmount,
      totalWithGST: totalWithGST,
     
    }));
  }, [formData.items, itemData]); // Dependency on items and itemData


  // https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_640.png

  const generatePDF = () => {
    const doc = new jsPDF();

    // Add Company Logo
    const logoImg = new Image();
    logoImg.src = 'https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_640.png'; // Replace with actual logo path
    logoImg.onload = () => {
        doc.addImage(logoImg, 'PNG', 10, 10, 40, 15); // Adjust logo size and position

        // Company Information Box
        doc.setDrawColor(200);
        doc.setFillColor(245, 245, 245);
        doc.rect(60, 10, 100, 25, 'F'); // Company box
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text('Company Information', 65, 16);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.text('Works: B-2 Sara Industrial Estate, Dehradun-248197', 65, 22);
        doc.text('Office: C-111/112 New Multan Nagar, New Delhi-110056', 65, 26);
        doc.text('GST NO: 05AAACA1814D1ZI', 65, 30);
        
        // Invoice Title
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(50, 50, 100);
        doc.text('INVOICE', 105, 55, null, null, 'center');

        // Invoice Details Box
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.rect(10, 60, 190, 40, 'F'); // Invoice details box
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text(`BILL TO:`, 15, 67);
        
        // Two Column Layout for Buyer's Details
        const buyerDetails = [
            [`Invoice No: ${formData.quotationNo}`, `Invoice Date: ${formData.docDate}`],
            [`Customer: ${formData.buyerName}`, `Address: ${formData.address}`],
            [`Contact: ${formData.contactPerson}`, `Mobile: ${formData.mobileNo}`],
            [`Email: ${formData.email}`, '']
        ];

        // Position for buyer details
        const buyerStartY = 73;
        buyerDetails.forEach((line, index) => {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(60, 60, 60);
            doc.text(line[0], 15, buyerStartY + index * 6);
            if (line[1]) {
                doc.text(line[1], 110, buyerStartY + index * 6); // Right column
            }
        });

        // Item Details Table Header
        const itemColumns = ['Sr. No', 'Item Name', 'Delivery Date', 'Unit', 'Qty', 'Rate', 'Amount'];

        // Create item rows
        const itemRows = formData.items.map((item, index) => [
            index + 1,
            item.itemName,
            item.deliveryDate,
            item.unit,
            item.quantity,
            !isNaN(item.rate) ? Number(item.rate).toFixed(2) : '0.00',
            !isNaN(item.total) ? Number(item.total).toFixed(2) : '0.00'
        ]);

        // Add empty rows if necessary
        for (let i = itemRows.length; i < 10; i++) {
            itemRows.push([i + 1, '', '', '', '', '', '']);
        }

        doc.autoTable(itemColumns, itemRows, {
            startY: 110,
            theme: 'striped',
            headStyles: { fillColor: [150, 150, 255], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
            styles: { cellPadding: 2, fontSize: 9, halign: 'center', fillColor: [240, 240, 240] }
        });

        // Amount Summary Box
        const amountSummaryY = doc.lastAutoTable.finalY + 10;
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.rect(10, amountSummaryY, 190, 50, 'F'); // Draw filled rectangle for amount summary
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text(`AMOUNT PAYABLE`, 15, amountSummaryY + 10);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(`Total Amount: ${formData.totalAmount.toFixed(2)}`, 15, amountSummaryY + 20);
        doc.text(`GST (18%): ${(formData.totalAmount * 0.18).toFixed(2)}`, 15, amountSummaryY + 26);
        doc.text(`Total (Incl. GST): ${(formData.totalAmount * 1.18).toFixed(2)}`, 15, amountSummaryY + 32);
        doc.text(`Amount In Words: ${formData.amountInWords}`, 15, amountSummaryY + 38);

        // Authorised Signatory Box
        const signatoryY = amountSummaryY + 55;
        doc.setDrawColor(200);
        doc.setFillColor(240, 240, 240);
        doc.rect(10, signatoryY, 190, 30, 'F'); // Draw filled rectangle for signatory
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.text('Authorised Signatory:', 15, signatoryY + 10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        doc.text(formData.authorisedSignatory, 15, signatoryY + 18);

        // Payment Instructions (Optional)
        const paymentY = signatoryY + 40;
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0);
        doc.text('Payment Instructions:', 15, paymentY);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        doc.text('Please make the payment within 30 days of receipt of this invoice.', 15, paymentY + 6);
        doc.text('Bank Details: XYZ Bank, Account No: 123456789, IFSC: XYZ1234', 15, paymentY + 12);

        // Footer (Optional)
        const footerY = paymentY + 30;
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(100);
        doc.text('Thank you for your business!', 15, footerY);
        doc.text('For any queries, please contact us at info@company.com', 15, footerY + 5);

        // Save the PDF
        doc.save('invoice.pdf');
    };
};






  // const generatePDF2 = () => {
  //   html2canvas(formRef.current, { scale: 2 }).then((canvas) => {
  //     const imgData = canvas.toDataURL('image/png');
  //     const pdf = new jsPDF({
  //       orientation: 'portrait', 
  //       unit: 'mm',
  //       format: 'a4',
  //       putOnlyUsedFonts: true,
  //       floatPrecision: 30
  //     });

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
      
  //     const imgWidth = canvas.width;
  //     const imgHeight = canvas.height;
  //     const imgAspectRatio = imgWidth / imgHeight;
  //     const pdfAspectRatio = pdfWidth / pdfHeight;

  //     let width, height;

  //     if (imgAspectRatio > pdfAspectRatio) {
  //       width = pdfWidth;
  //       height = pdfWidth / imgAspectRatio;
  //     } else {
  //       width = pdfHeight * imgAspectRatio;
  //       height = pdfHeight;
  //     }

  //     pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  //     pdf.save('quotation.pdf');
  //   });
  // };

  return (
    <div className="container-pdf" ref={formRef}>
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
        <div className='button-container'>

        <button  type="button" onClick={generatePDF}>Generate PDF</button>
        </div>
        
      </form>
    </div>
  );
};

export default PdfGenerator;
