import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  logout, 
  getUser, 
  getToken,
  isAuthenticated, 
  isTokenExpired, 
  refreshTokenRequest 
} from '../../helpers/authentication';
import SecretaryManagement from './secretary-management';
import AdminInstructions from './AdminInstructions';
import AccountEdit from "./account-edit";
import AccountMangement from './account-management';
import { AccountActivate } from "./account-activate";
import { AccountDisable } from "./account-disable";
import { AccountValidate } from "./account-validate";

export default function AdminMain({ activeTab, activeUserSubmenu, user }) {
    
    const navigate = useNavigate();

    const logout = () => {
        navigate('/');
    };

    const ensureAuthenticated = async () => {
        if(isTokenExpired(getToken())) {
            try {
                await refreshTokenRequest();
            } catch (error) {
                return false;
            }
        }

        if (!isAuthenticated()) {
            return false;
        }
        return true;
    };

    if (!ensureAuthenticated()) {
        logout();
        return null;
    }
    
    switch (activeTab) {
        case 'home': return (
        <AdminInstructions user={user} />
        );
        case 'secretarias': return <SecretaryManagement />;
        case 'pastas': return <div>Gestão de Pastas de Rede (Em construção)</div>;
        case 'modulos': return <div>Gestão de Módulos e Menus (Em construção)</div>;
        case 'usuarios': return (
        <div>
            {activeUserSubmenu === 'cadastrar' && <AccountMangement />}
            {activeUserSubmenu === 'editar' && <AccountEdit />}
            {activeUserSubmenu === 'ativar' && <AccountActivate />}
            {activeUserSubmenu === 'inativar' && <AccountDisable />}
            {activeUserSubmenu === 'validar' && <AccountValidate />}
            {activeUserSubmenu === 'redefinir' && (
            <div>
                <h3>Redefinir Senha</h3>
                <p>Ferramenta para redefinir a senha de usuários (em construção).</p>
            </div>
            )}
        </div>
        );
        default: return (
        <AdminInstructions user={null} />
        );
    }
}