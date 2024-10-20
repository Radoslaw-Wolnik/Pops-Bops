import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';
import { Input } from './Input';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Pops and Bops
          </Link>
          <form onSubmit={handleSearch} className="flex-grow max-w-md mx-4">
            <Input
              type="search"
              placeholder="Search samples and collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </form>
          <nav>
            <ul className="flex space-x-4">
              <li><Link to="/" className="hover:underline">Home</Link></li>
              {user ? (
                <>
                  <li><Link to="/create" className="hover:underline">Create Sample</Link></li>
                  <li><Link to="/collections" className="hover:underline">My Collections</Link></li>
                  <li><Link to="/profile" className="hover:underline">Profile</Link></li>
                  <li><Button onClick={logout} variant="ghost">Logout</Button></li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="hover:underline">Login</Link></li>
                  <li><Link to="/register" className="hover:underline">Register</Link></li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4">
        {children}
      </main>
      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2024 Pops and Bops. All rights reserved.</p>
      </footer>
    </div>
  );
};