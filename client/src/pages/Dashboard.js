import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaRoad, FaCalendar, FaVideo, FaBook, FaTrophy, FaChartLine, FaTimes, FaRobot } from 'react-icons/fa';
import CareerChatbot from '../components/CareerChatbot';

const Dashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotCareer, setChatbotCareer] = useState('');

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchUserData = async () => {
    if (!currentUser) return;

    try {
      const purchasesQuery = query(
        collection(db, 'purchases'),
        where('userId', '==', currentUser.uid)
      );
      const purchasesSnap = await getDocs(purchasesQuery);
      const purchasesData = purchasesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Fetch career details for each purchase
      const purchasesWithDetails = await Promise.all(
        purchasesData.map(async (purchase) => {
          if (purchase.type === 'roadmap' && purchase.careerId) {
            const careerDoc = await getDoc(doc(db, 'careers', purchase.careerId));
            if (careerDoc.exists()) {
              return { ...purchase, careerData: careerDoc.data() };
            }
          }
          return purchase;
        })
      );
      
      setPurchases(purchasesWithDetails);

      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('userId', '==', currentUser.uid)
      );
      const bookingsSnap = await getDocs(bookingsQuery);
      setBookings(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRoadmap = (purchase) => {
    if (purchase.careerData && purchase.careerData.roadmap) {
      setSelectedRoadmap({
        name: purchase.careerName,
        roadmap: purchase.careerData.roadmap,
        category: purchase.careerData.category
      });
      setShowRoadmapModal(true);
      setChatbotCareer(purchase.careerName);
    }
  };

  const handleOpenChatbot = () => {
    setShowChatbot(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-5xl font-extrabold mb-3 text-blue-600">
            Welcome back, {userProfile?.name}! 👋
          </h1>
          <p className="text-xl text-gray-600">Here's your learning journey overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 text-center border-2 border-transparent hover:border-blue-400 hover:-translate-y-2 animate-fade-in-up">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
              <FaRoad className="text-3xl text-white" />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-2">{purchases.filter(p => p.type === 'roadmap').length}</h3>
            <p className="text-gray-600 font-semibold">Roadmaps Purchased</p>
            <div className="mt-3 flex items-center justify-center gap-1">
              <FaChartLine className="text-blue-500" />
              <span className="text-sm text-blue-500 font-semibold">Active</span>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 text-center border-2 border-transparent hover:border-blue-400 hover:-translate-y-2 animate-fade-in-up animation-delay-200">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
              <FaCalendar className="text-3xl text-white" />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-2">{bookings.filter(b => b.type === 'consultation').length}</h3>
            <p className="text-gray-600 font-semibold">Consultations Booked</p>
            <div className="mt-3 flex items-center justify-center gap-1">
              <FaTrophy className="text-blue-500" />
              <span className="text-sm text-blue-600 font-semibold">Growing</span>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 text-center border-2 border-transparent hover:border-blue-400 hover:-translate-y-2 animate-fade-in-up animation-delay-400">
            <div className="bg-gradient-to-br from-blue-400 to-blue-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
              <FaVideo className="text-3xl text-white" />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-2">{bookings.filter(b => b.type === 'expert').length}</h3>
            <p className="text-gray-600 font-semibold">Expert Talks</p>
            <div className="mt-3 flex items-center justify-center gap-1">
              <FaChartLine className="text-blue-500" />
              <span className="text-sm text-blue-500 font-semibold">Connected</span>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 text-center border-2 border-transparent hover:border-blue-400 hover:-translate-y-2 animate-fade-in-up animation-delay-600">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 transition-transform duration-300 shadow-lg">
              <FaBook className="text-3xl text-white" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-800 mb-2">{userProfile?.learningPreference || 'Not Set'}</h3>
            <p className="text-gray-600 font-semibold">Learning Style</p>
            <div className="mt-3">
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">Personalized</span>
            </div>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 animate-fade-in-up animation-delay-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaRoad className="text-blue-500" />
              My Roadmaps
            </h2>
            <a href="/careers" className="text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-2 transition-colors">
              Browse More →
            </a>
          </div>
          {purchases.filter(p => p.type === 'roadmap').length > 0 ? (
            <div className="space-y-4">
              {purchases.filter(p => p.type === 'roadmap').map(purchase => (
                <div key={purchase.id} className="group flex justify-between items-center p-5 border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <FaRoad className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{purchase.careerName}</h3>
                      <p className="text-sm text-gray-500">Purchased on {new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                      {purchase.careerData?.roadmap && (
                        <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          ✓ Roadmap Available
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewRoadmap(purchase)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-xl"
                  >
                    View Roadmap
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-6xl mb-4">🗺️</div>
              <p className="text-gray-600 mb-4">No roadmaps purchased yet.</p>
              <a href="/careers" className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg">
                Explore Careers
              </a>
            </div>
          )}
        </div>

        {/* Upcoming Bookings */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 animate-fade-in-up animation-delay-1000">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
              <FaCalendar className="text-blue-500" />
              Upcoming Sessions
            </h2>
            <a href="/consultation" className="text-blue-500 hover:text-blue-600 font-semibold flex items-center gap-2 transition-colors">
              Book More →
            </a>
          </div>
          {bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map(booking => (
                <div key={booking.id} className="group flex justify-between items-center p-5 border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform bg-gradient-to-br from-blue-500 to-blue-600`}>
                      {booking.type === 'consultation' ? <FaCalendar className="text-white text-xl" /> : <FaVideo className="text-white text-xl" />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">{booking.type === 'consultation' ? 'Executive Consultation' : 'Expert Talk'}</h3>
                      <p className="text-sm text-gray-500">{new Date(booking.date).toLocaleString()}</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  {booking.meetingLink && (
                    <a 
                      href={`${booking.meetingLink}#userInfo.displayName=${encodeURIComponent(userProfile?.name || 'Student')}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-xl"
                    >
                      Join Meeting
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-600 mb-4">No upcoming sessions.</p>
              <a href="/consultation" className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg">
                Book a Session
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Roadmap Viewer Modal */}
      {showRoadmapModal && selectedRoadmap && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{selectedRoadmap.name}</h2>
                <p className="text-gray-600 mt-1">{selectedRoadmap.category}</p>
              </div>
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  setSelectedRoadmap(null);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 p-4 mb-6 rounded">
              <p className="text-blue-800 font-semibold flex items-center gap-2">
                <FaTrophy /> Full Access Unlocked!
              </p>
              <p className="text-blue-600 text-sm mt-1">You have complete access to this career roadmap. Follow the steps to achieve your goals!</p>
            </div>

            <div className="prose max-w-none mb-6">
              <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-6 rounded-lg border border-gray-200">
                {selectedRoadmap.roadmap}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleOpenChatbot}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                <FaRobot /> Ask AI Assistant
              </button>
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  setSelectedRoadmap(null);
                  setShowChatbot(false);
                }}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition"
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
        isPurchased={purchases.some(p => p.careerName === chatbotCareer && p.type === 'roadmap')}
      />
    </div>
  );
};

export default Dashboard;
