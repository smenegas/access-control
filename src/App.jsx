import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import ClaimantDashboard from './components/claimant-dashboard/claimant-dashboard';
import Login from './components/login/login';
import NewAccount from './components/new-account/new-account';
import AdminPanel from './components/admin/admin-panel';
import PendingRequestsDashboard from './components/claimant-dashboard/PendingRequestsDashboard';
import SecretaryDashboard from './components/secretary-dashboard/secretary-dashboard';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><ClaimantDashboard /></ProtectedRoute>} />
        <Route path="/new-account" element={<NewAccount />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
        <Route path='pending-requests' element={<ProtectedRoute><PendingRequestsDashboard /></ProtectedRoute>} />
        <Route path='/secretary-dashboard' element={<ProtectedRoute><SecretaryDashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
