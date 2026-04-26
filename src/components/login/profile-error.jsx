import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../autentication.css'; // Reaproveitando os estilos do layout de cartão

export default function ProfileError() {
    const navigate = useNavigate();
  // Função para limpar os dados da sessão e deslogar com segurança
  const handleSair = () => {
    sessionStorage.removeItem('@AppAcessos:token');
    sessionStorage.removeItem('@AppAcessos:user');
    navigate('/');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card" style={{ textAlign: 'center', maxWidth: '450px' }}>
        
        {/* Ícone de bloqueio/atenção */}
        <div style={{ fontSize: '50px', marginBottom: '15px' }}>🔒</div>
        
        <h2 style={{ color: '#c53030', margin: '0 0 10px 0', fontSize: '24px' }}>
          Acesso Restrito
        </h2>
        
        <p style={{ color: '#4a5568', lineHeight: '1.5', marginBottom: '20px', fontSize: '15px' }}>
          Sua autenticação foi realizada com sucesso, mas a sua conta <strong>não possui um perfil de acesso válido</strong> configurado no sistema.
        </p>

        {/* Caixa de orientação reutilizando a classe erro-mensagem que já temos no CSS */}
        <div className="erro-mensagem" style={{ 
            marginBottom: '25px', 
            textAlign: 'left', 
            backgroundColor: '#fffaf0', // Fundo levemente alaranjado/amarelado
            borderColor: '#feebc8',
            color: '#c05621'
          }}>
          <strong>Como resolver?</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '13px' }}>
            Entre em contato com o Departamento de TI da Prefeitura e informe sobre o erro.
          </p>
        </div>

        <button 
          onClick={handleSair} 
          className="btn-primario" 
          style={{ width: '100%', backgroundColor: '#4a5568', boxShadow: 'none' }}
        >
          Sair e Voltar ao Login
        </button>

      </div>
    </div>
  );
}