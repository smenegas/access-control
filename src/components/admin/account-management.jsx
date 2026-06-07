import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminRegisterUser } from '../../helpers/users/users';
import { LoadingOverlay } from '../common/loader/loader';
import './account-management.css';
import { getSecretaries } from '../../helpers/secretaries/secretaries';

export default function AccountMangement({ aoVoltarLogin }) {
  
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    email: '',
    password: '',
    secretary_id: '',
    profile: '1', // 1 = Comum, 2 = Gestor, 3 = Admin
    account_status: 1 // 0 = Pendente, 1 = Ativa, 2 = Inativa
  });
  
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
        setSecretaries([]);
        setMessage({ text: 'Não foi possível carregar as secretarias.', type: 'erro' });
      }
    };
    loadSecretaries();
  }, []);

  const clearFields = () => {
    setFormData({
      name: '',
      registration_number: '',
      email: '',
      password: '',
      secretary_id: '',
      profile: '1',
      account_status: 1
    });
    setMessage({ text: '', type: '' });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    setLoading(true);

    if (formData.name.trim() === '') {
      setMessage({ text: 'O campo nome é obrigatório.', type: 'erro' });
      setLoading(false);
      return;
    }

    if (formData.registration_number.trim() === '') {
      setMessage({ text: 'O campo matrícula é obrigatório.', type: 'erro' });
      setLoading(false);
      return;
    }

    if (formData.email.trim() === '') {
      setMessage({ text: 'O campo e-mail é obrigatório.', type: 'erro' });
      setLoading(false);
      return;
    }

    if (formData.password.trim() === '') {
      setMessage({ text: 'O campo senha é obrigatório.', type: 'erro' });
      setLoading(false);
      return;
    }

    if (formData.secretary_id === '') {
      setMessage({ text: 'Por favor, selecione uma secretaria.', type: 'erro' });
      setLoading(false);
      return;
    }

    if (formData.profile === '') {
      setMessage({ text: 'Por favor, selecione um perfil para o usuário.', type: 'erro' });
      setLoading(false);
      return;
    }

    try {
      await adminRegisterUser(formData);
      setMessage({ text: 'Cadastro realizado com sucesso!', type: 'sucesso' });
      setTimeout(() => {
        clearFields();
      }, 3000);
    } catch (error) {
      if (error.message && error.message.includes('Duplicate')) {
        setMessage({ text: 'Já existe um usuário cadastrado com os dados fornecidos.', type: 'erro' });
      } else if (error.message && error.message.includes('Unauthorized')) {
        setMessage({ text: 'Erro: ' + ('Acesso não autorizado.'), type: 'erro' });
      } else {
        setMessage({ text: 'Erro de conexão com o servidor.', type: 'erro' });
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
            <input 
              id="name" 
              type="text" 
              placeholder="Ex: João da Silva" 
              required 
              className="login-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })} disabled={loading} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="input-group">
              <label htmlFor="registration_number">Matrícula</label>
              <input 
                id="registration_number" 
                type="text" placeholder="Somente Números" 
                required 
                className="login-input"
                value={formData.registration_number}
                onChange={e => setFormData({ ...formData, registration_number: e.target.value })} disabled={loading} 
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Criar Senha</label>
              <input 
                id="password" 
                type="password" 
                required 
                className="login-input"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })} disabled={loading} 
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail Institucional</label>
            <input 
              id="email" 
              type="email" 
              placeholder="nome@canela.rs.gov.br" 
              required 
              className="login-input"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })} disabled={loading} 
            />
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
          <div className="input-group">
            <label htmlFor="profile">Perfil do Usuário</label>
            <select id="profile" required className="login-input" value={formData.profile}
              onChange={e => setFormData({ ...formData, profile: e.target.value })} disabled={loading}>
              <option value="1">Comum</option>
              <option value="2">Gestor</option>
              <option value="3">Administrador</option>
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
