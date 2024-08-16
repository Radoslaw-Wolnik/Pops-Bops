// src/components/RequestPasswordReset.tsx
import React, { useState } from 'react';
import { requestPasswordReset as apiRequestPasswordReset } from '../services/api';

const RequestPasswordReset: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ''){
      // here there could be more extensive email format verification 
      setMessage('Provide valid email');
    } else {
      try {
        const response = await apiRequestPasswordReset(email);
        setMessage(response.message);
      } catch (error) {
        setMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Request Password Reset</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RequestPasswordReset;