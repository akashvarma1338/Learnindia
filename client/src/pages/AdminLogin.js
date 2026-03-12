import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await login(email, password);

      // Fetch the profile to check role
      await fetchUserProfile(userCredential.user.uid);

      // Brief delay to allow state to settle
      setTimeout(async () => {
        // Re-read profile from Firestore directly to avoid stale state
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../config/firebase');
        const docSnap = await getDoc(doc(db, 'users', userCredential.user.uid));

        if (docSnap.exists() && docSnap.data().role === 'admin') {
          toast.success('Welcome, Admin!');
          navigate('/admin');
        } else {
          toast.error('Access denied. You are not an admin.');
          const { signOut } = await import('firebase/auth');
          const { auth } = await import('../config/firebase');
          await signOut(auth);
          navigate('/admin-login');
        }
      }, 500);

    } catch (error) {
      toast.error('Login failed: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)'
    }}>
      <div className="w-full max-w-md px-4">
        {/* Shield Icon */}
        <div className="flex justify-center mb-6">
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(255,255,255,0.1)',
            border: '2px solid rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '2.5rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.4)'
        }}>
          <h2 style={{ color: '#fff', fontSize: '1.75rem', fontWeight: 700, textAlign: 'center', marginBottom: 4 }}>
            Admin Portal
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Restricted access — authorised personnel only
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.95rem', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  width: '100%', padding: '0.75rem 1rem', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: '0.95rem', outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '0.85rem', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                background: loading
                  ? 'rgba(255,255,255,0.2)'
                  : 'linear-gradient(135deg, #6c63ff, #3f3d9e)',
                color: '#fff', fontSize: '1rem', fontWeight: 700, marginTop: 8,
                transition: 'all 0.3s ease',
                boxShadow: loading ? 'none' : '0 4px 20px rgba(108,99,255,0.4)'
              }}
            >
              {loading ? 'Verifying...' : 'Access Admin Panel'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)' }}>
            Not an admin?{' '}
            <a href="/login" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline' }}>
              Go to User Login
            </a>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>
          🔒 Secured · Learn India Admin System
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
