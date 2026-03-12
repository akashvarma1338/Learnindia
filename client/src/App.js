import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Careers from './pages/Careers';
import Consultation from './pages/Consultation';
import ExpertTalks from './pages/ExpertTalks';
import Learning from './pages/Learning';
import Payment from './pages/Payment';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import ExecutiveDashboard from './pages/ExecutiveDashboard';
import ExpertDashboard from './pages/ExpertDashboard';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Admin Routes with Admin Layout */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <PrivateRoute adminOnly={true}>
              <AdminLayout>
                <Admin />
              </AdminLayout>
            </PrivateRoute>
          } />

          {/* Executive Dashboard */}
          <Route path="/executive-dashboard" element={
            <PrivateRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <ExecutiveDashboard />
                </main>
                <Footer />
              </div>
            </PrivateRoute>
          } />

          {/* Expert Dashboard */}
          <Route path="/expert-dashboard" element={
            <PrivateRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow">
                  <ExpertDashboard />
                </main>
                <Footer />
              </div>
            </PrivateRoute>
          } />

          {/* User Routes with User Layout */}
          <Route path="/*" element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/careers" element={<Careers />} />
                  <Route path="/consultation" element={<Consultation />} />
                  <Route path="/expert-talks" element={<ExpertTalks />} />
                  <Route path="/learning" element={<Learning />} />
                  
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } />
                  
                  <Route path="/payment/:type/:id?" element={
                    <PrivateRoute>
                      <Payment />
                    </PrivateRoute>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </Router>
  );
}

export default App;
