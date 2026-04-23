import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../../helpers/authentication';
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
      <header className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h1 className="dashboard-header-title" style={{ margin: 0 }}>Portal de Acessos - Prefeitura de Canela</h1>
          <p style={{ margin: 0 }}>Bem-vindo(a)! Gerencie as solicitações de pastas e sistemas.</p>
        </div>
        <div className="usuario-info" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="avatar">{(user?.name || user?.nome || 'Usuário').charAt(0).toUpperCase()}</span>
          <button
            type="button"
            className="usuario-nome"
            onClick={() => setMenuAberto((prev) => !prev)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {user?.name || user?.nome || 'Usuário'}
          </button>
          {menuAberto && (
            <div className="user-menu">
              <button type="button" className="menu-item">Minha Conta</button>
              {user?.profile > 2 && (
                <button type="button" className="menu-item" onClick={handleAdminPanel}>Painel Administrativo</button>
              )}
              <button type="button" className="menu-item" onClick={handleLogout}>Sair</button>
            </div>
          )}
        </div>
      </header>

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
