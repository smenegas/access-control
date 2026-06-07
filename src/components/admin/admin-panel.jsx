import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMain from './admin-main';
import AdminSidebar from './admin-sidebar';
import { logout, getUser } from '../../helpers/authentication';

// Importe os outros futuramente: GestaoPastas, GestaoMenus, GestaoUsuarios...
import './admin-panel.css'; // Estilos específicos para o painel admin

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeUserSubmenu, setActiveUserSubmenu] = useState('cadastrar');
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlerNewAccount = () => {
    setActiveTab('usuarios');
    setActiveUserSubmenu('cadastrar');
    return <AdminMain activeTab={'usuarios'} activeUserSubmenu={'cadastrar'} user={user} />;
  };

  return (
    <div className="admin-container">
      {/* Cabeçalho */}
      <header className="admin-header">
        <div>
          <h1 className="admin-header-title">Painel Administrativo - Prefeitura de Canela</h1>
          <p>Gerencie secretarias, pastas, sistemas e usuários.</p>
        </div>
      </header>

      <div className="admin-layout">
        {/* Menu Lateral */}
        <AdminSidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          activeUserSubmenu={activeUserSubmenu} 
          setActiveUserSubmenu={setActiveUserSubmenu} 
          logout={handleLogout}
          newAccount={handlerNewAccount}
        />

        {/* Área de Conteúdo Dinâmico */}
        <main className="admin-content">
          <AdminMain activeTab={activeTab} activeUserSubmenu={activeUserSubmenu} user={user} />
        </main>
      </div>
    </div>
  );
}