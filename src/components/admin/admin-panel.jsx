import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../../helpers/authentication';
import SecretaryManagement from './secretary-management';
import AdminInstructions from './AdminInstructions';
// Importe os outros futuramente: GestaoPastas, GestaoMenus, GestaoUsuarios...
import './admin-panel.css'; // Estilos específicos para o painel admin

export default function AdminPanel() {
  const [abaAtiva, setAbaAtiva] = useState('home');
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Função para renderizar o subcomponente correto com base no menu clicado
  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'home': return (
        <AdminInstructions user={user} />
      );
      case 'secretarias': return <SecretaryManagement />;
      case 'pastas': return <div>Gestão de Pastas de Rede (Em construção)</div>;
      case 'modulos': return <div>Gestão de Módulos e Menus (Em construção)</div>;
      case 'usuarios': return <div>Gestão de Usuários (Em construção)</div>;
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
              className={abaAtiva === 'home' ? 'ativo' : ''} 
              onClick={() => setAbaAtiva('home')}
            >
              🏠 Início
            </button>
            <button 
              className={abaAtiva === 'secretarias' ? 'ativo' : ''} 
              onClick={() => setAbaAtiva('secretarias')}
            >
              🏛️ Secretarias
            </button>
            <button 
              className={abaAtiva === 'pastas' ? 'ativo' : ''} 
              onClick={() => setAbaAtiva('pastas')}
            >
              📁 Pastas de Rede
            </button>
            <button 
              className={abaAtiva === 'modulos' ? 'ativo' : ''} 
              onClick={() => setAbaAtiva('modulos')}
            >
              🖥️ Sistemas e Menus
            </button>
            <button 
              className={abaAtiva === 'usuarios' ? 'ativo' : ''} 
              onClick={() => setAbaAtiva('usuarios')}
            >
              👥 Usuários
            </button>
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