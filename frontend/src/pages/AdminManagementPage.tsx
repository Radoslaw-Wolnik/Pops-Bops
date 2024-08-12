// src/pages/AdminManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAdmins, deleteAdmin, addAdmin } from '../services/api';
import { Navigate } from 'react-router-dom';
import { User, RegisterAdminData } from '../types';


const AdminManagementPage: React.FC = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<User[]>([]);
  const [newAdmin, setNewAdmin] = useState<RegisterAdminData>({
    username: '',
    email: '',
    password: ''
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [id]: value }));
  };

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
    if (Object.values(newAdmin).every(field => field !== '')) {
      try {
        await addAdmin(newAdmin);
        alert('Admin added successfully');
        setNewAdmin({ username: '', email: '', password: ''});
        fetchAdmins();
      } catch (error) {
        console.error('Error adding admin:', error);
        alert('Error adding admin');
      }
    } else {
      alert('Please fill in all fields');
    }
  };

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Existing Admins</h2>
        <ul>
          {admins.map((admin) => (
            <li key={admin._id} className="flex justify-between items-center mb-2">
              <span>{admin.username} (admin.email mby idk)</span>
              <button
                onClick={() => handleDeleteAdmin(admin._id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Add New Admin</h2>
        <form onSubmit={handleAddAdmin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">Username</label>
            <input
              type="text"
              id="username"
              value={newAdmin.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={newAdmin.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={newAdmin.password}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};


export default AdminManagementPage;