import React, { useState, useEffect } from 'react';

export default function SecretaryManagement() {
  const [secretarias, setSecretarias] = useState([]);
  const [nomeNovaSec, setNomeNovaSec] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEdicao, setNomeEdicao] = useState('');

  // Carregar dados iniciais
  useEffect(() => {
    buscarSecretarias();
  }, []);

  const buscarSecretarias = async () => {
    const token = sessionStorage.getItem('@AppAcessos:token');
    const res = await fetch('/api/admin/secretarias', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) setSecretarias(await res.json());
  };

  // Cadastrar
  const adicionarSecretaria = async (e) => {
    e.preventDefault();
    if (!nomeNovaSec.trim()) return;

    const token = sessionStorage.getItem('@AppAcessos:token');
    const res = await fetch('/api/admin/secretarias', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome: nomeNovaSec })
    });

    if (res.ok) {
      setNomeNovaSec('');
      buscarSecretarias();
    }
  };

  // Salvar Edição
  const salvarEdicao = async (id) => {
    const token = sessionStorage.getItem('@AppAcessos:token');
    const res = await fetch(`/api/admin/secretarias/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nome: nomeEdicao })
    });

    if (res.ok) {
      setEditandoId(null);
      buscarSecretarias();
    }
  };

  // Excluir
  const deletarSecretaria = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta secretaria?')) return;

    const token = sessionStorage.getItem('@AppAcessos:token');
    const res = await fetch(`/api/admin/secretarias/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      buscarSecretarias();
    } else {
      const error = await res.json();
      alert(error.error);
    }
  };

  return (
    <div className="crud-container">
      <h2>Gestão de Secretarias</h2>
      
      {/* Formulário de Adição */}
      <form onSubmit={adicionarSecretaria} className="form-adicionar">
        <input 
          type="text" 
          placeholder="Nome da nova secretaria" 
          value={nomeNovaSec} 
          onChange={(e) => setNomeNovaSec(e.target.value)} 
          className="login-input"
        />
        <button type="submit" className="btn-primario">Adicionar</button>
      </form>

      {/* Tabela de Dados */}
      <table className="tabela-solicitacoes">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome da Secretaria</th>
            <th style={{ width: '150px' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {secretarias.map(sec => (
            <tr key={sec.id}>
              <td>{sec.id}</td>
              <td>
                {editandoId === sec.id ? (
                  <input 
                    type="text" 
                    value={nomeEdicao} 
                    onChange={(e) => setNomeEdicao(e.target.value)} 
                    className="login-input"
                    style={{ padding: '5px' }}
                  />
                ) : (
                  sec.nome
                )}
              </td>
              <td style={{ display: 'flex', gap: '5px' }}>
                {editandoId === sec.id ? (
                  <>
                    <button className="btn-secundario" onClick={() => salvarEdicao(sec.id)}>Salvar</button>
                    <button className="btn-secundario" onClick={() => setEditandoId(null)}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button className="btn-secundario" onClick={() => { setEditandoId(sec.id); setNomeEdicao(sec.nome); }}>Editar</button>
                    <button className="btn-secundario" style={{ color: 'red', borderColor: 'red' }} onClick={() => deletarSecretaria(sec.id)}>Excluir</button>
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