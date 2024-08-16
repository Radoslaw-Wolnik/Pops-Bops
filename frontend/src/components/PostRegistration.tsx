// PostRegistration.tsx
// it shouold be inserted into modal after succesfull registration
import React, { useEffect } from 'react';
import { useModal } from '../hooks/useModal';

const PostRegistration: React.FC = () => {
  const { closeModal } = useModal();
    
  useEffect(() => {
    const timer = setTimeout(() => closeModal(), 3000);
    return () => clearTimeout(timer);
  }, [closeModal]);

  return (
    <div className="post-registration">
      <h1>Registration Successful!</h1>
      <p>Thank you for registering. An email has been sent to your email address with a verification link.</p>
      <p>Please check your inbox and click the link to verify your email address before logging in.</p>
    </div>
  );
};

export default PostRegistration;