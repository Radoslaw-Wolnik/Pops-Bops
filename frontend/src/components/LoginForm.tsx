// src/components/LoginForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useModal } from '../hooks/useModal';
import { LoginCredentials } from '../types';
import { ApiError } from '../services/api';

import RegisterForm from './RegisterForm';

const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { closeModal, updateModalContent } = useModal();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(credentials.email, credentials.password);
      // Handle successful login
      // some timeout mby
      closeModal();
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  const handleGoToRegister = async () => {
    updateModalContent(<RegisterForm />)
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <button onClick={handleGoToRegister}>Dont have an account? Register</button>
    </div>
  );
};

export default LoginForm;