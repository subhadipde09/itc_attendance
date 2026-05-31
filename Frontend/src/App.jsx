import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import TotpVerify from './pages/TotpVerify';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Attendance from './pages/Attendance';
import Roster from './pages/Roster';
import Replacements from './pages/Replacements';
import ShiftSwaps from './pages/ShiftSwaps';
import Analytics from './pages/Analytics';
import AdminManagement from './pages/AdminManagement';
import ProfileSettings from './pages/ProfileSettings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/verify-totp" element={<TotpVerify />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="roster" element={<Roster />} />
            <Route path="replacements" element={<Replacements />} />
            <Route path="swaps" element={<ShiftSwaps />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<ProfileSettings />} />
            <Route element={<ProtectedRoute roles={['SUPER_ADMIN']} />}>
              <Route path="admins" element={<AdminManagement />} />
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
