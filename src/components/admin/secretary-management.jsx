import React, { useState, useEffect, act } from 'react';
import { 
  getSecretaries, 
  updateSecretary, 
  deleteSecretary,
  createSecretary
} from '../../helpers/secretaries/secretaries';

import '../common/messages.css';


// Ícones SVG inline para editar e excluir
function EditIcon({ title = 'Editar' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label={title} role="img">
      <title>{title}</title>
      <path d="M14.85 2.85a1.2 1.2 0 0 1 1.7 1.7l-9.2 9.2-2.1.4.4-2.1 9.2-9.2zM3 17h14v2H3v-2z" fill="#2563eb"/>
    </svg>
  );
}

function DeleteIcon({ title = 'Excluir' }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-label={title} role="img">
      <title>{title}</title>
      <path d="M6 7v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V7m-9 0h10m-7-3h4a1 1 0 0 1 1 1v1H6V5a1 1 0 0 1 1-1z" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function SecretaryManagement() {
  const [secretaries, setSecretaries] = useState([]);
  const [newSecName, setNewSecName] = useState('');
  const [newSecAcronym, setNewSecAcronym] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'sucesso' ou 'erro'


  // Carregar dados iniciais
  useEffect(() => {
    fetchSecretaries();
  }, []);

  const fetchSecretaries = async () => {
    try {
      const data = await getSecretaries();
      setSecretaries(data);
    } catch (error) {
      setMessage('Erro ao carregar secretarias.');
      setMessageType('erro');
    }
  };

  // Cadastrar
  const handleAddSecretary = async (e) => {
    e.preventDefault();
    if (!newSecName.trim()) {
      setMessage('O nome da secretaria não pode ser vazio.');
      setMessageType('erro');
      return;
    }

    if (!newSecAcronym.trim()) {
      setMessage('A sigla da secretaria não pode ser vazia.');
      setMessageType('erro');
      return;
    }

    try {
      const res = await createSecretary({ name: newSecName, acronym: newSecAcronym });
      if (res.ok) {
        setNewSecName('');
        setNewSecAcronym('');
        setMessage('Secretaria adicionada com sucesso!');
        setMessageType('sucesso');
        fetchSecretaries();
      } else {
        const error = await res.json();
        setMessage(error.error || 'Erro ao adicionar secretaria.');
        setMessageType('erro');
      }

    }
    catch (error) {
      setMessage('Erro ao adicionar secretaria.');
      setMessageType('erro');
    }
  };

  // Atualizar
  const handleUpdateSecretary = async (id) => {
    try {
      const res = await updateSecretary(id, { name: editName, acronym: newSecAcronym });
      if (res.ok) {
        setUpdatingId(null);
        setMessage('Secretaria editada com sucesso!');
        setMessageType('sucesso');
        fetchSecretaries();
      } else {
        const error = await res.json();
        setMessage(error.error || 'Erro ao adicionar secretaria.');
        setMessageType('erro');
      }
    } catch (error) {
      setMessage('Erro ao editar secretaria.');
      setMessageType('erro');
    }
  };

  // Excluir
  const handleDeleteSecretary = async (id, event) => {
    if (event) event.preventDefault();
    if (window.confirm('Tem certeza que deseja excluir esta secretaria?')) {
      try {
        const res = await deleteSecretary(id);
        if (res.ok) {
          setMessage('Secretaria excluída com sucesso!');
          setMessageType('sucesso');
          fetchSecretaries();
        } else {
          setMessage('Erro ao excluir secretaria.');
          setMessageType('erro');
        }
      } catch (error) {
        setMessage('Erro ao excluir secretaria.');
        setMessageType('erro');
      }
    }
  };

  return (
    <div className="crud-container">
      <h2>Gestão de Secretarias</h2>

      {/* Mensagens de erro e sucesso */}
      {message && (
        <div className={messageType === 'sucesso' ? 'success-message' : 'error-message'} style={{ marginBottom: 16 }}>
          {message}
        </div>
      )}

      {/* Formulário de Adição */}
      <form onSubmit={handleAddSecretary} className="form-adicionar">
        <input 
          type="text" 
          placeholder="Nome da nova secretaria" 
          value={newSecName} 
          onChange={(e) => setNewSecName(e.target.value)} 
          className="login-input"
        />
        <input
          type="text"
          placeholder="Sigla"
          value={newSecAcronym}
          onChange={e => setNewSecAcronym(e.target.value)}
          className="login-input"
          style={{ width: 80 }}
  />
        <button type="submit" className="btn-primario">Adicionar</button>
      </form>

      {/* Tabela de Dados */}
      <table className="tabela-solicitacoes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome da Secretaria</th>
            <th>Sigla</th>
            <th style={{ width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {secretaries.map(sec => (
            <tr key={sec.id}>
              <td>{sec.id}</td>
              <td style={{width: 150}}>
                {updatingId === sec.id ? (
                  <input
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)} 
                    className="login-input"
                    style={{ padding: '5px' }}
                  />
                  
                ) : (
                  sec.name
                )}
              </td>
              <td style={{width: 50}}>
                {updatingId === sec.id ? (
                  <input
                    type="text"
                    value={newSecAcronym}
                    onChange={e => setNewSecAcronym(e.target.value)}
                    className="login-input"
                    style={{ padding: '5px' }}
                  />
                ) : (
                  sec.acronym
                )}
              </td>
              <td>
                {updatingId === sec.id ? (
                  <>
                    <button className="btn-secundario" onClick={() => handleUpdateSecretary(sec.id)}>Salvar</button>
                    <button className="btn-secundario" onClick={() => setUpdatingId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="btn-secundario"
                      title="Editar"
                      aria-label="Editar"
                      style={{ background: 'none', border: 'none', padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onClick={() => { setUpdatingId(sec.id); setEditName(sec.name); setNewSecAcronym(sec.acronym); }}
                    >
                      <EditIcon />
                    </button>
                    <button
                      className="btn-secundario"
                      title="Excluir"
                      aria-label="Excluir"
                      style={{ background: 'none', border: 'none', padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onClick={(e) => handleDeleteSecretary(sec.id, e)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}