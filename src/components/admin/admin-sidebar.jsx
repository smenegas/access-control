import './admin-panel.css'; // Estilos específicos para o painel admin

export default function AdminSidebar({ activeTab, setActiveTab, activeUserSubmenu, setActiveUserSubmenu, logout, newAccount }) {
    return (
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
                <button className={activeUserSubmenu === 'cadastrar' ? 'ativo' : ''} onClick={newAccount}>➕ Cadastrar Usuários</button>
                <button className={activeUserSubmenu === 'editar' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('editar')}>✏️ Editar Contas</button>
                <button className={activeUserSubmenu === 'ativar' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('ativar')}>✅ Ativar Contas</button>
                <button className={activeUserSubmenu === 'inativar' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('inativar')}>🚫 Inativar Contas</button>
                <button className={activeUserSubmenu === 'validar' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('validar')}>🧾 Validar Contas</button>
                <button className={activeUserSubmenu === 'redefinir' ? 'ativo' : ''} onClick={() => setActiveUserSubmenu('redefinir')}>🔑 Redefinir Senha</button>
              </div>
            )}
            <button 
              className="logout-btn" 
              onClick={logout}
            >
              🚪 Sair
            </button>
          </nav>
        </aside>
    )}
        