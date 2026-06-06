import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminMain from './admin-main';
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
        <aside className="admin-sidebar">
          <h3>Painel TI</h3>
          <nav>
            <button 
              className={activeTab === 'home' ? 'ativo' : ''} 
              onClick={() => setActiveTab('home')}
            >
              🏠 Início
            </button>
            <button 
              className={activeTab === 'secretarias' ? 'ativo' : ''} 
              onClick={() => setActiveTab('secretarias')}
            >
              🏛️ Secretarias
            </button>
            <button 
              className={activeTab === 'pastas' ? 'ativo' : ''} 
              onClick={() => setActiveTab('pastas')}
            >
              📁 Pastas de Rede
            </button>
            <button 
              className={activeTab === 'modulos' ? 'ativo' : ''} 
              onClick={() => setActiveTab('modulos')}
            >
              🖥️ Sistemas e Menus
            </button>
            <button 
              className={activeTab === 'usuarios' ? 'ativo' : ''} 
              onClick={() => setActiveTab('usuarios')}
            >
              👥 Usuários
            </button>
            {activeTab === 'usuarios' && (
              <div className="usuarios-submenu" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px', paddingLeft: '12px' }}>
                <button className={activeUserSubmenu === 'cadastrar' ? 'ativo' : ''} onClick={handlerNewAccount}>➕ Cadastrar Usuários</button>
                <button className={activeUserSubmenu === 'editar' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('editar')}>✏️ Editar Contas</button>
                <button className={activeUserSubmenu === 'ativar' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('ativar')}>✅ Ativar Contas</button>
                <button className={activeUserSubmenu === 'inativar' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('inativar')}>🚫 Inativar Contas</button>
                <button className={activeUserSubmenu === 'validar' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('validar')}>🧾 Validar Contas</button>
                <button className={activeUserSubmenu === 'redefinir' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('redefinir')}>🔑 Redefinir Senha</button>
              </div>
            )}
            <button 
              className="logout-btn" 
              onClick={handleLogout}
            >
              🚪 Sair
            </button>
          </nav>
        </aside>

        {/* Área de Conteúdo Dinâmico */}
        <main className="admin-content">
          <AdminMain activeTab={activeTab} activeUserSubmenu={activeUserSubmenu} user={user} />
        </main>
      </div>
    </div>
  );
}