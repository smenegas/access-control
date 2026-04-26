import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, logout } from '../../helpers/authentication';
import ProfileError from './profile-error';
import '../autentication.css'; // Importando o arquivo de estilos

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [erro, setErro] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');

    try {
      const loginData = await login({ email, password });
      if(loginData.user.profile === 3) {
        navigate('/pending-requests', { state: { user: loginData.user } });
        return;
      }
      if(loginData.user.profile === 2) {
        navigate('/secretary-dashboard');
        return;
      }
      if(loginData.user.profile === 1) {
        navigate('/dashboard');
        return;
      }
      // Se o perfil do usuário não for reconhecido, desloga e mostra a tela de erro de perfil
      logout();
      navigate('/profile-error');

    } catch (error) {
      setErro(error.message || 'Erro ao conectar com o servidor.');
    }
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
            <label htmlFor="password">Senha</label>
            <input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              required
              value={password} 
              onChange={e => setPassword(e.target.value)} 
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