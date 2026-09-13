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
import SecretaryManagement from './secretary/secretary-management';
import AdminInstructions from './AdminInstructions';
import AccountEdit from "./account/account-edit";
import AccountMangement from './account/account-management';
import { AccountActivate } from "./account/account-activate";
import { AccountDisable } from "./account/account-disable";
import { AccountValidate } from "./account/account-validate";
import { ResetPassword } from "./account/reset-password";
import SystemMenuManagement from "./system-menu/system-menu-management";
import FoldersManagement from "./folders/folders-management";

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
        case 'pastas': return <FoldersManagement />;
        case 'modulos': return (<SystemMenuManagement />);
        case 'usuarios': return (
        <div>
            {activeUserSubmenu === 'cadastrar' && <AccountMangement />}
            {activeUserSubmenu === 'editar' && <AccountEdit />}
            {activeUserSubmenu === 'ativar' && <AccountActivate />}
            {activeUserSubmenu === 'inativar' && <AccountDisable />}
            {activeUserSubmenu === 'validar' && <AccountValidate />}
            {activeUserSubmenu === 'redefinir' && (<ResetPassword />)}
        </div>
        );
        default: return (
        <AdminInstructions user={null} />
        );
    }
}