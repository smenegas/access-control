import React from 'react';
import { useState } from 'react';
import { logout, getUser } from '../../helpers/authentication';
import { useNavigate } from 'react-router-dom';
import './header.css';

export default function Header({ message }) {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    // Tenta obter o usuário do estado da rota ou pelo helper
    const user = getUser() || null;

    const handleLogout = () => {
        setMenuAberto(false);
        logout();
        navigate('/');
    };

    const handleAdminPanel = () => {
        setMenuAberto(false);
        navigate('/admin');
    };

    return (
        <header className="dashboard-header">
        <div className="dashboard-header-div-title">
          <h1 className="dashboard-header-title">Portal de Acessos - Prefeitura de Canela</h1>
          <p style={{ margin: 0 }}>{message}</p>
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
    );
};