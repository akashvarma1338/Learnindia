import React from 'react';
import { Link } from 'react-router-dom';
import { FaRoad, FaUserTie, FaVideo, FaBook, FaArrowRight, FaStar, FaCheckCircle } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-6xl font-extrabold mb-6 animate-fade-in-up">
            Discover Your True Career Path
          </h1>
          <p className="text-2xl mb-8 animate-fade-in-up animation-delay-200 font-light">
            Beyond Engineering & Medical - Explore 100+ Career Options
          </p>
          <Link 
            to="/careers" 
            className="group bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-blue-50 transition-all duration-300 inline-flex items-center gap-2 shadow-2xl hover:shadow-blue-300/50 hover:scale-105 animate-fade-in-up animation-delay-400"
          >
            Explore Careers
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-extrabold text-center mb-4 text-gray-800 animate-fade-in">Our Services</h2>
          <p className="text-center text-gray-600 mb-16 text-lg">Choose the perfect plan for your career journey</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 text-center border-2 border-transparent hover:border-blue-400 hover:-translate-y-2 animate-fade-in-up">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <FaRoad className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Career Roadmaps</h3>
              <p className="text-gray-600 mb-6 min-h-[48px]">Interactive roadmaps for various careers</p>
              <div className="mb-6">
                <p className="text-4xl font-extrabold text-blue-600">₹9</p>
                <p className="text-sm text-gray-500">One-time purchase</p>
              </div>
              <Link to="/careers" className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-xl group-hover:scale-105">
                View Roadmaps
              </Link>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 text-center border-2 border-transparent hover:border-blue-400 hover:-translate-y-2 animate-fade-in-up animation-delay-200">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <FaUserTie className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Executive Consultation</h3>
              <p className="text-gray-600 mb-6 min-h-[48px]">Get personalized career guidance</p>
              <div className="mb-6">
                <p className="text-4xl font-extrabold text-blue-600">₹100</p>
                <p className="text-sm text-gray-500">Per session</p>
              </div>
              <Link to="/consultation" className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-xl group-hover:scale-105">
                Book Now
              </Link>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 text-center border-2 border-transparent hover:border-blue-400 hover:-translate-y-2 animate-fade-in-up animation-delay-400">
              <div className="bg-gradient-to-br from-blue-400 to-blue-500 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <FaVideo className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Expert Talks</h3>
              <p className="text-gray-600 mb-6 min-h-[48px]">Connect with successful professionals</p>
              <div className="mb-6">
                <p className="text-4xl font-extrabold text-blue-600">₹500</p>
                <p className="text-sm text-gray-500">Per session</p>
              </div>
              <Link to="/expert-talks" className="block w-full bg-gradient-to-r from-blue-400 to-blue-500 text-white py-3 rounded-xl font-bold hover:from-blue-500 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-xl group-hover:scale-105">
                Connect
              </Link>
            </div>

            <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 text-center border-2 border-transparent hover:border-blue-400 hover:-translate-y-2 animate-fade-in-up animation-delay-600">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
                <FaBook className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Personalized Learning</h3>
              <p className="text-gray-600 mb-6 min-h-[48px]">Content tailored to your style</p>
              <div className="mb-6">
                <p className="text-4xl font-extrabold text-blue-600">Free</p>
                <p className="text-sm text-gray-500">Always free</p>
              </div>
              <Link to="/learning" className="block w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-xl group-hover:scale-105">
                Start Learning
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full filter blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform">100+</h3>
                <p className="text-xl font-semibold">Career Options</p>
                <FaCheckCircle className="text-3xl mx-auto mt-4 text-white" />
              </div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform">50+</h3>
                <p className="text-xl font-semibold">Expert Mentors</p>
                <FaStar className="text-3xl mx-auto mt-4 text-white" />
              </div>
            </div>
            <div className="group hover:scale-110 transition-transform duration-300">
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                <h3 className="text-6xl font-extrabold mb-3 group-hover:scale-110 transition-transform">1000+</h3>
                <p className="text-xl font-semibold">Students Guided</p>
                <FaCheckCircle className="text-3xl mx-auto mt-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-extrabold mb-6 text-gray-800 animate-fade-in">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">Join thousands of students discovering their true potential and building successful careers</p>
          <Link 
            to="/signup" 
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-lg px-12 py-5 rounded-full font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50 hover:scale-105"
          >
            Get Started Free
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
