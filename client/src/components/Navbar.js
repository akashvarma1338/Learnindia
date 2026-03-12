import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const { currentUser, logout, userProfile } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white shadow-2xl sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold hover:scale-105 transition-transform duration-300">
            <span className="text-white">
              Learn India
            </span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/careers" className="hover:text-blue-200 transition-colors duration-300 font-semibold relative group">
              Careers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link to="/learning" className="hover:text-blue-200 transition-colors duration-300 font-semibold relative group">
              Learning
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {currentUser ? (
              <>
                <Link to="/dashboard" className="hover:text-blue-200 transition-colors duration-300 font-semibold relative group">
                  Dashboard
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                  <FaUserCircle className="text-2xl" />
                  <span className="font-semibold">{userProfile?.name}</span>
                  <button 
                    onClick={handleLogout} 
                    className="bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-blue-200 transition-colors duration-300 font-semibold relative group">
                  Login
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 font-bold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in-up">
            <Link to="/careers" className="block py-2 hover:text-blue-200 transition-colors font-semibold">
              Careers
            </Link>
            <Link to="/learning" className="block py-2 hover:text-blue-200 transition-colors font-semibold">
              Learning
            </Link>
            {currentUser ? (
              <>
                <Link to="/dashboard" className="block py-2 hover:text-blue-200 transition-colors font-semibold">
                  Dashboard
                </Link>
                <div className="pt-2 border-t border-white/20">
                  <p className="text-sm mb-2">Logged in as: {userProfile?.name}</p>
                  <button 
                    onClick={handleLogout} 
                    className="w-full bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 font-bold"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-blue-200 transition-colors font-semibold">
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block text-center bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-50 transition-all duration-300 font-bold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
