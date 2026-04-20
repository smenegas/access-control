import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import ClaimantDashboard from './components/claimant-dashboard/claimant-dashboard';
import Login from './components/login/login';
import NewAccount from './components/new-account/new-account';
import AdminPanel from './components/admin/admin-panel';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <ClaimantDashboard />
          </ProtectedRoute>
        } />
        <Route path="/new-account" element={<NewAccount />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App
