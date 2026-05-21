import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../helpers/users/users';
import { LoadingOverlay } from '../../helpers/loader/loader';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import '../autentication.css'; // Reutilizando os estilos de autenticação

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
  const SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
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

          <div style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.6 : 1 }}>
            <HCaptcha
              sitekey={SITE_KEY}
              onVerify={(captchaToken) => setFormData({...formData, hcaptchaToken: captchaToken})}
              onExpire={() => setCaptchaToken(null)}
              ref={captchaRef}
            />
          </div>

          <button type="submit" className="btn-primario btn-login" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Solicitação'}
          </button>
        </form>
      
        <LoadingOverlay loading={loading} />

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