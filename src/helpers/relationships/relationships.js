// This file contains helper functions for managing relationships between entities in the application.
import { getToken, isTokenExpired, refreshTokenRequest } from '../authentication/authentication';

// Base URL for the API, retrieved from environment variables or defaulting to localhost.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443';

// Function to get the list of relationships
export const getRelationships = async () => {
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
  const res = await fetch(`${API_BASE_URL}/relationships`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  if (!res.ok) {
    throw new Error('Erro ao buscar relacionamentos.');
  }
  return res.json();
};

// Function to get a relationship by ID
export const getRelationshipById = async (id) => {
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
    const res = await fetch(`${API_BASE_URL}/relationships/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error('Erro ao buscar relacionamento.');
    }
    return res.json();
  } catch (error) {
    throw new Error('Erro ao buscar relacionamento.');
  }
};

// Function to create a new relationship
export const createRelationship = async (data) => {
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
    const res = await fetch(`${API_BASE_URL}/relationships`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error('Erro ao criar relacionamento.');
    }
    // Return the ID of the newly created relationship
    return res.json();
  } catch (error) {
    throw new Error('Erro ao criar relacionamento.');
  }
};

// Function to update an existing relationship
export const updateRelationship = async (id, data) => {
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
    const res = await fetch(`${API_BASE_URL}/relationships/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      throw new Error('Erro ao atualizar relacionamento.');
    }
    // Return the number of affected rows or the updated relationship data.
    return res.json();
  } catch (error) {
    throw new Error('Erro ao atualizar relacionamento.');
  }
};

// Function to delete a relationship by ID
export const deleteRelationship = async (id) => {
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
    const res = await fetch(`${API_BASE_URL}/relationships/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) {
      throw new Error('Erro ao deletar relacionamento.');
    }
    // Return a success message or status code.
    return res.json();
  } catch (error) {
    throw new Error('Erro ao deletar relacionamento.');
  }
};