import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Patients from './pages/Patients';
import Appointments from './pages/Appointments';
import Admissions from './pages/Admissions';
import Prescriptions from './pages/Prescriptions';
import AuditLog from './pages/AuditLog';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<div className="p-6"><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-gray-500 mt-2">Welcome to HMS</p></div>} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/audit-log" element={<AuditLog />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}