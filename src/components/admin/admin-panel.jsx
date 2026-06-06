import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../../helpers/authentication';
import SecretaryManagement from './secretary-management';
import AdminInstructions from './AdminInstructions';
import NewAccount from '../new-account/new-account';
import EditAccount from '../edit-account/edit-account';
import ValidationAccounts from '../validation-accounts/validation-accounts';
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

  // Função para renderizar o subcomponente correto com base no menu clicado
  const renderizarConteudo = () => {
    switch (activeTab) {
      case 'home': return (
        <AdminInstructions user={user} />
      );
      case 'secretarias': return <SecretaryManagement />;
      case 'pastas': return <div>Gestão de Pastas de Rede (Em construção)</div>;
      case 'modulos': return <div>Gestão de Módulos e Menus (Em construção)</div>;
      case 'usuarios': return (
        <div>
          {activeUserSubmenu === 'cadastrar' && <NewAccount />}
          {activeUserSubmenu === 'editar' && <EditAccount />}
          {activeUserSubmenu === 'validar' && <ValidationAccounts />}
          {activeUserSubmenu === 'ativar' && (
            <div>
              <h3>Ativar Contas</h3>
              <p>Funcionalidade de ativação em construção. Será possível ativar contas existentes aqui.</p>
            </div>
          )}
          {activeUserSubmenu === 'inativar' && (
            <div>
              <h3>Inativar Contas</h3>
              <p>Funcionalidade de inativação em construção. Lista de usuários para inativar aparecerá aqui.</p>
            </div>
          )}
          {activeUserSubmenu === 'redefinir' && (
            <div>
              <h3>Redefinir Senha</h3>
              <p>Ferramenta para redefinir a senha de usuários (em construção).</p>
            </div>
          )}
        </div>
      );
      default: return (
        <AdminInstructions user={null} />
      );
    }
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
                <button className={activeUserSubmenu === 'cadastrar' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('cadastrar')}>➕ Cadastrar Usuários</button>
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
          {renderizarConteudo()}
        </main>
      </div>
    </div>
  );
}