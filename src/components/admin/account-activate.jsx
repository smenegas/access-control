import { useState, useMemo, useEffect } from 'react';
import { fetchDisabledAccounts } from '../../helpers/users/users';

import './account-edit.css';
import '../common/messages.css';

export const AccountActivate = ({user = null}) => {

    const [users, setUsers] = useState([]);
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

    const handleBuscar = () => {

    }

    // Function for loading the list of users that are the disabled accounts.
    const loadUsers = async () => {
        let data = null;
        let loadedUsers = null;
        try {
            data = await fetchDisabledAccounts();
            loadedUsers = await data.json();
            if (loadedUsers.length === 0) {
                setMsg({ text: 'Não há contas de usuários desativadas para ativação.', type: 'info' });
            }
            loadedUsers.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR', { sensitivity: 'base' }));
            setUsers(loadedUsers);
        }
        catch (e) {
            setMsg({ text: 'Houve um erro ao carregar a lista de usuários.', type: 'error' })
            throw new Error(e.message);
        }
    }
    

    return (
        <>
        <div className="account-edit-root">
            <div>
                <div className="cabecalho-lista">
                <h2>Ativar Contas de Usuários</h2>
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
                      onClick={() => userToEdit(user)}
                    >
                      ✅ Ativar Conta
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
        </>
    );
}