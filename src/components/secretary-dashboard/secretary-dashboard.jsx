import React, { useState } from 'react';
import Header from '../common/header';
import '../common/dashboards.css'; // Reutilizando a mesma base de estilos
import './secretary-dashboard.css'; // Estilos específicos para o dashboard do secretário

export default function SecretaryDashboard() {
  // Mock: Solicitações de acesso aguardando a canetada do Secretário
  const [solicitacoesPendentes] = useState([
    {
      id: 'REQ-2026-0050',
      servidor: 'Maria Oliveira',
      data: '24/04/2026',
      resumo: 'Pastas de Rede (RH) e Sistema de Folha',
      status: 'Aguardando sua Aprovação',
      classeStatus: 'status-pendente'
    },
    {
      id: 'REQ-2026-0051',
      servidor: 'Carlos Souza',
      data: '25/04/2026',
      resumo: 'Sistema de Compras (Módulo Licitações)',
      status: 'Aguardando sua Aprovação',
      classeStatus: 'status-pendente'
    }
  ]);

  return (
    <div className="dashboard-container">
      {/* Cabeçalho do Gestor */}
      <Header message="Bem-vindo(a), Secretário(a)! Gerencie as solicitações de acesso pendentes." />

      {/* Cartões de Resumo (Indicadores) */}
      <div className="cards-container">
        <div className="card" style={{ borderColor: '#f39c12' }}>
          <h3>Acessos Pendentes</h3>
          <p className="card-valor pendente">{solicitacoesPendentes.length}</p>
        </div>
        <div className="card">
          <h3>Aprovados no Mês</h3>
          <p className="card-valor aprovada">28</p>
        </div>
      </div>

      <div className="conteudo-principal">

        {/* Solicitações de Acesso aos Sistemas */}
        <div>
          <div className="cabecalho-lista">
            <h2>Solicitações de Acesso Pendentes</h2>
          </div>

          <div className="tabela-container">
            <table className="tabela-solicitacoes">
              <thead>
                <tr>
                  <th>Protocolo</th>
                  <th>Servidor Solicitante</th>
                  <th>Resumo do Pedido</th>
                  <th>Data</th>
                  <th>Status</th>
                  <th>Análise</th>
                </tr>
              </thead>
              <tbody>
                {solicitacoesPendentes.map((req) => (
                  <tr key={req.id}>
                    <td><strong>{req.id}</strong></td>
                    <td>{req.servidor}</td>
                    <td>{req.resumo}</td>
                    <td>{req.data}</td>
                    <td>
                      <span className={`badge ${req.classeStatus}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-primario" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        Analisar Pedido
                      </button>
                    </td>
                  </tr>
                ))}
                {solicitacoesPendentes.length === 0 && (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                      Nenhuma solicitação pendente no momento. Excelente trabalho!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}