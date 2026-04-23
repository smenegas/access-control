import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../../helpers/authentication';
import './claimant-dashboard.css'; // Importando o arquivo de estilos

function ClaimantDashboard({ aoIniciarNovaSolicitacao }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  // Dados simulados (Mock) para o histórico do usuário
  const [solicitacoes] = useState([
    {
      id: 'REQ-2026-0042',
      data: '05/04/2026',
      secretaria: 'Secretaria da Fazenda',
      status: 'Aprovada na Chefia',
      classeStatus: 'status-aprovada',
      realizacao: 'Totalmente Realizado', // Novo campo
      classeRealizacao: 'impl-total'      // Nova classe de cor
    },
    {
      id: 'REQ-2026-0045',
      data: '06/04/2026',
      secretaria: 'Secretaria de Administração',
      status: 'Pendente - Aguardando Secretário',
      classeStatus: 'status-pendente',
      realizacao: 'Aguardando',
      classeRealizacao: 'impl-aguardando'
    },
    {
      id: 'REQ-2026-0040',
      data: '02/04/2026',
      secretaria: 'Secretaria de Saúde',
      status: 'Aprovada na Chefia',
      classeStatus: 'status-aprovada',
      realizacao: 'Realizado Com Ressalvas',
      classeRealizacao: 'impl-ressalvas'
    },
    {
      id: 'REQ-2026-0048',
      data: '07/04/2026',
      secretaria: 'Secretaria de Obras',
      status: 'Rejeitada',
      classeStatus: 'status-rejeitada',
      realizacao: 'Aguardando', // Se foi rejeitada, a TI não executa
      classeRealizacao: 'impl-aguardando'
    }
  ]);

  return (
    <div className="dashboard-container">
      {/* Cabeçalho */}
      <header className="dashboard-header">
        <div>
          <div>
            <h1 className="dashboard-header-title">Portal de Acessos - Prefeitura de Canela</h1>
            <p>Bem-vindo(a)! Gerencie suas solicitações de pastas e sistemas.</p>
          </div>
        </div>
        <div className="usuario-info">
          <span className="avatar">{(user?.name || user?.nome || 'Usuário').charAt(0).toUpperCase()}</span>
          <button
            type="button"
            className="usuario-nome"
            onClick={() => setMenuAberto((prev) => !prev)}
          >
            {user?.name || user?.nome || 'Usuário'}
          </button>
          {menuAberto && (
            <div className="user-menu">
              <button type="button" className="menu-item">Minha Conta</button>
              {user?.profile > 2 && (
                <button type="button" className="menu-item" onClick={handleAdminPanel}>Painel Administrativo</button>
              )}
              <button type="button" className="menu-item" onClick={handleLogout}>Sair</button>
            </div>
          )}
        </div>
      </header>

      {/* Cartões de Resumo (Indicadores) */}
      <div className="cards-container">
        <div className="card">
          <h3>Total Solicitado</h3>
          <p className="card-valor">12</p>
        </div>
        <div className="card">
          <h3>Aguardando Aprovação</h3>
          <p className="card-valor pendente">1</p>
        </div>
        <div className="card">
          <h3>Aprovadas na TI</h3>
          <p className="card-valor aprovada">10</p>
        </div>
      </div>

      {/* Ação Principal e Tabela */}
      <div className="conteudo-principal">
        <div className="cabecalho-lista">
          <h2>Minhas Solicitações Recentes</h2>
          <button 
            className="btn-primario" 
            onClick={aoIniciarNovaSolicitacao}
          >
            + Nova Solicitação
          </button>
        </div>

        <div className="tabela-container">
          <table className="tabela-solicitacoes">
            <thead>
              <tr>
                <th>Protocolo</th>
                <th>Data</th>
                <th>Secretaria Vinculada</th>
                <th>Status (Gestor)</th>
                <th>Status (TI)</th> {/* Coluna solicitada */}
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {solicitacoes.map((req) => (
                <tr key={req.id}>
                  <td><strong>{req.id}</strong></td>
                  <td>{req.data}</td>
                  <td>{req.secretaria}</td>
                  <td>
                    {/* Distintivo de Status (Gestor) - arredondado */}
                    <span className={`badge ${req.classeStatus}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>
                    {/* Novo Distintivo de Realização (TI) - arredondado e com cores específicas */}
                    <span className={`badge-impl ${req.classeRealizacao}`}>
                      {req.realizacao}
                    </span>
                  </td>
                  <td>
                    <button className="btn-secundario">Ver Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClaimantDashboard;