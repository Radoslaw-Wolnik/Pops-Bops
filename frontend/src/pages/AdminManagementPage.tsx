// src/pages/AdminManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAdmins, deleteAdmin, addAdmin } from '../services/api';
import { Navigate } from 'react-router-dom';

interface Admin {
  id: string;
  username: string;
  email: string;
}

const AdminManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState({ username: '', password: '', email: '' });

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const fetchAdmins = async () => {
    try {
      const response = await getAdmins();
      setAdmins(response.data);
    } catch (error) {
      console.error('Error fetching admins:', error);
      alert('Error fetching admins');
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await deleteAdmin(id);
        alert('Admin deleted successfully');
        fetchAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Error deleting admin');
      }
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAdmin(newAdmin);
      alert('Admin added successfully');
      setNewAdmin({ username: '', password: '', email: '' });
      fetchAdmins();
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Error adding admin');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Management</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Current Admins</h2>
        <ul>
          {admins.map((admin) => (
            <li key={admin.id} className="flex justify-between items-center mb-2">
              <span>{admin.username} ({admin.email})</span>
              <button
                onClick={() => handleDeleteAdmin(admin.id)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Add New Admin</h2>
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1">Username</label>
            <input
              type="text"
              id="username"
              value={newAdmin.username}
              onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full p-2 rounded bg-green-500 text-white">
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminManagementPage;