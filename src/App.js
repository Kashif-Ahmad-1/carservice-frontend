
import { Route, Routes } from "react-router-dom";
import Hero from './components/Hero';
import AppointmentModal from "./components/AccountPage/AccountAddClient";
import Navbar from "./components/Navbar";
import AppointmentDetailsPage from "./components/AccountPage/AccountsDetailsPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import EngineerDetailsPage from "./components/EngineerPage/EngineerDetailsPage";
import Login from "./components/Authentication/Login";
import AccountantPage from './components/Admin/AccountantPage';
import MechanicPage from './components/Admin/MechanicPage';
import ChecklistPage from "./components/EngineerPage/ChecklistPage";
import PdfGenerator from "./components/Pdf Generator/PdfGenerator";
import { AuthProvider } from "./Store/AuthContext";
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute component

function App() {
  const role = localStorage.getItem("role");
  console.log(role);
  return (
    <AuthProvider>
      <div>
        <Routes>
          <Route index path="/" element={<Hero />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/admin"
            element={<PrivateRoute element={AdminDashboard} roles={["admin"]} />}
          />
          <Route
            path="/accountspage"
            element={<PrivateRoute element={AppointmentDetailsPage} roles={["accountant"]} />}
          />
          <Route
            path="/engineerservice"
            element={<PrivateRoute element={EngineerDetailsPage} roles={["engineer"]} />}
          />
          <Route
            path="/checklist"
            element={<PrivateRoute element={ChecklistPage} roles={["engineer"]} />}
          />
          <Route
            path="/account-add-client"
            element={<PrivateRoute element={AppointmentModal} roles={["accountant"]} />}
          />
          <Route
            path="/accountants"
            element={<PrivateRoute element={AccountantPage} roles={["admin"]} />}
          />
          <Route
            path="/mechanics"
            element={<PrivateRoute element={MechanicPage} roles={["admin"]} />}
          />

          {/* PDF generation route, assuming anyone can access */}
          <Route path="/pdfcheck" element={<PdfGenerator />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
