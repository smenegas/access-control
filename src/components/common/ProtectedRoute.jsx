import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../../helpers/authentication';

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;