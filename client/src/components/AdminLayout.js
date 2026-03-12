import React from 'react';
import AdminNavbar from './AdminNavbar';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <AdminNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-gray-900 text-gray-400 py-6 border-t border-purple-500/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Learn India Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
