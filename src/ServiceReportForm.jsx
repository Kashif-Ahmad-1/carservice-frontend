import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ServiceReportForm = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { engineerId } = useParams();
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/api/appointments/", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                // Sort appointments by creation date descending
                data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setAppointments(data);
            } catch (error) {
                console.error("Failed to fetch appointment data", error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentData();
    }, [engineerId]);

    const handleDownload = (pdfPath) => {
        if (pdfPath) {
            const link = document.createElement('a');
            link.href = pdfPath;
            link.setAttribute('download', 'checklist.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading appointment data: {error.message}</p>;

    return (
        <div>
            <h1>Appointment Details</h1>
            {appointments.length > 0 ? (
                appointments.map(appointment => (
                    <div key={appointment._id}>
                        <h2>Client Name: {appointment.clientName || "N/A"}</h2>
                        <p>Contact Person: {appointment.contactPerson || "N/A"}</p>
                        <p>Phone: {appointment.mobileNo || "N/A"}</p>
                        <p>Address: {appointment.clientAddress || "N/A"}</p>
                        <p>Appointment Date: {new Date(appointment.appointmentDate).toLocaleString()}</p>

                        <h3>Checklists</h3>
                        {appointment.checklists.length > 0 ? (
                            appointment.checklists.map(checklist => (
                                <div key={checklist._id}>
                                    <p>Checklist for: {checklist.clientInfo.name || "N/A"}</p>
                                    <p>Invoice No: {checklist.invoiceNo || "N/A"}</p>
                                    <button onClick={() => handleDownload(checklist.pdfPath)}>Download Checklist PDF</button>
                                </div>
                            ))
                        ) : (
                            <p>No checklists available for this appointment.</p>
                        )}
                    </div>
                ))
            ) : (
                <p>No appointments found.</p>
            )}
        </div>
    );
};

export default ServiceReportForm;
