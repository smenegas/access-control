const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';
const STORAGE_TOKEN_KEY = '@AppAcessos:token';
const STORAGE_USER_KEY = '@AppAcessos:user';
const STORAGE_REFRESH_TOKEN_KEY = '@AppAcessos:refreshToken';

export async function login({ email, password }) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  //console.log('Resposta do login:', data); // Log para depuração

  if (!response.ok) {
    const message = data?.error || data?.message || 'Falha ao autenticar usuário.';
    throw new Error(message);
  }

  if (!data.accessToken) {
    throw new Error('Resposta de autenticação inválida.');
  }

  setSession(data.accessToken, data.user || null);
  setRefreshToken(data.refreshToken);
  return data;
}

export function logout() {
  sessionStorage.removeItem(STORAGE_TOKEN_KEY);
  sessionStorage.removeItem(STORAGE_USER_KEY);
  sessionStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY);
}


export function setSession(token, usuario = null) {
  sessionStorage.setItem(STORAGE_TOKEN_KEY, token);
  if (usuario) {
    sessionStorage.setItem(STORAGE_USER_KEY, JSON.stringify(usuario));
  }
}

export function setRefreshToken(refreshToken) {
  if (refreshToken) {
    sessionStorage.setItem(STORAGE_REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function getRefreshToken() {
  return sessionStorage.getItem(STORAGE_REFRESH_TOKEN_KEY);
}

export function removeRefreshToken() {
  sessionStorage.removeItem(STORAGE_REFRESH_TOKEN_KEY);
}

// Função para renovar o token usando o refresh token
export async function refreshTokenRequest() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('Refresh token não encontrado.');

  const response = await fetch(`${API_BASE_URL}/login/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ refreshToken })
  });

  const data = await response.json();
  if (!response.ok) {
    removeRefreshToken();
    throw new Error(data?.error || data?.message || 'Falha ao renovar token.');
  }

  setSession(data.accessToken, data.user || null);
  setRefreshToken(data.refreshToken);
  return data;
}

export function getToken() {
  return sessionStorage.getItem(STORAGE_TOKEN_KEY);
}

export function getUser() {
  const stored = sessionStorage.getItem(STORAGE_USER_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }

  const token = getToken();
  return token ? getUserFromToken(token) : null;
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function isAuthenticated() {
  const token = getToken();
  return !!token && !isTokenExpired(token);
}

export function isTokenExpired(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  return Math.floor(Date.now() / 1000) >= payload.exp;
}

export function parseJwt(token) {
  if (!token) return null;

  try {
    const base64Payload = token.split('.')[1];
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(
      payload
        .split('')
        .map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join('')
    ));
  } catch {
    return null;
  }
}

export function getUserFromToken(token) {
  const payload = parseJwt(token);
  if (!payload) return null;

  return {
    id: payload.sub || payload.id || null,
    email: payload.email || null,
    nome: payload.name || payload.nome || null,
    roles: payload.profile || payload.role || []
  };
}

export async function fetchWithAuth(url, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeaders(),
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401) {
    logout();
  }

  return response;
}
