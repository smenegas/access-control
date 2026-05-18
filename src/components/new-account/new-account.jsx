import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../helpers/users/users';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import '../autentication.css'; // Reutilizando os estilos de autenticação

//TODO: Terminar a implementação deste componente.
export default function NewAccount({ aoVoltarLogin }) {
  const [formData, setFormData] = useState(
    {
      name: '', 
      registration_number: '', 
      email: '', 
      password: '', 
      secretary_id: '3', //Definindo secretaria padrão para evitar erro de campo obrigatório. O ideal seria mostrar a lista de secretarias para o usuário escolher, mas isso pode ser implementado depois. Por enquanto, a maioria dos usuários é da secretaria de saúde, então vamos deixar essa como padrão.
      profile: '1',
      hcaptchaToken: null
    }
);
  const TEST_SITE_KEY = import.meta.env.VITE_HCAPTCHA_TEST_SITE_KEY;
  const [captchaToken, setCaptchaToken] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      await registerUser(formData);
      setMessage({ 
        text: 'Cadastro realizado com sucesso! Solicite ao TI a liberação do acesso.', 
        type: 'sucesso' 
      });
      // Aguarda 5 segundos e volta para o login automaticamente
      setTimeout(() => returnToLogin(), 5000);
    } catch (error) {
      setMessage({ text: error.message || 'Erro ao realizar cadastro.', type: 'erro' });
    } finally {
      setLoading(false);
    }
  };

  const returnToLogin = () => {
    navigate('/');
  }

  return (
    <div className="login-page-wrapper">
      <div className="login-card" style={{ maxWidth: '500px' }}> {/* Um pouco mais largo para acomodar o formulário maior */}
        
        <div className="login-header">
          <div className="logo-placeholder">📝</div>
          <h2>Novo Servidor</h2>
          <p>Solicitação de criação de conta de acesso</p>
        </div>

        {message.text && (
          <div className={message.type === 'erro' ? 'erro-mensagem' : 'sucesso-mensagem'}>
            {message.text}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label htmlFor="name">Nome Completo</label>
            <input 
              id="name" type="text" placeholder="Ex: João da Silva" required
              className="login-input"
              onChange={e => setFormData({...formData, name: e.target.value})} 
              disabled={loading}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="input-group">
              <label htmlFor="registration_number">Matrícula</label>
              <input 
                id="registration_number" type="text" placeholder="000000" required
                className="login-input"
                onChange={e => setFormData({...formData, registration_number: e.target.value})} 
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Criar Senha</label>
              <input 
                id="password" type="password" placeholder="••••••••" required
                className="login-input"
                onChange={e => setFormData({...formData, password: e.target.value})} 
                disabled={loading}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail Institucional</label>
            <input 
              id="email" type="email" placeholder="nome@canela.rs.gov.br" required
              className="login-input"
              onChange={e => setFormData({...formData, email: e.target.value})} 
              disabled={loading}
            />
          </div>
          
          {/*<div className="input-group">
            <label htmlFor="secretary_id">Secretaria de Lotação</label>
            <select 
              id="secretary_id" required 
              className="login-input select-input"
              onChange={e => setFormData({...formData, secretary_id: e.target.value})}
            >
              <option value="">Selecione sua secretaria...</option>
              {secretaries.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>*/}

          <div style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}>
            <HCaptcha
              sitekey={TEST_SITE_KEY}
              onVerify={(captchaToken) => setFormData({...formData, hcaptchaToken: captchaToken})}
              onExpire={() => setCaptchaToken(null)}
              ref={captchaRef}
            />
          </div>

          <button type="submit" className="btn-primario btn-login" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>
        {/*
          //TODO: Implmentar um componente de loading mais bonito e reutilizável para usar em toda a aplicação. Por enquanto, isso aqui quebra um galho.
        */}
        {loading && (
          <div style={{position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.25)', zIndex: 9999}} aria-live="polite">
            <div style={{background: 'rgba(255,255,255,0.95)', padding: 20, borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
              <svg width="56" height="56" viewBox="0 0 50 50" aria-hidden="true">
                <circle cx="25" cy="25" r="20" stroke="#e6e6e6" strokeWidth="5" fill="none" />
                <path fill="#1d4ed8" d="M25 5 A20 20 0 0 1 45 25 L40 25 A15 15 0 0 0 25 10z">
                  <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite" />
                </path>
              </svg>
              <div style={{fontSize: 14, color: '#1f2937'}}>Aguardando resposta do servidor...</div>
            </div>
          </div>
        )}

        <div className="login-divider">
          <span>já possui conta?</span>
        </div>

        <div className="login-footer">
          <button onClick={returnToLogin} className="btn-registro">
            Voltar para a tela de Login
          </button>
        </div>

      </div>
    </div>
  );
}