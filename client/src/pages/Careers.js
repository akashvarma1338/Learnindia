import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSearch, FaStar, FaArrowRight, FaTimes, FaBook, FaRobot } from 'react-icons/fa';
import CareerChatbot from '../components/CareerChatbot';

const Careers = () => {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotCareer, setChatbotCareer] = useState('');
  const [purchases, setPurchases] = useState([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCareers();
    if (currentUser) {
      fetchPurchases();
    }
  }, [currentUser]);

  const fetchPurchases = async () => {
    if (!currentUser) return;
    try {
      const purchasesQuery = query(
        collection(db, 'purchases'),
        where('userId', '==', currentUser.uid),
        where('type', '==', 'roadmap')
      );
      const purchasesSnap = await getDocs(purchasesQuery);
      setPurchases(purchasesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching purchases:', error);
    }
  };

  const fetchCareers = async () => {
    try {
      const careersSnap = await getDocs(collection(db, 'careers'));
      setCareers(careersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching careers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = (careerId, careerName) => {
    if (!currentUser) {
      toast.error('Please login to purchase roadmaps');
      navigate('/login');
      return;
    }
    navigate(`/payment/roadmap/${careerId}`, { state: { careerName, amount: 9 } });
  };

  const handleViewRoadmap = (career) => {
    if (career.roadmap) {
      setSelectedCareer(career);
      setShowRoadmapModal(true);
      setChatbotCareer(career.name);
    } else {
      toast.info('Roadmap coming soon for this career!');
    }
  };

  const handleOpenChatbot = () => {
    setShowChatbot(true);
  };

  const filteredCareers = careers.filter(career =>
    career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    career.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading careers...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-extrabold mb-4 text-blue-600">
            Explore Career Roadmaps
          </h1>
          <p className="text-xl text-gray-600">Find your perfect career path from 100+ options</p>
        </div>
        
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 animate-fade-in-up">
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search careers by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-lg transition-all duration-300 text-lg"
            />
          </div>
        </div>

        {/* Career Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCareers.map((career, index) => (
            <div 
              key={career.id} 
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 border-2 border-transparent hover:border-blue-400 hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Header with Badge */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {career.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-2">
                    <FaStar className="text-blue-400" />
                    <FaStar className="text-blue-400" />
                    <FaStar className="text-blue-400" />
                    <FaStar className="text-blue-400" />
                    <FaStar className="text-gray-300" />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  ₹9
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-3 min-h-[72px]">{career.description}</p>
              
              {/* Category Badge */}
              <div className="mb-6">
                <span className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {career.category}
                </span>
              </div>

              {/* Action Button */}
              <div className="flex gap-2">
                {career.roadmap && (
                  <button
                    onClick={() => handleViewRoadmap(career)}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FaBook /> Preview
                  </button>
                )}
                <button
                  onClick={() => handlePurchase(career.id, career.name)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Purchase
                  <FaArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCareers.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-2xl text-gray-600 mb-2">No careers found</p>
            <p className="text-gray-500">Try a different search term or browse all careers</p>
          </div>
        )}
      </div>

      {/* Roadmap Preview Modal */}
      {showRoadmapModal && selectedCareer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{selectedCareer.name}</h2>
                <p className="text-gray-600 mt-1">{selectedCareer.category}</p>
              </div>
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  setSelectedCareer(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="prose max-w-none mb-6">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                <p className="text-blue-800 font-semibold">📚 Career Roadmap Preview</p>
                <p className="text-blue-600 text-sm mt-1">This is a limited preview. Purchase to get full access and personalized guidance!</p>
              </div>
              
              <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-6 rounded-lg">
                {selectedCareer.roadmap ? (
                  <>
                    {selectedCareer.roadmap.substring(0, 500)}...
                    <div className="mt-4 p-4 bg-blue-100 rounded text-center">
                      <p className="font-semibold text-blue-800">[Purchase to view complete roadmap with detailed phases, resources, and career guidance]</p>
                    </div>
                  </>
                ) : (
                  'No roadmap available yet.'
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleOpenChatbot}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                <FaRobot /> Ask AI Assistant
              </button>
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  handlePurchase(selectedCareer.id, selectedCareer.name);
                }}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                Purchase Full Access - ₹9
              </button>
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  setSelectedCareer(null);
                  setShowChatbot(false);
                }}
                className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Career Chatbot */}
      <CareerChatbot 
        careerName={chatbotCareer} 
        isOpen={showChatbot} 
        onClose={() => setShowChatbot(false)}
        isPurchased={purchases.some(p => p.careerName === chatbotCareer)}
      />
    </div>
  );
};

export default Careers;
