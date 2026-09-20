import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUser } from '../../helpers/authentication';
import Header from '../common/header';
import '../common/dashboards.css';

function ClaimantDashboard({ aoIniciarNovaSolicitacao }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [filtroProtocolo, setFiltroProtocolo] = useState('');
  const [filtroSecretaria, setFiltroSecretaria] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [filtroPeriodo, setFiltroPeriodo] = useState('');
  const [dataInicial, setDataInicial] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAdminPanel = () => {
    navigate('/admin');
  };

  const converterDataSolicitacao = (data) => {
    const [dia, mes, ano] = data.split('/').map(Number);
    return new Date(ano, mes - 1, dia);
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

  const solicitacoesFiltradas = solicitacoes.filter((req) => {
    const correspondeProtocolo = req.id.toLowerCase().includes(filtroProtocolo.toLowerCase());
    const correspondeSecretaria = !filtroSecretaria || req.secretaria === filtroSecretaria;
    const correspondeStatus = !filtroStatus || req.classeStatus === filtroStatus;
    const dataSolicitacao = converterDataSolicitacao(req.data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    let dataMinima = null;
    let dataMaxima = null;

    if (filtroPeriodo === 'hoje') {
      dataMinima = hoje;
      dataMaxima = hoje;
    } else if (filtroPeriodo === 'ultima-semana') {
      dataMinima = new Date(hoje);
      dataMinima.setDate(hoje.getDate() - 6);
      dataMaxima = hoje;
    } else if (filtroPeriodo === 'ultimo-mes') {
      dataMinima = new Date(hoje);
      dataMinima.setDate(hoje.getDate() - 29);
      dataMaxima = hoje;
    } else if (filtroPeriodo === 'personalizado') {
      dataMinima = dataInicial ? new Date(`${dataInicial}T00:00:00`) : null;
      dataMaxima = dataFinal ? new Date(`${dataFinal}T00:00:00`) : null;
    }

    const correspondePeriodo = (!dataMinima || dataSolicitacao >= dataMinima)
      && (!dataMaxima || dataSolicitacao <= dataMaxima);

    return correspondeProtocolo && correspondeSecretaria && correspondeStatus && correspondePeriodo;
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
            value={filtroProtocolo}
            onChange={(event) => setFiltroProtocolo(event.target.value)}
          />
        </div>
        <div className="filtro-campo">
          <label htmlFor="filtro-secretaria">Secretaria</label>
          <select
            id="filtro-secretaria"
            value={filtroSecretaria}
            onChange={(event) => setFiltroSecretaria(event.target.value)}
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
            value={filtroStatus}
            onChange={(event) => setFiltroStatus(event.target.value)}
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
            value={filtroPeriodo}
            onChange={(event) => setFiltroPeriodo(event.target.value)}
          >
            <option value="">Todos os períodos</option>
            <option value="hoje">Hoje</option>
            <option value="ultima-semana">Última semana</option>
            <option value="ultimo-mes">Último mês</option>
            <option value="personalizado">Personalizado</option>
          </select>
        </div>
        {filtroPeriodo === 'personalizado' && (
          <div className="filtro-datas">
            <div className="filtro-campo">
              <label htmlFor="data-inicial">Data inicial</label>
              <input
                id="data-inicial"
                type="date"
                value={dataInicial}
                onChange={(event) => setDataInicial(event.target.value)}
              />
            </div>
            <div className="filtro-campo">
              <label htmlFor="data-final">Data final</label>
              <input
                id="data-final"
                type="date"
                value={dataFinal}
                onChange={(event) => setDataFinal(event.target.value)}
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
              {solicitacoesFiltradas.map((req) => (
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