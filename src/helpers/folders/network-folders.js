// Helper functions to interact with the network folders API
import { getToken, isTokenExpired, refreshTokenRequest } from '../authentication';

// Get the list of network folders
export const getFolders = async () => {
	const token = getToken();
    if (!token) {
        //Try to refresh the token if it is expired
        if (isTokenExpired(token)) {
            try {
                const data = await refreshTokenRequest();
                token = data.accessToken;
            } catch (err) {
                throw new Error('Usuário não autenticado');
            }
        } else {
            throw new Error('Usuário não autenticado');
        }
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    try {
        const response = await fetch(`${API_URL}/folders`, requestOptions);
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
	const token = getToken();
    if (!token) {
        //Try to refresh the token if it is expired
        if (isTokenExpired(token)) {
            try {
                const data = await refreshTokenRequest();
                token = data.accessToken;
            } catch (err) {
                throw new Error('Usuário não autenticado');
            }
        } else {
            throw new Error('Usuário não autenticado');
        }
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(folderData),
    };
    try {
        const response = await fetch(`${API_URL}/folders`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao criar pasta de rede.');
        }
        return data;
    } catch (error) {
        throw error;
    }
};
// Update an existing network folder
export const updateFolder = async (folderId, folderData) => {
	const token = getToken();
    if (!token) {
        //Try to refresh the token if it is expired
        if (isTokenExpired(token)) {
            try {
                const data = await refreshTokenRequest();
                token = data.accessToken;
            } catch (err) {
                throw new Error('Usuário não autenticado');
            }
        } else {
            throw new Error('Usuário não autenticado');
        }
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(folderData),
    };
    
    try {
        const response = await fetch(`${API_URL}/folders/${folderId}`, requestOptions);
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
        //Try to refresh the token if it is expired
        if (isTokenExpired(token)) {
            try {
                const data = await refreshTokenRequest();
                token = data.accessToken;
            } catch (err) {
                throw new Error('Usuário não autenticado');
            }
        } else {
            throw new Error('Usuário não autenticado');
        }
    }
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';
    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };
    try {
        const response = await fetch(`${API_URL}/folders/${folderId}`, requestOptions);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data?.message || 'Erro ao excluir pasta de rede.');
        }
        return data;
    } catch (error) {
        throw error;
    }
};
