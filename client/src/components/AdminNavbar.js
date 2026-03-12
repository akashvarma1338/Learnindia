import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserShield } from 'react-icons/fa';

const AdminNavbar = () => {
  const { logout, userProfile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/admin" className="text-2xl font-bold flex items-center gap-2">
            <FaUserShield className="text-blue-200" />
            <span>Learn India <span className="text-blue-200">Admin</span></span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/admin" className="hover:text-blue-200 transition">Dashboard</Link>
            <Link to="/" className="hover:text-blue-200 transition">View Site</Link>
            
            <div className="flex items-center space-x-3 border-l border-blue-400/30 pl-6">
              <FaUserShield className="text-2xl text-blue-200" />
              <span className="font-semibold">{userProfile?.name}</span>
              <button 
                onClick={handleLogout} 
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-50 transition font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
