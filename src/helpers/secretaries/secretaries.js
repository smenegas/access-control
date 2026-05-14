import { getToken, isTokenExpired, refreshTokenRequest } from "../authentication/authentication";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';

export const getSecretaries = async () => {
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
  const res = await fetch(`${API_BASE_URL}/secretaries`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error('Erro ao buscar secretarias.');
  }
  return res.json();
};

export const getSecretaryById = async (id) => {
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
  //Carrega as secretarias para mostrar o nome da secretaria do usuário
  try {
    const res = await fetch(`${API_BASE_URL}/secretaries/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    return res;
  } catch (error) {
    throw new Error('Erro ao buscar secretaria.');
  }
};