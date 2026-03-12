import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-extrabold mb-4 text-white">
              Learn India
            </h3>
            <p className="text-gray-300 mb-4">Empowering students to explore diverse career paths beyond traditional choices.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-2xl hover:text-blue-300 transition-colors duration-300 hover:scale-110 transform">
                <FaFacebook />
              </a>
              <a href="#" className="text-2xl hover:text-blue-300 transition-colors duration-300 hover:scale-110 transform">
                <FaTwitter />
              </a>
              <a href="#" className="text-2xl hover:text-blue-300 transition-colors duration-300 hover:scale-110 transform">
                <FaInstagram />
              </a>
              <a href="#" className="text-2xl hover:text-blue-300 transition-colors duration-300 hover:scale-110 transform">
                <FaLinkedin />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-blue-300">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/careers" className="text-gray-300 hover:text-blue-300 transition-colors duration-300 hover:translate-x-1 inline-block">Career Roadmaps</Link></li>
              <li><Link to="/consultation" className="text-gray-300 hover:text-blue-300 transition-colors duration-300 hover:translate-x-1 inline-block">Consultation</Link></li>
              <li><Link to="/expert-talks" className="text-gray-300 hover:text-blue-300 transition-colors duration-300 hover:translate-x-1 inline-block">Expert Talks</Link></li>
              <li><Link to="/learning" className="text-gray-300 hover:text-blue-300 transition-colors duration-300 hover:translate-x-1 inline-block">Learning</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-blue-300">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-blue-300 transition-colors duration-300 hover:translate-x-1 inline-block">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-blue-300 transition-colors duration-300 hover:translate-x-1 inline-block">Contact</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-blue-300 transition-colors duration-300 hover:translate-x-1 inline-block">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-blue-300 transition-colors duration-300 hover:translate-x-1 inline-block">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-4 text-blue-300">Contact</h4>
            <p className="text-gray-300 mb-2">📧 support@learnindia.com</p>
            <p className="text-gray-300 mb-2">📞 +91 1234567890</p>
            <p className="text-gray-300">📍 Mumbai, India</p>
          </div>
        </div>
        
        <div className="border-t border-blue-700 pt-6 text-center">
          <p className="text-gray-300 flex items-center justify-center gap-2">
            © 2024 Learn India. Made with <FaHeart className="text-blue-400 animate-pulse" /> for students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
