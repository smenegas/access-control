import React, { useState, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { getToken, logout } from '../../helpers/authentication';
import { fetchUserByToken, updateUserProfile, changeUserPassword } from '../../helpers/users/users';
import { getSecretaryById } from '../../helpers/secretaries/secretaries';
import '../autentication.css'; // Reaproveitando nosso padrão visual

export default function EditAccount() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    registration_number: '', // Apenas para exibição
    secretary_acronym: '' // Apenas para exibição
  });
  
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [carregando, setCarregando] = useState(true);
  const [user, setUser] = useState(null);

  // Pega o token da sessão
  //const getToken = () => sessionStorage.getItem('@AppAcessos:token');

  const handleTurnBack = () => {
    if(!user) {
      logout();
      navigate('/login');
      return;
    }

    switch (user.profile) {
      case 1: // Comon User
        navigate('/dashboard');
        break;
      case 2: // Secretary
        navigate('/secretary-dashboard');
        break;
      default:
        navigate('/pending-requests');
        break;
    }
  };

  useEffect(() => {
    // Busca os dados atuais do perfil no back-end
    const loadProfile = async () => {
        try {
            const res = await fetchUserByToken();
            if (res.ok) {
                const data = await res.json();
                setUser(data);

                // Busca o nome da secretaria usando o ID
                if (data.secretary_id) {
                    try {
                        const secRes = await getSecretaryById(data.secretary_id);
                        if (secRes.ok) {
                            const secData = await secRes.json();
                            data.secretary_acronym = secData.acronym; // Adiciona o nome da secretaria aos dados do usuário
                        } else {
                            data.secretary_acronym = 'Secretaria Desconocida';
                        }
                    } catch {
                        data.secretary_acronym = 'Secretaria Desconocida';
                    }
                } else {
                    data.secretary_acronym = 'Sem Lotação';
                }
                setFormData(prev => ({ 
                    ...prev, 
                    name: data.name, 
                    email: data.email,
                    registration_number: data.registration_number,
                    secretary_acronym: data.secretary_acronym
                }));
            } else {
                setMensagem({ texto: 'Erro ao carregar os dados do perfil.', tipo: 'erro' });
            }
        } catch (error) {
            setMensagem({ texto: 'Erro ao carregar os dados do perfil.', tipo: 'erro' });
        } finally {
            setCarregando(false);
        }
    };

    loadProfile();
  }, []);

  //TODO: Fazer a rotina separa a altração de dados da alteração de senha.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem({ texto: '', tipo: '' });

    // Validação simples de senha
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMensagem({ texto: 'As novas senhas não coincidem.', tipo: 'erro' });
      return;
    }

    let updates = {
      name: formData.name,
      email: formData.email
    };

    try {
      // Atualiza o perfil do usuário
      const res = await updateUserProfile(updates);
      if(!res.ok) {
        const data = await res.json();
        setMensagem({ texto: data.error || 'Erro ao atualizar o perfil.', tipo: 'erro' });
        return;
      }
      
      // Se o usuário preencheu um nova senha, ferifica se os campos newPassword e confirmPassword estão preenchidos e são iguais, e então chama a função de alteração de senha
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setMensagem({ texto: 'As novas senhas não coincidem.', tipo: 'erro' });
          return;
        }
        const passwordRes = await changeUserPassword(formData.newPassword);
        if (!passwordRes.ok) {
          const data = await passwordRes.json();
          setMensagem({ texto: data.error || 'Erro ao alterar a senha.', tipo: 'erro' });
          return;
        }
      }
      if (res.ok) {
        setMensagem({ texto: 'Perfil atualizado com sucesso!', tipo: 'sucesso' });
        
        // Limpa os campos de senha após salvar
        setFormData(prev => ({ ...prev, newPassword: '', confirmPassword: '' }));
      } else {
        const data = await res.json();
        setMensagem({ texto: data.error || 'Erro ao atualizar o perfil.', tipo: 'erro' });
      }

    } catch (error) {
      setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
    }
  };

  if (carregando) return <div style={{ textAlign: 'center', padding: '50px' }}>Carregando dados...</div>;

  return (
    <div className="login-page-wrapper">
      <div className="login-card" style={{ maxWidth: '500px' }}>
        
        <div className="login-header">
          <div className="logo-placeholder">👤</div>
          <h2>Meu Perfil</h2>
          <p>Gerencie as informações da sua conta</p>
        </div>

        {mensagem.texto && (
          <div className={mensagem.tipo === 'erro' ? 'erro-mensagem' : 'sucesso-mensagem'}>
            {mensagem.texto}
          </div>
        )}
        
        <form className="login-form" onSubmit={handleSubmit}>
          
          {/* Campos Bloqueados (Informativos) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="input-group">
              <label>Matrícula</label>
              <input 
                type="text" 
                value={formData.registration_number} 
                className="login-input" 
                disabled 
                style={{ backgroundColor: '#edf2f7', color: '#a0aec0', cursor: 'not-allowed' }}
              />
            </div>
            <div className="input-group">
              <label>Lotação</label>
              <input 
                type="text" 
                value={formData.secretary_acronym} 
                className="login-input" 
                disabled 
                style={{ backgroundColor: '#edf2f7', color: '#a0aec0', cursor: 'not-allowed' }}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="name">Nome de Exibição</label>
            <input 
              id="name" type="text" required
              className="login-input"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail Institucional</label>
            <input 
              id="email" type="email" required
              className="login-input"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          
          {/* Alteração de Senha (Opcional) */}
          <div className="input-group">
            <label htmlFor="newPassword">Nova Senha (deixe em branco para manter a atual)</label>
            <input 
              id="newPassword" type="password" 
              className="login-input"
              value={formData.newPassword}
              onChange={e => setFormData({...formData, newPassword: e.target.value})} 
            />
          </div>

          {formData.newPassword && (
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
              <input 
                id="confirmPassword" type="password" required
                className="login-input"
                value={formData.confirmPassword}
                onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
              />
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn-secundario" style={{ flex: 1 }} onClick={handleTurnBack}>
              Cancelar / Voltar
            </button>
            <button type="submit" className="btn-primario btn-login" style={{ flex: 1, marginTop: 0 }}>
              Salvar Alterações
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}