import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { updateProfile, uploadProfilePicture } from '../services/api';
import { Button } from './Button';
import { Input } from './Input';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (!user) throw new Error('User not found');

      const updatedUser = await updateProfile(user._id, { username, email });
      updateUser(updatedUser);

      if (profilePicture) {
        const profilePictureUrl = await uploadProfilePicture(profilePicture);
        updateUser({ ...updatedUser, profilePicture: profilePictureUrl });
      }

      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1">Username:</label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email:</label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="profilePicture" className="block mb-1">Profile Picture:</label>
          <Input
            type="file"
            id="profilePicture"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
            accept="image/*"
          />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
    </div>
  );
};