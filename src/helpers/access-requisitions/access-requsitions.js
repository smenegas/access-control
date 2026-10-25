/* This file contains helper functions for managing access requisitions */
import { getToken, isTokenExpired, refreshTokenRequest } from "../authentication/authentication";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';

// Function to get the list of access requisitions
export const getAccessRequisitions = async () => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    // Attempt to refresh the token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }
  const res = await fetch(`${API_BASE_URL}/access-requisitions`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error('Erro ao buscar requisições de acesso.');
  }
  return res.json();
};

// Function to get an access requisition by ID
export const getAccessRequisitionById = async (id) => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    // Attempt to refresh the token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }
  try {
    const res = await fetch(`${API_BASE_URL}/access-requisitions/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error('Erro ao buscar requisição de acesso.');
    }
    return res.json();
  } catch (error) {
    throw new Error('Erro ao buscar requisição de acesso.');
  }
};

// Function to create a new access requisition
export const createAccessRequisition = async (data) => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    // Attempt to refresh the token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }
  //console.log('Creating access requisition with data:', data);
  const res = await fetch(`${API_BASE_URL}/access-requisitions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error('Erro ao criar requisição de acesso.');
  }
  return res.json();
};

// Function to update an access requisition
export const updateAccessRequisition = async (id, data) => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    // Attempt to refresh the token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }
  const res = await fetch(`${API_BASE_URL}/access-requisitions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error('Erro ao atualizar requisição de acesso.');
  }
  return res.json();
};

// Function to delete an access requisition
export const deleteAccessRequisition = async (id) => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    // Attempt to refresh the token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }
  const res = await fetch(`${API_BASE_URL}/access-requisitions/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error('Erro ao deletar requisição de acesso.');
  }
  return res.json();
};

// Function which upload files to the server
export const uploadFiles = async (files, requisitionId) => {
  let token = getToken();
  if (!token) throw new Error('Usuário não autenticado');

  if (isTokenExpired(token)) {
    // Attempt to refresh the token
    try {
      const data = await refreshTokenRequest();
      token = data.accessToken;
    } catch (err) {
      throw new Error(err);
    }
  }

  const formData = new FormData();
  formData.append('access_request_id', requisitionId);
  files.forEach(file => {
    formData.append('files', file);
  });

  const res = await fetch(`${API_BASE_URL}/files/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  if (!res.ok) {
    throw new Error('Erro ao enviar arquivos.');
  }
  return res.json();
};