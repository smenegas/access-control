import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../helpers/authentication';
import { fetchPendingAccounts, rejectUserAccount, approveUserAccount } from '../../helpers/users/users';
import { getSecretaries } from '../../helpers/secretaries/secretaries';

import Header from '../common/header';
import './validation-accounts.css';
import '../common/messages.css';

export default function ValidationAccounts() {
  const navigate = useNavigate();
  if (!isAuthenticated()) {
    return (
      <div className="validation-accounts-container">
        <Header message="Acesso Negado" />
        <div className="warning-message">
          <p>Você precisa estar logado para acessar esta página.</p>
          <button className="warning-message-btn" onClick={() => navigate('/login/validation-accounts')}>
            Ir para Login
          </button>
        </div>
      </div>
    );
  }
  const [pendingAccounts, setPendingAccounts] = useState([]);
  const [secretaries, setSecretaries] = useState([]);
  // Estado para armazenar qual secretaria foi selecionada para cada usuário (Mapeamento: userId -> secretariaId)
  const [selectedLotations, setSelectedLotations] = useState({});
  const [message, setMessage] = useState(null);


  const getToken = () => sessionStorage.getItem('@AppAcessos:token');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // Carrega tanto as contas pendentes quanto a lista de secretarias em paralelo
    const headers = { 'Authorization': `Bearer ${getToken()}` };
    
    try {
      const pendingAccountsRes = await fetchPendingAccounts();

        if (pendingAccountsRes.ok) {
          setPendingAccounts(await pendingAccountsRes.json());
          const secretariesRes = await getSecretaries();
          if (secretariesRes.length > 0) {
            setSecretaries(secretariesRes);
          } else {
            throw new Error('Erro ao carregar secretarias.');
          }
        } else {
          throw new Error('Erro ao carregar contas pendentes.');
        }
    } catch (error) {
      let errorMessage = { type: 'error', text: 'Erro ao carregar dados: ' + error.message };
      setMessage(errorMessage);
      throw new Error('Erro ao carregar dados: ' + error.message);
    }
  };

  const handleChangeLotation = (userId, secretaryId) => {
    setSelectedLotations(prev => ({
      ...prev,
      [userId]: secretaryId
    }));
  };

  const activateAccount = async (userId, name) => {
    //TODO: Implementar endpoint de ativação no backend.
    
    const secretaryId = selectedLotations[userId];
    if (!secretaryId) {
      let errorMessage = { type: 'error', text: `Por favor, selecione uma secretaria para ${name} antes de aprovar.` };
      setMessage(errorMessage);
      return;
    }
    try {
      const res = await approveUserAccount(userId, secretaryId);
      if (res.ok) {
        let successMessage = { type: 'success', text: `Conta de ${name} aprovada com sucesso.` };
        setMessage(successMessage);
        // Atualiza a lista de contas pendentes após aprovar
        loadData();
      } else {
        let errorMessage = { type: 'error', text: `Erro ao aprovar conta de ${name}.` };
        setMessage(errorMessage);
        throw new Error('Erro ao aprovar conta.');
      }
    } catch (error) {
      let errorMessage = { type: 'error', text: `Erro ao aprovar conta de ${name}.` };
      setMessage(errorMessage);
      throw new Error(`Erro ao aprovar conta de ${name}: ` + error.message);
    }

  };

  const rejectAccount = async (userId, name) => {
    try {
      const res = await rejectUserAccount(userId);
      if (res.ok) {
        let successMessage = { type: 'success', text: `Conta de ${name} rejeitada com sucesso.` };
        setMessage(successMessage);
        // Atualiza a lista de contas pendentes após rejeitar
        loadData();
      } else {
        let errorMessage = { type: 'error', text: `Erro ao rejeitar conta de ${name}.` };
        setMessage(errorMessage);
        throw new Error('Erro ao rejeitar conta.');
      }
    } catch (error) {
      let errorMessage = { type: 'error', text: `Erro ao rejeitar conta de ${name}: ` };
      setMessage(errorMessage);
      throw new Error(`Erro ao rejeitar conta de ${name}: ` + error.message);
    }
  };

  return (
    <div className="validation-accounts-container">
      
      <Header message="Validação de Novas Contas." />
      
      {pendingAccounts.length === 0 && (
        <div className="warning-message">
          <p>Não há novos cadastros aguardando validação no momento.</p>
        </div>
      )}
      
      {/*Div para mostrar mensagens de sucesso ou erro*/}
      {message && (
        <div className={`${message.type}-message`}>
          <p>{message.text}</p>
        </div>
      )}

      {pendingAccounts.length > 0 && (

        <table style={{ width: '100%', paddingTop: '20px' }}>
          <thead>
            <tr>
              <th>Nome Completo</th>
              <th>Matrícula</th>
              <th>E-mail</th>
              <th>Definir Lotação (Secretaria)</th>
              <th style={{ textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pendingAccounts.map(user => (
              <tr className="validation-accounts-item"  style={{ height: '50px' }} key={user.id}>
                <td style={{ paddingLeft: '15px' }}><strong>{user.name}</strong></td>
                <td>{user.registration_number}</td>
                <td style={{ textAlign: 'center' }}>{user.email}</td>
                <td style={{ textAlign: 'center' }}>
                  <select
                    className="validation-accounts-select"
                    value={selectedLotations[user.id] || ''}
                    onChange={(e) => handleChangeLotation(user.id, e.target.value)}
                  >
                    <option value="">Selecione a Secretaria...</option>
                    {secretaries.map(sec => (
                      <option key={sec.id} value={sec.id}>
                        {sec.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                  <div className="validation-accounts-actions">
                    <button
                      className="validation-accounts-btn icon-btn"
                      title="Aprovar"
                      aria-label="Aprovar"
                      onClick={() => activateAccount(user.id, user.name)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M5 13.5L10 18L19 7" stroke="#388e3c" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="validation-accounts-btn icon-btn"
                      title="Rejeitar"
                      aria-label="Rejeitar"
                      onClick={() => rejectAccount(user.id, user.name)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M7 7L17 17M17 7L7 17" stroke="#d32f2f" strokeWidth="2.2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {/*pendingAccounts.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                  <p className='warning-message'>Não há novos cadastros aguardando validação no momento.</p>
                </td>
              </tr>
            )*/}
          </tbody>
        </table>
      )}
    </div>
  );
}