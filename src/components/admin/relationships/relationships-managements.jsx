import React, { useEffect, useState } from 'react';
import {
  createRelationship,
  deleteRelationship,
  getRelationships,
  updateRelationship
} from '../../../helpers/relationships/relationships';

import '../../common/messages.css';

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

export default function RelationshipsManagements() {
  const [relationships, setRelationships] = useState([]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMessage, setEditMessage] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    fetchRelationships();
  }, []);

  const fetchRelationships = async () => {
    try {
      const data = await getRelationships();
      if (!Array.isArray(data)) {
        throw new Error('A lista de vínculos retornada é inválida.');
      }
      setRelationships(data);
    } catch (error) {
      setMessage(error.message || 'Erro ao carregar vínculos.');
      setMessageType('erro');
    }
  };

  const handleAddRelationship = async (event) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) {
      setMessage('O nome do vínculo não pode ser vazio.');
      setMessageType('erro');
      return;
    }

    try {
      await createRelationship({ name, message: newMessage.trim() });
      setNewName('');
      setNewMessage('');
      setMessage('Vínculo adicionado com sucesso!');
      setMessageType('sucesso');
      await fetchRelationships();
    } catch (error) {
      setMessage(error.message || 'Erro ao adicionar vínculo.');
      setMessageType('erro');
    }
  };

  const handleUpdateRelationship = async (id) => {
    const name = editName.trim();
    if (!name) {
      setMessage('O nome do vínculo não pode ser vazio.');
      setMessageType('erro');
      return;
    }

    try {
      await updateRelationship(id, { name, message: editMessage.trim() });
      setEditingId(null);
      setMessage('Vínculo editado com sucesso!');
      setMessageType('sucesso');
      await fetchRelationships();
    } catch (error) {
      setMessage(error.message || 'Erro ao editar vínculo.');
      setMessageType('erro');
    }
  };

  const handleDeleteRelationship = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este vínculo?')) {
      return;
    }

    try {
      await deleteRelationship(id);
      setMessage('Vínculo excluído com sucesso!');
      setMessageType('sucesso');
      await fetchRelationships();
    } catch (error) {
      setMessage(error.message || 'Erro ao excluir vínculo.');
      setMessageType('erro');
    }
  };

  return (
    <div className="relationships-management-container">
      <h2>Gestão de Tipos de Vínculos</h2>

      {message && (
        <div
          className={messageType === 'sucesso' ? 'success-message' : 'error-message'}
          style={{ marginBottom: 16 }}
          role="status"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleAddRelationship} className="form-adicionar relationships-add-form">
        <input
          type="text"
          placeholder="Nome do novo vínculo"
          aria-label="Nome do novo vínculo"
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          className="login-input"
        />
        <textarea
          placeholder="Mensagem"
          aria-label="Mensagem do vínculo"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          className="login-input"
          rows={3}
          style={{ resize: 'vertical' }}
        />
        <button type="submit" className="btn-primario">Adicionar</button>
      </form>

      <table className="tabela-solicitacoes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome do vínculo</th>
            <th>Mensagem</th>
            <th style={{ width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {relationships.length === 0 ? (
            <tr>
              <td colSpan="4">Nenhum vínculo cadastrado.</td>
            </tr>
          ) : relationships.map((relationship) => (
            <tr key={relationship.id}>
              <td style={{ width: 50 }}>{relationship.id}</td>
              <td>
                {editingId === relationship.id ? (
                  <input
                    type="text"
                    aria-label={`Nome do vínculo ${relationship.id}`}
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    className="login-input"
                    style={{ padding: '5px' }}
                  />
                ) : (
                  relationship.name
                )}
              </td>
              <td>
                {editingId === relationship.id ? (
                  <textarea
                    aria-label={`Mensagem do vínculo ${relationship.name}`}
                    value={editMessage}
                    onChange={(event) => setEditMessage(event.target.value)}
                    className="login-input"
                    rows={3}
                    style={{ padding: '5px', resize: 'vertical' }}
                  />
                ) : (
                  relationship.message || ''
                )}
              </td>
              <td style={{ width: 150, whiteSpace: 'nowrap' }}>
                {editingId === relationship.id ? (
                  <>
                    <button
                      type="button"
                      className="btn-secundario"
                      onClick={() => handleUpdateRelationship(relationship.id)}
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      className="btn-secundario"
                      onClick={() => setEditingId(null)}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-secundario"
                      title="Editar"
                      aria-label={`Editar vínculo ${relationship.name}`}
                      style={{ background: 'none', border: 'none', padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onClick={() => {
                        setEditingId(relationship.id);
                        setEditName(relationship.name);
                        setEditMessage(relationship.message || '');
                      }}
                    >
                      <EditIcon />
                    </button>
                    <button
                      type="button"
                      className="btn-secundario"
                      title="Excluir"
                      aria-label={`Excluir vínculo ${relationship.name}`}
                      style={{ background: 'none', border: 'none', padding: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      onClick={() => handleDeleteRelationship(relationship.id)}
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
