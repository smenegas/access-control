import { useState, useEffect, useMemo } from 'react';
import { fetchAllUsers, changeUserPasswordAdmin } from '../../helpers/users/users';

import './account-edit.css';
import './reset-password.css';
import '../common/messages.css';

export const ResetPassword = (user = null) => {

    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [password, setPassword] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState('');
    const [msg, setMsg] = useState(null);

    const perPage = 5; // número de itens por página (ajustável)

    // Filtra usuários pelo termo de busca (nome ou matrícula/CPF)
    const filteredUsers = useMemo(() => {
        const term = (search || '').trim().toLowerCase();
        if (!term) return users;
        return users.filter(u => {
            const nome = (u.name || '').toLowerCase();
            const matricula = (u.registration_number || '').toLowerCase();
            return nome.includes(term) || matricula.includes(term);
        });
    }, [users, search]);

    //Load users list
    useEffect(() => {
        const loadData = async () => {
            await loadUsers();
        }
        loadData();
    }, []);

    // Atualiza o número total de páginas sempre que o conjunto filtrado mudar
    useEffect(() => {
        const pages = filteredUsers.length > 0 ? Math.ceil(filteredUsers.length / perPage) : 1;
        setTotalPages(pages);
        if (currentPage > pages) setCurrentPage(1);
    }, [filteredUsers, perPage]);

    // Usuários a serem exibidos na página atual
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * perPage;
        return filteredUsers.slice(start, start + perPage);
    }, [filteredUsers, currentPage, perPage]);

    const loadUsers = async () => {
        let resp = await fetchAllUsers();
        if (resp) {
            let loadedUsers = await resp.json();
            let filteredLoadedUsers = loadedUsers.filter(u => u.account_status === 1); // Filtra apenas usuários ativos
            
            if (filteredLoadedUsers === null || filteredLoadedUsers.length === 0) {
                setMsg({ type: 'info', text: 'Não há contas de usuário para redefinir senha no momento.' });
                setUsers([]);
                return;
            }
            setUsers(filteredLoadedUsers);
        }
    };

    const handleBuscar = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reseta para a primeira página ao buscar
    };

    const handleSelectUser = async (user) => {
        setSelectedUser(user);
    };

    const handleResetPassword = async () => {
        try {
          let response = await changeUserPasswordAdmin(selectedUser.id, password);
          console.log('Response from changeUserPasswordAdmin:', response);
          if (response.ok) {
              setMsg({ type: 'success', text: `Senha redefinida com sucesso para ${selectedUser.name}.` });
              setSelectedUser(null);
              setPassword('');
          } else {
              const errorData = await response.json();
              setMsg({ type: 'error', text: `Erro ao redefinir senha: ${errorData.message || 'Erro desconhecido'}` });
          };
        } catch (error) {
          setMsg({ type: 'error', text: `Erro ao redefinir senha: ${error.message}` });
        };
    };

    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };

    return (
        <>
        <div className="account-edit-root">
            <div>
                <div className="cabecalho-lista">
                <h2>Redefinir Senhas</h2>
                </div>
            </div>
        </div>
        <hr className='linha-separadora'/>

        {msg && (
          <div className={
              msg.type === 'error' ? 'error-message' :  
              msg.type === 'info' ? 'warning-message' :
              msg.type === 'success' ? 'success-message' : 
              'alert'
            }>
            {msg.text}
          </div>
        )}

        {/* Campo de Busca */}
        {selectedUser && (
            <>
            <div className="card-password">
                <div className="selected-user-info">
                    <p>Digite a nova senha para {selectedUser.name}</p>
                    <input 
                      type="password" 
                      placeholder="Nova Senha" 
                      className="password-input"
                      value={password}
                      onChange={handleChangePassword}
                      required
                    />
                    
                </div>
                <div className="selected-user-info">
                    <button 
                      type="button"
                      className="password-button"
                      onClick={handleResetPassword}
                    >
                        Redefinir Senha
                    </button>
                </div>
            </div>
            </>
        )}
              {!selectedUser && (
              <>
        <div className='cabecalho-lista'>
            <input 
                type="text" 
                placeholder="Buscar por Nome ou CPF..." 
                className="login-input search-input" 
                value={search}
                onChange={handleBuscar}
            />
        </div>

        <div className="tabela-container">
          <table className="tabela-solicitacoes">
            <thead>
              <tr>
                <th>Matrícula</th>
                <th>Nome</th>
                <th>E-mail</th>
                <th style={{ textAlign: 'center' }}>Ação</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.registration_number}</td>
                  <td><strong>{user.name}</strong></td>
                  <td>{user.email}</td>
                  <td>
                    <button 
                      className="btn-secundario" 
                      onClick={() => handleSelectUser(user)}
                    >
                      🔑 Redefinir Senha
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-row">
                    Nenhuma conta encontrada para os critérios de busca.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Controles de Paginação */}
        {totalPages > 1 && (
          <div className="pagination-controls">
            <button 
              className="btn-secundario"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              ◀ Anterior
            </button>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#4a5568' }}>
              Página {currentPage} de {totalPages}
            </span>
            <button 
              className="btn-secundario"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Próxima ▶
            </button>
          </div>
        )}
        </>)}
        </>
    );
};