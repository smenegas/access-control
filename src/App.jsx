import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import ClaimantDashboard from './components/claimant-dashboard/claimant-dashboard';
import Login from './components/login/login';
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ClaimantDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
