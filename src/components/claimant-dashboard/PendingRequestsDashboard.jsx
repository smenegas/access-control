import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../../helpers/authentication';
import Header from '../common/header';
import './claimant-dashboard.css';

const PendingRequestsDashboard = ({ requests }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);
  // Tenta obter o usuário do estado da rota ou pelo helper
  const user = location.state?.user || getUser() || null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="dashboard-container">
      {/* Cabeçalho */}
      <Header message="Bem-vindo(a)! Gerencie as solicitações de pastas e sistemas." />

      {/* Conteúdo principal */}
      <div className="claimant-dashboard">
        {(!user || user.profile <= 2) ? (
          <div>
            <h2>Não autorizado</h2>
            <p>Você não tem permissão para acessar esta página.</p>
            <button onClick={handleBack} className="back-dashboard-btn">Voltar ao Dashboard</button>
          </div>
        ) : (
          <>
            <h2>Solicitações Pendentes</h2>
            {requests && requests.length > 0 ? (
              <ul>
                {requests.map((req) => (
                  <li key={req.id} className="pending-request-item">
                    <strong>{req.title}</strong> - {req.description}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Não há solicitações pendentes.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PendingRequestsDashboard;
