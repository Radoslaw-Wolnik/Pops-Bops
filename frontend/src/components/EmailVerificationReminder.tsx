// EmailVerificationReminder.tsx

import React from 'react';
import { useAuth } from '../hooks/useAuth';

const EmailVerificationReminder: React.FC = () => {
  const { user } = useAuth();

  // not sure of the condition user.isVerified == true
  if (!user || user.isVerified == true) {
    return null;
  }

  return (
    <div className="email-verification-reminder">
      <h2>Please Verify Your Email</h2>
      <p>An email has been sent to {user.email} with a verification link. Please check your inbox and click the link to verify your email address.</p>
      <p>You may need to refresh the page after verifying your email.</p>
    </div>
  );
};

export default EmailVerificationReminder;