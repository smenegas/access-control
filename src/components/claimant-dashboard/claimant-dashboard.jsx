import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../../helpers/authentication';
import Header from '../common/header';
import '../common/dashboards.css';

function ClaimantDashboard() {
  const [protocolFilter, setProtocolFilter] = useState('');
  const [secretaryFilter, setSecretaryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');
  const [initialDate, setInitialDate] = useState('');
  const [finalDate, setFinalDate] = useState('');
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const handleNewRequest = () => {
    navigate('/new-access-requisition');
  };

  const convertRequestData = (data) => {
    const [dia, mes, ano] = data.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
  };

  // Dados simulados (Mock) para o histórico do usuário
  const [requests] = useState([
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

  const filteredRequests = requests.filter((req) => {
    const correspondsProtocol = req.id.toLowerCase().includes(protocolFilter.toLowerCase());
    const correspondsSecretary = !secretaryFilter || req.secretaria === secretaryFilter;
    const correspondsStatus = !statusFilter || req.classeStatus === statusFilter;
    const requestData = convertRequestData(req.data);
    const toDay = new Date();
    toDay.setHours(0, 0, 0, 0);
    let minDate = null;
    let maxDate = null;

    if (periodFilter === 'hoje') {
      minDate = toDay;
      maxDate = toDay;
    } else if (periodFilter === 'ultima-semana') {
      minDate = new Date(toDay);
      minDate.setDate(toDay.getDate() - 6);
      maxDate = toDay;
    } else if (periodFilter === 'ultimo-mes') {
      minDate = new Date(toDay);
      minDate.setDate(toDay.getDate() - 29);
      maxDate = toDay;
    } else if (periodFilter === 'personalizado') {
      minDate = initialDate ? new Date(`${initialDate}T00:00:00`) : null;
      maxDate = finalDate ? new Date(`${finalDate}T00:00:00`) : null;
    }

    const correspondsPeriod = (!minDate || requestData >= minDate)
      && (!maxDate || requestData <= maxDate);

    return correspondsProtocol && correspondsSecretary && correspondsStatus && correspondsPeriod;
  });

  return (
    <div className="dashboard-container">
      {/* Cabeçalho */}
      
      <Header message="Bem-vindo(a)! Gerencie suas solicitações de pastas e sistemas." />

      <div className="filtros-container">
        <div className="filtro-campo filtro-protocolo">
          <label htmlFor="filtro-protocolo">Protocolo</label>
          <input
            id="filtro-protocolo"
            type="search"
            placeholder="Buscar protocolo"
            value={protocolFilter}
            onChange={(event) => setProtocolFilter(event.target.value)}
          />
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-secretaria">Secretaria</label>
          <select
            id="filtro-secretaria"
            value={secretaryFilter}
            onChange={(event) => setSecretaryFilter(event.target.value)}
          >
            <option value="">Todas as secretarias</option>
            <option value="Secretaria da Fazenda">Secretaria da Fazenda</option>
            <option value="Secretaria de Administração">Secretaria de Administração</option>
            <option value="Secretaria de Saúde">Secretaria de Saúde</option>
            <option value="Secretaria de Obras">Secretaria de Obras</option>
          </select>
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-status">Status</label>
          <select
            id="filtro-status"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">Todos os status</option>
            <option value="status-aprovada">Aprovada</option>
            <option value="status-pendente">Pendente</option>
            <option value="status-rejeitada">Rejeitada</option>
          </select>
        </div>
        <div className="filtro-campo filtro-periodo">
          <label htmlFor="filtro-periodo">Período</label>
          <select
            id="filtro-periodo"
            value={periodFilter}
            onChange={(event) => setPeriodFilter(event.target.value)}
          >
            <option value="">Todos os períodos</option>
            <option value="hoje">Hoje</option>
            <option value="ultima-semana">Última semana</option>
            <option value="ultimo-mes">Último mês</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>
        {periodFilter === 'personalizado' && (
          <div className="filtro-datas">
            <div className="filtro-campo">
              <label htmlFor="data-inicial">Data inicial</label>
              <input
                id="data-inicial"
                type="date"
                value={initialDate}
                onChange={(event) => setInitialDate(event.target.value)}
              />
            </div>
            <div className="filtro-campo">
              <label htmlFor="data-final">Data final</label>
              <input
                id="data-final"
                type="date"
                value={finalDate}
                onChange={(event) => setFinalDate(event.target.value)}
              />
            </div>
          </div>
        )}
      </div>

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
        <div className="card">
          <h3>Rejeitadas</h3>
          <p className="card-valor rejeitada">1</p>
        </div>
      </div>

      {/* Ação Principal e Tabela */}
      <div className="conteudo-principal">
        <div className="cabecalho-lista">
          <h2>Minhas Solicitações Recentes</h2>
          <button 
            className="btn-primario" 
            onClick={handleNewRequest}
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
              {filteredRequests.map((req) => (
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