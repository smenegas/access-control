import React, { useState, useEffect, useMemo } from 'react';
import { fetchAllUsers } from '../../helpers/users/users'; // Função para buscar usuários
import { useNavigate } from 'react-router-dom';

import AccountEditUserSelected from './account-edit-user-selected';
import './account-edit.css';

export default function AccountEdit() {
  // Estados para a Parte 1 (Listagem, Busca e Paginação)
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();
  
  // Estados para a Parte 2 (Formulário de Edição)
  const perPage = 5; // número de itens por página (ajustável)

  const getToken = () => sessionStorage.getItem('@AppAcessos:token');

  // Carrega a lista sempre que a página atual ou o termo de busca mudar
  useEffect(() => {
    loadUsers();
  }, [currentPage, search]);

  // Função que deve ser acionada quando a atualização do usuário selecionado for bem sucedida.
  const successUpdate = async () => {
    await loadUsers();
    setSelectedUser(null);
    setError({ text: "Os dados do usuário " + selectedUser.name + " foram atualizados com sucesso." })
  };

  const loadUsers = async () => {
    try {
      const data = await fetchAllUsers();
      if (!data.ok){
        setError({ text: 'Erro ao carregar usuários', type: 'error' });
        return;
      }
      const allUsers = await data.json();
      // Ordena alfabeticamente pelo campo de nome antes de setar o estado
      allUsers.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'pt-BR', { sensitivity: 'base' }));
      setUsers(allUsers);
      // totalPages será calculado a partir do conjunto filtrado
    } catch (error) {
      setError({ text: error.message, type: 'error' });
      setUsers([]);
      return;
    }
  };

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

  const handleBuscar = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reseta para a primeira página ao buscar
  };

  const userToEdit = (user) => {
    setSelectedUser(user);    
  };

  const cancelEdit = () => {
    setSelectedUser(null);
    setError(null);
  };

  return (
    //Mostra a table de usuários ativos.
    
    <div className="account-edit-root">
      {!selectedUser && (
        <div>
          <div className="cabecalho-lista">
            <h2>Editar Dados das Contas Existentes</h2>
          </div>
          <hr className='linha-separadora'/>

        {error && (
          <div className={ error.type === 'error' ? 'alert alert-danger' : 'alert alert-success' }>
            {error.text}
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
                      ✏️ Editar Conta
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-row">
                    Nenhum servidor ativo encontrado para os critérios de busca.
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
      </div>)}
      {/* A Parte 2 (Formulário de Edição) é renderizada em um componente separado quando um usuário é selecionado para edição */}
      {selectedUser && <AccountEditUserSelected 
        userEdit={selectedUser} 
        cancel={cancelEdit} 
        updateUserList={successUpdate}/>}
    </div>
  );
}
