import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import './login.css'; // Importando o arquivo de estilos
import '../autentication.css'; // Importando o arquivo de estilos

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    navigate('/dashboard'); // Simula um login bem-sucedido redirecionando para o dashboard
    //TODO: Utilizar o código comentado abaixo para realizar a autenticação real com o backend. Por enquanto, vamos simular um login bem-sucedido para facilitar o desenvolvimento do dashboard.
    /*e.preventDefault();
    setErro('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });

      const data = await response.json();

      if (response.ok) {
        // Salva o token no Session Storage (some se fechar a aba)
        sessionStorage.setItem('@AppAcessos:token', data.token);
        sessionStorage.setItem('@AppAcessos:user', JSON.stringify(data.usuario));
        
        aoLogarComSucesso(data.usuario);
      } else {
        setErro(data.error);
      }
    } catch (error) {
      setErro('Erro ao conectar com o servidor.');
    }*/
  };

  const handleNewAccount = () => {
    navigate('/new-account');
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        
        <div className="login-header">
          {/* Espaço para o brasão ou logo da Prefeitura */}
          <div className="logo-placeholder">🏛️</div>
          <h2>Portal de Acessos</h2>
          <p>Prefeitura Municipal de Canela</p>
        </div>

        {erro && <div className="erro-mensagem">{erro}</div>}
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="email">E-mail Institucional</label>
            <input 
              id="email"
              type="email" 
              placeholder="nome@canela.rs.gov.br" 
              required
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              className="login-input"
            />
          </div>

          <div className="input-group">
            <label htmlFor="senha">Senha</label>
            <input 
              id="senha"
              type="password" 
              placeholder="••••••••" 
              required
              value={senha} 
              onChange={e => setSenha(e.target.value)} 
              className="login-input"
            />
          </div>

          <button type="submit" className="btn-primario btn-login">
            Entrar no Sistema
          </button>
        </form>

        <div className="login-divider">
          <span>ou</span>
        </div>

        <div className="login-footer">
          <p>Ainda não possui acesso?</p>
          <button onClick={handleNewAccount} className="btn-registro">
            Cadastre uma nova conta
          </button>
        </div>

      </div>
    </div>
  );
}