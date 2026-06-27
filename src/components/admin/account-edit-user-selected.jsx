import React, { useState, useEffect } from "react";

import { getSecretaries } from "../../helpers/secretaries/secretaries";
import { updateUserAccountByAdmin } from "../../helpers/users/users";

import "./account-edit.css";

//Componente para exibir os detalhes de um usuário selecionado e permitir edição
const AccountEditUserSelected = ({ userEdit, cancel, updateUserList }) => {
  
  const [selectedUser, setSelectedUser] = useState(userEdit); //Recebe o usuário selecionado como prop
  const [msg, setMsg] = useState(null);
  const [secretary, setSecretary] = useState(selectedUser.secretary_id);
  const [secretaries, setSecretaries] = useState([])

  useEffect ( () => {

    setMsg(null);
    getSecretariesList();

  }, []);

  //Get the secretaries list
  const getSecretariesList = async () => {
    let resp = null;
    try {
      resp = await getSecretaries()
      if (resp == null){
        setMsg({ type: 'msg', text: 'Erro ao carregar lista de secretarias' });
        return;
      }
      setMsg(null);
      setSecretaries(resp);
    }
    catch(e){
      setMsg({ type: 'msg', text: e.message })
    }
  }
  
  const handleSaveUpdates = async (event) => {
    event.preventDefault();
    let resp = null;
    try{
      resp = await updateUserAccountByAdmin(selectedUser);
      if(!resp.ok || resp == null){
        setMsg({ text: "Ocorreu um erro ao atualizar os dados do usuário.", type: "msg" });
        throw new msg("Ocorreu um erro ao atualizar os dados do usuário.");
      }
      setMsg({ text: "Usuário atualizado com sucesso.", type: "success" });
      updateUserList();
    }
    catch(e){
      setMsg({ text: "Ocorreu um erro ao atualizar os dados do usuário." , type: "msg"});
      throw new msg(e.message);
    }
  }

  return (
      <>
      <div className="account-edit-root">
        <div>
          <div className="cabecalho-lista">
            <h2>Editar Dados das Contas Existentes</h2>
          </div>
        </div>
      </div>
      {msg && 
        <div className={ msg.type === 'msg' ? 'alert alert-danger' : 'alert alert-success' }>
          <p>{ msg.text }</p>
        </div>
      }
      <div id="secao-edicao-usuario" className="card account-edit-card">
        <div className="card-header">
          <h3>Editar Dados da Conta: {selectedUser.name}</h3>
        </div>

        <form onSubmit={ handleSaveUpdates } className="login-form">
          <div className="edit-form-grid">
            
            <div className="input-group">
              <label htmlFor="edit-reg-number">Matrícula</label>
              <input 
                id="edit-reg-number" type="text" required className="login-input"
                value={selectedUser.registration_number}
                onChange={e => setSelectedUser({...selectedUser, registration_number: e.target.value})}
              />
            </div>
            
            <div className="input-group">
              <label htmlFor="edit-nome">Nome Completo</label>
              <input 
                id="edit-nome" type="text" required className="login-input"
                value={selectedUser.name}
                onChange={e => setSelectedUser({...selectedUser, name: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label htmlFor="edit-email">E-mail Institucional</label>
              <input 
                id="edit-email" type="email" required className="login-input"
                value={selectedUser.email}
                onChange={e => setSelectedUser({...selectedUser, email: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label htmlFor="edit-perfil">Perfil de Sistema</label>
              <select 
                id="edit-perfil" required className="login-input select-input"
                onChange={e => setSelectedUser({...selectedUser, profile: e.target.value})}
                value = {selectedUser.profile}
              >
                <option value="1">Requerente (Servidor Comum)</option>
                <option value="2">Secretário</option>
                <option value="3">TI (Administrador do Sistema)</option>
              </select>
            </div>

            <div className="input-group">
              <label htmlFor="edit-secretaria">Secretaria de Lotação</label>
              <select 
                id="secretary-edit" required className="login-input select-input"
                value={secretary}
                onChange={e => setSelectedUser({...selectedUser, secretary_id: e.target.value})}
              >
                <option 
                  value="">Selecione uma secretaria...</option>
                {secretaries.map(sec => (
                  <option key={sec.id} value={sec.id}>{sec.name}</option>
                ))}
              </select>
            </div>

          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn-secundario" 
              onClick={cancel}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primario" 
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
      </>
)};

export default AccountEditUserSelected;