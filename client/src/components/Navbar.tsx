import React from 'react';
// We remove 'Link' from this import
import { NavLink, useNavigate } from 'react-router-dom'; 
import { useAuth } from '../hooks/useAuth';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-indigo-600 font-semibold px-3 py-2 rounded-md'
      : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50 px-3 py-2 rounded-md';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="font-bold text-xl text-indigo-600">SlotSwapper</span>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/marketplace" className={navLinkClass}>
                Marketplace
              </NavLink>
              <NavLink to="/requests" className={navLinkClass}>
                My Requests
              </NavLink>
            </div>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleLogout}
              className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-md shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};