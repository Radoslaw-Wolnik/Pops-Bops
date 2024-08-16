// src/components/RegisterForm.tsx
import React, { useState } from 'react';
import PostRegistration from './PostRegistration';
import { useAuth } from '../hooks/useAuth';
import { useModal } from '../hooks/useModal';
import { ApiError } from '../services/api';
import LoginForm from './LoginForm';

const RegisterForm: React.FC = () => {
  const [userData, setUserData] = useState({email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { register } = useAuth();
  const { updateModalContent } = useModal();


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    try {
      const response = await register(userData.email, userData.username, userData.password);
      setSuccessMessage(response.message);
      // here should be someawait or sth
      updateModalContent(<PostRegistration />);
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

  const handleGoToLogin = async () => {
    updateModalContent(<LoginForm />)
  }

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
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
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={handleGoToLogin}>Silly you already have an account? Login</button>
    </div>
  );
};

export default RegisterForm;