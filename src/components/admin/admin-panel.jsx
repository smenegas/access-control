import React, { useState } from 'react';
import SecretaryManagement from './secretary-management';
// Importe os outros futuramente: GestaoPastas, GestaoMenus, GestaoUsuarios...
import './admin-panel.css'; // Estilos específicos para o painel admin

export default function AdminPanel() {
  const [abaAtiva, setAbaAtiva] = useState('secretarias');

  // Função para renderizar o subcomponente correto com base no menu clicado
  const renderizarConteudo = () => {
    switch (abaAtiva) {
      case 'secretarias': return <SecretaryManagement />;
      case 'pastas': return <div>Gestão de Pastas de Rede (Em construção)</div>;
      case 'modulos': return <div>Gestão de Módulos e Menus (Em construção)</div>;
      case 'usuarios': return <div>Gestão de Usuários (Em construção)</div>;
      default: return <SecretaryManagement />;
    }
  };

  return (
    <div className="admin-layout">
      {/* Menu Lateral */}
      <aside className="admin-sidebar">
        <h3>Painel TI</h3>
        <nav>
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
        </nav>
      </aside>

      {/* Área de Conteúdo Dinâmico */}
      <main className="admin-content">
        {renderizarConteudo()}
      </main>
    </div>
  );
}