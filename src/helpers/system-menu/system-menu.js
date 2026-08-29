import { getToken, isTokenExpired, refreshTokenRequest } from '../authentication/authentication';

// Add a new menu item to the system menu
export const AddMenuItem = async ( formData ) => {
    const token = getToken();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';
    const data = { ...formData }; // Create a copy of formData to avoid mutating the original object
    data.id = null; // Ensure the id is null for new items
    if (data.father_menu_id === '') {
        data.father_menu_id = null; // Set to null if it's an empty string
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    };

    if (!token) {
        throw new Error('Usuário não autenticado');
    }

    if (isTokenExpired(token)) {
        // Tentar renovar o token
        try {
            const data = await refreshTokenRequest();
            requestOptions.headers['Authorization'] = `Bearer ${data.accessToken}`;
        } catch (err) {
            throw new Error(err);
        }
    }

    try {
        const response = await fetch(`${API_URL}/system-menus/menu-item`, requestOptions);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData?.message || 'Erro ao adicionar item de menu.');
        }

        return responseData?.id ?? responseData?.data?.id ?? responseData?.menu?.id ?? null;
    } catch (error) {
        throw new Error(error.message || 'Erro ao adicionar item de menu.');
    }
};

// Load the menu tree from the API
export const LoadMenuTree = async () => {
    const token = getToken();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    };

    if (!token) {
        throw new Error('Usuário não autenticado');
    }

    if (isTokenExpired(token)) {
        // Tentar renovar o token
        try {
            const data = await refreshTokenRequest();
            requestOptions.headers['Authorization'] = `Bearer ${data.accessToken}`;
        } catch (err) {
            throw new Error(err);
        }
    }

    try {
        const response = await fetch(`${API_URL}/system-menus/menu-tree`, requestOptions);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData?.message || 'Erro ao carregar árvore de menu.');
        }
        return responseData;
    } catch (error) {
        throw new Error(error.message || 'Erro ao carregar árvore de menu.');
    }
};

// Update an existing menu item in the system menu
export const UpdateMenuItem = async ( formData ) => {
    const token = getToken();
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';
    const data = { ...formData }; // Create a copy of formData to avoid mutating the original object
    if (data.father_menu_id === '') {
        data.father_menu_id = null; // Set to null if it's an empty string
    }
    const requestOptions = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    };

    if (!token) {
        throw new Error('Usuário não autenticado');
    }

    if (isTokenExpired(token)) {
        // Tentar renovar o token
        try {
            const data = await refreshTokenRequest();
            requestOptions.headers['Authorization'] = `Bearer ${data.accessToken}`;
        } catch (err) {
            throw new Error(err);
        }
    }

    try {
        const response = await fetch(`${API_URL}/system-menus/menu-item/${formData.id}`, requestOptions);
        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData?.message || 'Erro ao atualizar item de menu.');
        }

        return responseData;
    } catch (error) {
        throw new Error(error.message || 'Erro ao atualizar item de menu.');
    }
};