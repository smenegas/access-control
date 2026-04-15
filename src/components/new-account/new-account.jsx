import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../autentication.css'; // Reutilizando os estilos de autenticação

export default function NewAccount({ aoVoltarLogin }) {
  const [formData, setFormData] = useState({
    nome: '', cpf: '', email: '', senha: '', secretaria_id: ''
  });
  const [secretarias, setSecretarias] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();

  useEffect(() => {
    // Busca as secretarias simuladas ou da API
    fetch('/api/secretarias')
      .then(res => res.json())
      .then(setSecretarias)
      .catch(() => {
        // Fallback temporário caso a API não esteja rodando no teste
        setSecretarias([
          { id: 1, nome: 'Secretaria de Administração' },
          { id: 2, nome: 'Secretaria da Fazenda' },
          { id: 3, nome: 'Secretaria de Saúde' }
        ]);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setMensagem({ 
          texto: 'Cadastro realizado com sucesso! Solicite à sua chefia a liberação do acesso.', 
          tipo: 'sucesso' 
        });
        // Aguarda 3 segundos e volta para o login automaticamente
        setTimeout(() => aoVoltarLogin(), 3000);
      } else {
        const data = await response.json();
        setMensagem({ texto: data.error || 'Erro ao realizar cadastro.', tipo: 'erro' });
      }
    } catch (error) {
      setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
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

        {mensagem.texto && (
          <div className={mensagem.tipo === 'erro' ? 'erro-mensagem' : 'sucesso-mensagem'}>
            {mensagem.texto}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label htmlFor="nome">Nome Completo</label>
            <input 
              id="nome" type="text" placeholder="Ex: João da Silva" required
              className="login-input"
              onChange={e => setFormData({...formData, nome: e.target.value})} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="input-group">
              <label htmlFor="cpf">CPF</label>
              <input 
                id="cpf" type="text" placeholder="000.000.000-00" required
                className="login-input"
                onChange={e => setFormData({...formData, cpf: e.target.value})} 
              />
            </div>

            <div className="input-group">
              <label htmlFor="senha">Criar Senha</label>
              <input 
                id="senha" type="password" placeholder="••••••••" required
                className="login-input"
                onChange={e => setFormData({...formData, senha: e.target.value})} 
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail Institucional</label>
            <input 
              id="email" type="email" placeholder="nome@canela.rs.gov.br" required
              className="login-input"
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          
          <div className="input-group">
            <label htmlFor="secretaria">Secretaria de Lotação</label>
            <select 
              id="secretaria" required 
              className="login-input select-input"
              onChange={e => setFormData({...formData, secretaria_id: e.target.value})}
            >
              <option value="">Selecione sua secretaria...</option>
              {secretarias.map(sec => (
                <option key={sec.id} value={sec.id}>{sec.nome}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primario btn-login" style={{ marginTop: '10px' }}>
            Enviar Solicitação
          </button>
        </form>

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