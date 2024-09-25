import React, { useState, useRef } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import "./PdfGenerator.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const QuotationGenerator = () => {
  const formRef = useRef();
  const location = useLocation();
  const { clientName, contactPerson, address, mobileNo } = location.state || {};

  const generateQuotationNo = () => "QT" + Math.floor(Math.random() * 100000);
  const formatDate = (date) => date.toLocaleDateString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" });

  const [clientInfo, setClientInfo] = useState({
    name: clientName || "",
    contactPerson: contactPerson || "",
    phone: mobileNo || "",
    address: address || "",
  });

  const [formData, setFormData] = useState({
    buyerName: clientName || "",
    quotationNo: generateQuotationNo(),
    docDate: formatDate(new Date()),
    address: address || "",
    contactPerson: contactPerson || "",
    mobileNo: mobileNo || "",
    email: "",
    items: [],
    gst: 18,
    totalAmount: 0,
    totalWithGST: 0,
    advance: "",
    validity: "",
    authorisedSignatory: "",
  });

  const [itemData, setItemData] = useState({
    itemName: "",
    quantity: "",
    rate: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "gst") {
      updateTotalWithGST(value);
    }
  };

  const handleItemChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItem = () => {
    if (itemData.itemName && itemData.quantity && itemData.rate) {
      const quantity = parseFloat(itemData.quantity);
      const rate = parseFloat(itemData.rate);
      const total = quantity * rate;
      const gstAmount = (total * formData.gst) / 100;
      const totalWithGST = total + gstAmount;

      const newItem = { ...itemData, total, gstAmount, totalWithGST };
      setFormData((prevData) => {
        const updatedItems = [...prevData.items, newItem];
        const totalAmount = calculateTotalAmount(updatedItems);
        const totalWithGST = calculateTotalWithGST(totalAmount, prevData.gst);
        return {
          ...prevData,
          items: updatedItems,
          totalAmount,
          totalWithGST,
        };
      });
      setItemData({ itemName: "", quantity: "", rate: "" });
    }
  };

  const calculateTotalAmount = (items) => {
    return items.reduce((acc, item) => acc + (item.total || 0), 0);
  };

  const calculateTotalWithGST = (totalAmount, gstPercentage) => {
    const gstAmount = (totalAmount * gstPercentage) / 100;
    return totalAmount + gstAmount;
  };

  const updateTotalWithGST = (gstPercentage) => {
    const totalAmount = calculateTotalAmount(formData.items);
    const totalWithGST = calculateTotalWithGST(totalAmount, gstPercentage);
    setFormData((prevData) => ({
      ...prevData,
      totalAmount,
      totalWithGST,
    }));
  };
  const itemRows = formData.items.map((item, index) => [
    index + 1,
    item.itemName,
    item.quantity,
    item.rate,
    (item.gstAmount || 0).toFixed(2), // Ensure gstAmount has a default value
    (item.totalWithGST || 0).toFixed(2), // Ensure totalWithGST has a default value
  ]);

  const generatePDF = async () => {
    const doc = new jsPDF();
    const logo = "https://cdn.pixabay.com/photo/2016/12/27/13/10/logo-1933884_640.png";

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
      // doc.text(`Total Amount: ${formData.totalAmount.toFixed(2)}`, 15, amountSummaryY + 20);
      // doc.text(`GST (18%): ${(formData.totalAmount * 0.18).toFixed(2)}`, 15, amountSummaryY + 26);
      doc.text(`Total Amount(Incl. GST): ${(formData.totalAmount * 1.18).toFixed(2)}`, 15, amountSummaryY + 32);
      // doc.text(`Amount In Words: ${formData.amountInWords}`, 15, amountSummaryY + 38);

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

    const pdfBlob = doc.output("blob");
    const pdfFile = new File([pdfBlob], "quotation.pdf", { type: "application/pdf" });

    const formDatas = new FormData();
    formDatas.append("pdf", pdfFile);
    formDatas.append("quotationData", JSON.stringify({ clientInfo, quotationNo: formData.quotationNo }));

    try {
      await axios.post("http://localhost:5000/api/quotations", formDatas, { headers: { "Content-Type": "multipart/form-data" } });
      console.log("Checklist and PDF uploaded successfully");
    } catch (error) {
      console.error("Error uploading checklist and PDF:", error);
    }

    doc.save("quotation.pdf");
  };

  return (
    <div className="container-pdf" ref={formRef}>
      <h2>Quotations</h2>
      <form className="form-box">
        <h4>Buyer Details</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Buyer Name:</label>
            <input type="text" name="buyerName" value={clientInfo.name} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Quotation No:</label>
            <input type="text" name="quotationNo" value={formData.quotationNo} readOnly />
          </div>
          <div className="form-group">
            <label>Date:</label>
            <input type="text" name="docDate" value={formData.docDate} readOnly />
          </div>
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Contact Person:</label>
            <input type="text" name="contactPerson" value={clientInfo.contactPerson} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label>Mobile No:</label>
            <input type="text" name="mobileNo" value={formData.mobileNo} onChange={handleInputChange} />
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
                <label>GST Amount:</label>
                <input type="number" value={item.gstAmount.toFixed(2)} readOnly />
              </div>
              <div className="form-group">
                <label>Total:</label>
                <input type="number" value={item.totalWithGST.toFixed(2)} readOnly />
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
            <label>GST (%):</label>
            <input type="number" name="gst" value={formData.gst} onChange={handleInputChange} />
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
            <label>Total Amount:</label>
            <input type="number" value={formData.totalWithGST.toFixed(2)} readOnly />
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
        <div className="button-container">
          <button type="button" onClick={generatePDF}>
            Generate PDF
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuotationGenerator;
