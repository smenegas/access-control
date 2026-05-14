import { getAuthHeaders, getToken, setSession, getUser, getUserFromToken, isTokenExpired, refreshTokenRequest } from "../authentication/authentication";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';

export async function fetchUserByToken() {
  let token = getToken();
  if (!token) return null;

  // Verifica se o token está expirado e tenta renovar
  if (isTokenExpired(token)) {
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error('Token expirado. Usuário deve reautenticar.');
    }
  }

  //Get user id from token
  const user = getUserFromToken(token);
  if (!user) return null;

  try {
    const fetchUser = await fetch(`${API_BASE_URL}/users/${user.id}`, {
      headers: getAuthHeaders()
    });
    return fetchUser;
  } catch (error) {
    throw new Error('Erro ao buscar usuário: ' + error.message);
  }
}

// Nova função para atualizar o perfil do usuário
export async function updateUserProfile(updates) {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  // Verifica se o token está expirado e tenta renovar
  if (isTokenExpired(token)) {
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }

  const response = await fetch(`${API_BASE_URL}/users/${getUser().id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify(updates)
  });

  if (!response.ok) {
    
    throw new Error('Erro ao atualizar perfil.');
  }
  const data = await response.json();
  // Atualiza o usuário armazenado na sessão
  const updatedUser = { ...getUser(), ...data };
  setSession(getToken(), updatedUser);
  return response;
};

// Função para alterar a senha do usuário
export async function changeUserPassword(newPassword) {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  // Verifica se o token está expirado e tenta renovar
  if (isTokenExpired(token)) {
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }
  // Faz a requisição para alterar a senha
  const response = await fetch(`${API_BASE_URL}/users/${getUser().id}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ password: newPassword })
  });

  if (!response.ok) {
    throw new Error('Erro ao alterar senha.');
  }
  return response;
}