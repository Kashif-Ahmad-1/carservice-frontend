
import React, { useState, useEffect, useRef } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import './PdfGenerator.css';
import { useLocation } from "react-router-dom";
import axios from 'axios';

const PdfGenerator = () => {
  const formRef = useRef();
  const location = useLocation();
  console.log(location.state)
  const { clientName, contactPerson, address, mobileNo,appointmentId } = location.state || {};

  const generateQuotationNo = () => {
    return 'QT' + Math.floor(Math.random() * 100000); // Example: QT12345
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString(undefined, options);
  };

  const [formData, setFormData] = useState({
    buyerName: clientName || '',
    quotationNo: generateQuotationNo(),
    docDate: formatDate(new Date()),
    address: address ||'',
    contactPerson:contactPerson || '',
    mobileNo: mobileNo || '',
    email: '',
    items: [],
    amountInWords: '',
    gst: 18,
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
  };

  const addItem = () => {
    if (itemData.itemName && itemData.quantity && itemData.rate) {
      const total = parseFloat(itemData.quantity) * parseFloat(itemData.rate);
      const newItem = { ...itemData, total };
      setFormData((prevData) => ({
        ...prevData,
        items: [...prevData.items, newItem]
      }));
      setItemData({ itemName: '', quantity: '', rate: '' });
    }
  };

  const calculateTotalAmount = () => {
    return formData.items.reduce((acc, item) => acc + (item.total || 0), 0);
  };

  useEffect(() => {
    const totalAmount = calculateTotalAmount();
    const gstAmount = (totalAmount * formData.gst) / 100;
    const totalWithGST = totalAmount + gstAmount;

    setFormData((prevData) => ({
      ...prevData,
      totalAmount,
      totalWithGST,
    }));
  }, [formData.items]);

  const generatePDF = async () => {
    const doc = new jsPDF();

    const logoImg = new Image();
    logoImg.src = 'https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_640.png';
    logoImg.onload = async () => {
      doc.addImage(logoImg, 'PNG', 10, 10, 40, 15);

      doc.setDrawColor(200);
      doc.setFillColor(245, 245, 245);
      doc.rect(60, 10, 100, 25, 'F');
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text('Company Information', 65, 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text('Works: B-2 Sara Industrial Estate, Dehradun-248197', 65, 22);
      doc.text('Office: C-111/112 New Multan Nagar, New Delhi-110056', 65, 26);
      doc.text('GST NO: 05AAACA1814D1ZI', 65, 30);

      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(50, 50, 100);
      doc.text('INVOICE', 105, 55, null, null, 'center');

      doc.setDrawColor(200);
      doc.setFillColor(240, 240, 240);
      doc.rect(10, 60, 190, 40, 'F');
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text(`BILL TO:`, 15, 67);

      const buyerDetails = [
        [`Invoice No: ${formData.quotationNo}`, `Invoice Date: ${formData.docDate}`],
        [`Customer: ${formData.buyerName}`, `Address: ${formData.address}`],
        [`Contact: ${formData.contactPerson}`, `Mobile: ${formData.mobileNo}`],
        [`Email: ${formData.email}`, '']
      ];

      const buyerStartY = 73;
      buyerDetails.forEach((line, index) => {
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        doc.text(line[0], 15, buyerStartY + index * 6);
        if (line[1]) {
          doc.text(line[1], 110, buyerStartY + index * 6);
        }
      });

      const itemColumns = ['Sr. No', 'Item Name', 'Delivery Date', 'Unit', 'Qty', 'Rate', 'Amount'];
      const itemRows = formData.items.map((item, index) => [
        index + 1,
        item.itemName,
        item.deliveryDate,
        item.unit,
        item.quantity,
        !isNaN(item.rate) ? Number(item.rate).toFixed(2) : '0.00',
        !isNaN(item.total) ? Number(item.total).toFixed(2) : '0.00'
      ]);

      for (let i = itemRows.length; i < 10; i++) {
        itemRows.push([i + 1, '', '', '', '', '', '']);
      }

      doc.autoTable(itemColumns, itemRows, {
        startY: 110,
        theme: 'striped',
        headStyles: { fillColor: [150, 150, 255], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
        styles: { cellPadding: 2, fontSize: 9, halign: 'center', fillColor: [240, 240, 240] }
      });

      const amountSummaryY = doc.lastAutoTable.finalY + 10;
      doc.setDrawColor(200);
      doc.setFillColor(240, 240, 240);
      doc.rect(10, amountSummaryY, 190, 50, 'F');
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

      const signatoryY = amountSummaryY + 55;
      doc.setDrawColor(200);
      doc.setFillColor(240, 240, 240);
      doc.rect(10, signatoryY, 190, 30, 'F');
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text('Authorised Signatory:', 15, signatoryY + 10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(formData.authorisedSignatory, 15, signatoryY + 18);

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

      const footerY = paymentY + 30;
      doc.setFontSize(8);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(100);
      doc.text('Thank you for your business!', 15, footerY);
      doc.text('For any queries, please contact us at info@company.com', 15, footerY + 5);


      // backend code
      const pdfBlob = doc.output("blob");
      const formDataToSend = new FormData();
      formDataToSend.append('fileField', pdfBlob, 'invoice.pdf');

      const quotationData = {
        appointmentId,
        quotationData: formData,
      };

      formDataToSend.append('quatationData', JSON.stringify(quotationData));

      try {
        const response = await fetch('http://localhost:5000/api/quotations', {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Quotation saved successfully:', data);
        } else {
          console.error('Error saving quotation:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }

      doc.save('invoice.pdf');

    };

  };

  return (
    <div className="container-pdf" ref={formRef}>
      <h2>Quatations</h2>
      <form className="form-box">
        <h4>Buyer Details</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Buyer Name:</label>
            <input  type="text" name="buyerName" value={formData.buyerName} onChange={handleInputChange} />
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
          {/* <div className="form-group">
            <label>Email:</label>
            <input type="text" name="email" value={formData.email} onChange={handleInputChange} />
          </div> */}
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
            <label>Total Amount:</label>
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
          <button type="button" onClick={generatePDF}>Generate PDF</button>
        </div>
      </form>
    </div>
  );
};

export default PdfGenerator;