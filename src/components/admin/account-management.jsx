import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../helpers/users/users';
import { LoadingOverlay } from '../common/loader/loader';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import './account-management.css';
import { getSecretaries } from '../../helpers/secretaries/secretaries';

export default function AccountMangement({ aoVoltarLogin }) {
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    email: '',
    password: '',
    secretary_id: '',
    profile: '1',
    hcaptchaToken: null
  });
  const SITE_KEY = import.meta.env.VITE_HCAPTCHA_SITE_KEY;
  const [captchaToken, setCaptchaToken] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });
  const captchaRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [secretaries, setSecretaries] = useState([]);

  useEffect(() => {
    const loadSecretaries = async () => {
      try {
        const res = await getSecretaries();
        if (Array.isArray(res)) setSecretaries(res);
        else if (res.ok) {
          const data = await res.json();
          setSecretaries(data);
        }
      } catch (err) {
        // falha silenciosa — lista pode permanecer vazia
      }
    };
    loadSecretaries();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    try {
      await registerUser(formData);
      setMessage({ text: 'Cadastro realizado com sucesso! Solicite ao TI a liberação do acesso.', type: 'sucesso' });
      setTimeout(() => navigate('/admin'), 3000);
    } catch (error) {
      if (error.message && error.message.includes('Captcha')) {
        setMessage({ text: 'Por favor, complete o captcha para continuar.', type: 'erro' });
      } else if (error.message && error.message.includes('Duplicate')) {
        setMessage({ text: 'Já existe um usuário cadastrado com os dados fornecidos.', type: 'erro' });
      } else {
        setMessage({ text: error.message || 'Erro ao realizar cadastro.', type: 'erro' });
      }
    } finally {
      if (captchaRef.current && captchaRef.current.resetCaptcha) captchaRef.current.resetCaptcha();
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card" style={{ maxWidth: '560px' }}>
        <div className="login-header">
          <div className="logo-placeholder">📝</div>
          <h2>Cadastro de Novo Servidor</h2>
          <p>Cadastro de novo servidor com acesso ao sistema</p>
        </div>

        {message.text && (
          <div className={message.type === 'erro' ? 'erro-mensagem' : 'sucesso-mensagem'}>
            {message.text}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Nome Completo</label>
            <input id="name" type="text" placeholder="Ex: João da Silva" required className="login-input"
              onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={loading} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="input-group">
              <label htmlFor="registration_number">Matrícula</label>
              <input id="registration_number" type="text" placeholder="000000" required className="login-input"
                onChange={e => setFormData({ ...formData, registration_number: e.target.value })} disabled={loading} />
            </div>

            <div className="input-group">
              <label htmlFor="password">Criar Senha</label>
              <input id="password" type="password" placeholder="••••••••" required className="login-input"
                onChange={e => setFormData({ ...formData, password: e.target.value })} disabled={loading} />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail Institucional</label>
            <input id="email" type="email" placeholder="nome@canela.rs.gov.br" required className="login-input"
              onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={loading} />
          </div>

          <div className="input-group">
            <label htmlFor="secretary">Lotação / Secretaria</label>
            <select id="secretary" required className="login-input" value={formData.secretary_id}
              onChange={e => setFormData({ ...formData, secretary_id: e.target.value })} disabled={loading}>
              <option value="">Selecione a Secretaria...</option>
              {secretaries.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-primario btn-login" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Cadastro'}
          </button>
        </form>
        <LoadingOverlay loading={loading} />
      </div>
    </div>
  );
}
