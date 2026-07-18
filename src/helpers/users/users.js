import { getAuthHeaders, getToken, setSession, getUser, getUserFromToken, isTokenExpired, refreshTokenRequest } from "../authentication/authentication";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';

//Fucão para carregar constas e usuários (apenas para admin)
export async function fetchAllUsers() {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  // Verifica se o token está expirado e tenta renovar
  if (isTokenExpired(token)) {
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error('Token expirado. Usuário deve reautenticar.');
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}/users/`, {
      headers: getAuthHeaders()
    });
    return res;
  } catch (error) {
    throw new Error('Erro ao buscar usuários: ' + error.message);
  }
};

//Function to disable a user account (only for admin)
export const disableUserAccount = async (userId) => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  // Verifica se o token está expirado e tenta renovar
  if (isTokenExpired(token)) {
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error('Token expirado. Usuário deve reautenticar.');
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/disable`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return res;
  } catch (error) {
    throw new Error('Erro ao desativar conta: ' + error.message);
  }
};

//Função para cadastrar um novo usuário (servidor)
export async function registerUser(userData) {
  try {
    const response = await fetch(`${API_BASE_URL}/public/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao realizar cadastro.');
    }
    return response;
  } catch (error) {
    throw new Error('Erro de conexão com o servidor: ' + error.message);
  }
};

export async function adminRegisterUser(userData) {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  // Verifica se o token está expirado e tenta renovar
  if (isTokenExpired(token)) {
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error('Token expirado. Usuário deve reautenticar.');
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Erro ao realizar cadastro.');
    }
    return response;
  } catch (error) {
    throw new Error('Erro de conexão com o servidor: ' + error.message);
  }
};

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
//Essa função deve ser usada quano o prório usuário que está logado tenta atualizar seu perfil.
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

//Função para atualizar contas de usuários via painel administrativo
export const updateUserAccountByAdmin = async (updates) => {
  //TODO: Criar a lódgica para atualizar contas de usuário quando disponível na API.
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  //Verifica se o token está expirado e tenta renovar
  if (isTokenExpired(token)){
    try{
      const data = await refreshTokenRequest();
      token = data.accsessToken;
    }
    catch (err) {
      throw new Error(err);
    }
  }

  //Tenta realizar a atualização do cadastro de usuário
  const response = await fetch(`${API_BASE_URL}/users/${updates.id}`, {
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
  return response;
};


// Função para alterar a senha do usuário logado (apenas para o próprio usuário)
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

  // Verifica se um id de usuário foi fornecido
  if (!userId) {
    throw new Error('ID do usuário não fornecido.');
  }

  // Verifica se uma nova senha foi fornecida
  if (!newPassword) {
    throw new Error('Nova senha não fornecida.');
  }

  //Verifica se a nova senha atende aos critérios de segurança (exemplo: mínimo de 8 caracteres)
  if (newPassword.length < 8) {
    throw new Error('A nova senha deve ter pelo menos 8 caracteres.');
  }

  //Verifica se a nova senha contém pelo menos uma letra maiúscula, uma letra minúscula e um número
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    throw new Error('A nova senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.');
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
};

// Função para redefinir a senha de outro usuário (apenas para admin)
export async function changeUserPasswordAdmin(userId, newPassword) {
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

  // Verifica se um id de usuário foi fornecido
  if (!userId) {
    throw new Error('ID do usuário não fornecido.');
  }

  // Verifica se uma nova senha foi fornecida
  if (!newPassword) {
    throw new Error('Nova senha não fornecida.');
  }

  //Verifica se a nova senha atende aos critérios de segurança (exemplo: mínimo de 8 caracteres)
  if (newPassword.length < 8) {
    throw new Error('A nova senha deve ter pelo menos 8 caracteres.');
  }

  //Verifica se a nova senha contém pelo menos uma letra maiúscula, uma letra minúscula e um número
  const hasUpperCase = /[A-Z]/.test(newPassword);
  const hasLowerCase = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    throw new Error('A nova senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número.');
  }

  // Verifica se o usuário que está tentando redefinir a senha é um administrador
  const currentUser = getUser();
  if (!currentUser || currentUser.profile !== 3) {
    throw new Error('Apenas administradores podem redefinir senhas de outros usuários.');
  }

  // Faz a requisição para redefinir a senha do usuário especificado
  const response = await fetch(`${API_BASE_URL}/users/${userId}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders()
    },
    body: JSON.stringify({ password: newPassword })
  });

  if (!response.ok) {
    throw new Error('Erro ao redefinir senha.');
  }
  return response;
};

// Função para buscar as contas pendentes de validação (apenas para admin)
export const fetchPendingAccounts = async () => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    //Tentar renovar o token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
   }
  try {
    const res = await fetch(`${API_BASE_URL}/users/pending`, {
      headers: getAuthHeaders()
    });
    return res;
  } catch (error) {
    throw new Error('Erro ao buscar contas pendentes.');
  }
};

//Function to fetch users acounts that is pending and rejected (only for admin)
export const fetchPendingAndRejectedAccounts = async () => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    //Tentar renovar o token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
   }
  try {
    const res = await fetch(`${API_BASE_URL}/users/pending-rejected`, {
      headers: getAuthHeaders()
    });
    return res;
  } catch (error) {
    throw new Error('Erro ao buscar contas pendentes e rejeitadas.');
  }
};

//Function to fetch users acounts that is disbled (only for admin)
export const fetchDisabledAccounts = async () => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    //Tentar renovar o token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
   }
  try {
    const res = await fetch(`${API_BASE_URL}/users/disabled`, {
      headers: getAuthHeaders()
    });
    return res;
  } catch (error) {
    throw new Error('Erro ao buscar contas desativadas.');
  }
};

//Function to activate a user account (only for admin)
export const activateUserAccount = async (userId) => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    //Tentar renovar o token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/activate`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return res;
  } catch (error) {
    throw new Error('Erro ao ativar conta.');
  }
};

//Função para rejeitar uma conta (apenas para admin)
export const rejectUserAccount = async (userId) => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    //Tentar renovar o token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }
  try {
    const res = await fetch(`${API_BASE_URL}/users/${userId}/reject`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return res;
  } catch (error) {
    throw new Error('Erro ao rejeitar conta.');
  }
};

//Função para aprovar uma conta (apenas para admin)
export const approveUserAccount = async (userId, secretary_id) => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    //Tentar renovar o token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }
  try {
    const res = await fetch(`${API_BASE_URL}/users/verify`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ id: userId, secretary_id, account_status: 1 })
    });
    return res;
  } catch (error) {
    throw new Error('Erro ao aprovar conta.');
  }
};
