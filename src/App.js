import "../src/dist/styles.css";
import { Route, Routes } from "react-router-dom";
import Hero from './components/Hero';
import AppointmentModal from "./components/AccountPage/AccountAddClient";
import Navbar from "./components/Navbar";
import AppointmentDetailsPage from "./components/AccountPage/AccountsDetailsPage";
import AdminDashboard from "./components/Admin/AdminDashboard";
import EngineerDetailsPage from "./components/EngineerPage/EngineerDetailsPage";
import Login from "./components/Authentication/Login";
import AccountantPage from './components/Admin/AccountantPage'
import MechanicPage from './components/Admin/MechanicPage'
import ChecklistPage from "./components/EngineerPage/ChecklistPage";
import PdfGenerator from "./components/PdfGenerator";

function App() {
  return (
    <div >
      
     <Routes>
        <Route index path="/" element={<Hero />} />
        <Route path="/account-add-client" element={<AppointmentModal />} />
    
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      
        <Route path="/accountspage" element={<AppointmentDetailsPage />} />
        <Route path="/engineer/:employerId" element={<EngineerDetailsPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />


        <Route path="/pdfcheck" element={<PdfGenerator />} />

        <Route path="/accountants" element={<AccountantPage />} />
        <Route path="/mechanics" element={<MechanicPage />} />
      </Routes>
    </div>
  );
}

export default App;
