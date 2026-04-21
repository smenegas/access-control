import React from 'react';

export default function AdminInstructions({ user }) {
  return (
    <div className="instruções-container">
      <h2>Bem-vindo, {user?.name || user?.nome || 'Admin'} ao Painel Administrativo</h2>
      {/* <h3>Bem-vindo, {user?.name || user?.nome || 'Admin'}!</h3> */}
      <p>Escolha uma das opções no menu lateral para gerenciar os recursos do sistema.</p>
      <ul>
        <li><strong>🏛️ Secretarias:</strong> Gerencie as secretarias da prefeitura.</li>
        <li><strong>📁 Pastas de Rede:</strong> Controle o acesso às pastas compartilhadas.</li>
        <li><strong>🖥️ Sistemas e Menus:</strong> Configure módulos e menus do sistema.</li>
        <li><strong>👥 Usuários:</strong> Administre usuários e permissões.</li>
      </ul>
    </div>
  );
}
