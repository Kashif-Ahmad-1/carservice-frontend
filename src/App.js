
import { Route, Routes } from "react-router-dom";
import Hero from './components/Hero';
import AppointmentModal from "./components/AccountPage/AccountAddClient";
import Navbar from "./components/Navbar";
import AppointmentDetailsPage from "./components/AccountPage/AccountsDetailsPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import EngineerDetailsPage from "./components/EngineerPage/EngineerDetailsPage";
import Login from "./components/Authentication/Login";
import AccountantPage from './components/Admin/AccountantPage';
import EngineerPage from './components/Admin/EngineerPage';
import ChecklistPage from "./components/EngineerPage/ChecklistPage";
import PdfGenerator from "./components/Pdf Generator/PdfGenerator";
import { AuthProvider } from "./Store/AuthContext";
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute component
import ServiceRequestPage from "./components/Admin/ServiceRequest";
import ResetPassword from "./components/Authentication/ResetPassword";
import ClientPage from "./components/Admin/ClientPage";
import MachinePage from "./components/Admin/MachinePage";
function App() {
  // const role = localStorage.getItem("role");
  // console.log(role);
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route index path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}

          {/* Admin */}
          <Route
            path="/admin"
            element={<PrivateRoute element={AdminDashboard} roles={["admin"]} />}
          />
            <Route
            path="/accountants"
            element={<PrivateRoute element={AccountantPage} roles={["admin"]} />}
          />
          <Route
            path="/engineer-list"
            element={<PrivateRoute element={EngineerPage} roles={["admin"]} />}
          />
          <Route
            path="/service-request"
            element={<PrivateRoute element={ServiceRequestPage} roles={["admin"]} />}
          />

          {/* Accountant */}
          <Route
            path="/accountspage"
            element={<PrivateRoute element={AppointmentDetailsPage} roles={["accountant"]} />}
          />
          <Route
            path="/account-add-client"
            element={<PrivateRoute element={AppointmentModal} roles={["accountant"]} />}
          />

          {/* Engineer */}
          <Route
            path="/engineerservice"
            element={<PrivateRoute element={EngineerDetailsPage} roles={["engineer"]} />}
          />
          <Route
            path="/checklist"
            element={<PrivateRoute element={ChecklistPage} roles={["engineer"]} />}
          />
          
        

          {/* PDF generation route, assuming anyone can access */}
          <Route path="/pdfcheck" element={<PdfGenerator />} />
          <Route path="/client-list" element={<ClientPage />} />
          <Route path="/machine-list" element={<MachinePage />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
