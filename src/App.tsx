import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Clients from './pages/Clients';
import Cases from './pages/Cases';
import Billing from './pages/Billing';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import TimeTracking from './pages/TimeTracking';
import AdminTimeTracking from './pages/AdminTimeTracking';
import DashboardLayout from './components/layout/DashboardLayout';
import PrivateRoute from './components/auth/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="clients" element={<Clients />} />
          <Route path="cases" element={<Cases />} />
          <Route path="billing" element={<Billing />} />
          <Route path="documents" element={<Documents />} />
          <Route path="settings" element={<Settings />} />
          <Route path="time-tracking" element={<TimeTracking />} />
          <Route path="admin-time-tracking" element={<AdminTimeTracking />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;