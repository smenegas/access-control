// Helper functions to interact with the network folders API
import { getToken, isTokenExpired, refreshTokenRequest } from '../authentication';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';
const FOLDERS_ENDPOINT = `${API_URL}/network-folders/network-folders`;

// Get the list of network folders
export const getFolders = async () => {
	const token = getToken();
    if (!token) {
        throw new Error('Usuário não autenticado');
    }
    //Try to refresh the token if it is expired
    if (isTokenExpired(token)) {
        try {
            const data = await refreshTokenRequest();
            token = data.accessToken;
        } catch (err) {
            throw new Error('Usuário não autenticado');
        }
    }
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    try {
        const response = await fetch(`${FOLDERS_ENDPOINT}`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao carregar pastas de rede.');
        }
        return response;
    } catch (error) {
        throw error;
    }
};

export const createFolder = async (folderData) => {
	//Delete the id property from the folderData object if it exists
    delete folderData.id;
    
    const token = getToken();
    if (!token) {
        throw new Error('Usuário não autenticado');
    }
    //Try to refresh the token if it is expired
    if (isTokenExpired(token)) {
        try {
            const data = await refreshTokenRequest();
            token = data.accessToken;
        } catch (err) {
            throw new Error('Usuário não autenticado');
        }
    };
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(folderData),
    };
    try {
        const response = await fetch(`${FOLDERS_ENDPOINT}`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(response.statusText || 'Erro ao criar pasta de rede.');
        }
        return data.id[0];
    } catch (error) {
        throw error;
    }
};
// Update an existing network folder
export const updateFolder = async (folderId, folderData) => {
	const token = getToken();
    if (!token) {
        throw new Error('Usuário não autenticado');
    }
    //Try to refresh the token if it is expired
    if (isTokenExpired(token)) {
        try {
            const data = await refreshTokenRequest();
            token = data.accessToken;
        } catch (err) {
            throw new Error('Usuário não autenticado');
        }
    };
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(folderData),
    };
    
    try {
        const response = await fetch(`${FOLDERS_ENDPOINT}/${folderId}`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao atualizar pasta de rede.');
        }
        return data;
    } catch (error) {
        throw error;
    }
};

// Delete a network folder
export const deleteFolder = async (folderId) => {
	const token = getToken();
    if (!token) {
        throw new Error('Usuário não autenticado');
    }
    //Try to refresh the token if it is expired
    if (isTokenExpired(token)) {
        try {
            const data = await refreshTokenRequest();
            token = data.accessToken;
        } catch (err) {
            throw new Error('Usuário não autenticado');
        }
    };
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    try {
        const response = await fetch(`${FOLDERS_ENDPOINT}/${folderId}`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao excluir pasta de rede.');
        }
        return data;
    } catch (error) {
        throw error;
    }
};
