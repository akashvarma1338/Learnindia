import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaCalendar, FaUsers, FaVideo, FaChartLine, FaRoad, FaTimes, FaRobot } from 'react-icons/fa';
import CareerChatbot from '../components/CareerChatbot';

const ExecutiveDashboard = () => {
  const { userProfile } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotCareer, setChatbotCareer] = useState('');

  useEffect(() => {
    fetchConsultations();
    fetchCareers();
  }, []);

  const fetchConsultations = async () => {
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('type', '==', 'consultation')
      );
      const bookingsSnap = await getDocs(bookingsQuery);
      const consultationsData = [];
      
      for (const bookingDoc of bookingsSnap.docs) {
        const booking = { id: bookingDoc.id, ...bookingDoc.data() };
        
        // Fetch user details
        if (booking.userId) {
          const userDoc = await getDoc(doc(db, 'users', booking.userId));
          if (userDoc.exists()) {
            booking.userName = userDoc.data().name;
            booking.userEmail = userDoc.data().email;
          }
        }
        
        consultationsData.push(booking);
      }
      
      setConsultations(consultationsData);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCareers = async () => {
    try {
      const careersSnap = await getDocs(collection(db, 'careers'));
      setCareers(careersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching careers:', error);
    }
  };

  const handleViewRoadmap = (career) => {
    setSelectedCareer(career);
    setShowRoadmapModal(true);
    setChatbotCareer(career.name);
  };

  const handleOpenChatbot = () => {
    setShowChatbot(true);
  };

  const handleStartMeeting = async (consultationId) => {
    const roomName = `LearnIndia-${consultationId}`;
    const meetingLink = `https://meet.jit.si/${roomName}`;
    const hostLink = `https://meet.jit.si/${roomName}#config.startWithVideoMuted=false&userInfo.displayName=Executive`;
    
    try {
      await updateDoc(doc(db, 'bookings', consultationId), {
        meetingLink: meetingLink,
        status: 'in-progress',
        updatedAt: new Date().toISOString()
      });
      
      window.open(hostLink, '_blank');
      fetchConsultations();
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-5xl font-extrabold mb-3 text-blue-600">
            Executive Dashboard 👨💼
          </h1>
          <p className="text-xl text-gray-600">Welcome, {userProfile?.name}! Manage consultations and access career resources</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-2 border-blue-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaCalendar className="text-3xl text-white" />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-2">{consultations.length}</h3>
            <p className="text-gray-600 font-semibold">Total Consultations</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-2 border-blue-100">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-3xl text-white" />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-2">{consultations.filter(c => c.status === 'confirmed' || c.status === 'pending').length}</h3>
            <p className="text-gray-600 font-semibold">Pending Sessions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-2 border-blue-100">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaChartLine className="text-3xl text-white" />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-2">{consultations.filter(c => c.status === 'completed').length}</h3>
            <p className="text-gray-600 font-semibold">Completed</p>
          </div>
        </div>

        {/* Consultations List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaCalendar className="text-blue-500" />
            Consultation Requests
          </h2>
          {consultations.length > 0 ? (
            <div className="space-y-4">
              {consultations.map(consultation => (
                <div key={consultation.id} className="flex justify-between items-center p-5 border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center">
                      <FaVideo className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-800">Consultation Session</h3>
                      <p className="text-sm text-gray-600">User: {consultation.userName || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Email: {consultation.userEmail || 'N/A'}</p>
                      <p className="text-sm text-gray-500">Scheduled: {new Date(consultation.date).toLocaleString()}</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        consultation.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        consultation.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        consultation.status === 'completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {consultation.status || 'pending'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {consultation.meetingLink ? (
                      <a 
                        href={consultation.meetingLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition flex items-center gap-2"
                      >
                        <FaVideo /> Join Meeting
                      </a>
                    ) : (
                      <button
                        onClick={() => handleStartMeeting(consultation.id)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition flex items-center gap-2"
                      >
                        <FaVideo /> Start Meeting
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-6xl mb-4">📅</div>
              <p className="text-gray-600">No consultation requests yet.</p>
            </div>
          )}
        </div>

        {/* Career Roadmaps Access */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaRoad className="text-blue-500" />
            Career Roadmaps (Full Access)
          </h2>
          <div className="space-y-4">
            {careers.map(career => (
              <div key={career.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-blue-400 hover:shadow-lg transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{career.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                      {career.category}
                    </span>
                    <p className="text-gray-600 mb-4">{career.description}</p>
                    
                    {/* Data Availability Badges */}
                    <div className="flex gap-2 flex-wrap mb-4">
                      {career.roadmap && (
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                          ✓ Roadmap
                        </span>
                      )}
                      {career.qualifications && career.qualifications.length > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
                          ✓ Qualifications ({career.qualifications.length})
                        </span>
                      )}
                      {career.exams && career.exams.length > 0 && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-semibold">
                          ✓ Exams ({career.exams.length})
                        </span>
                      )}
                      {career.scholarships && career.scholarships.length > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                          ✓ Scholarships ({career.scholarships.length})
                        </span>
                      )}
                    </div>

                    {/* Qualifications */}
                    {career.qualifications && career.qualifications.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          🎓 Education Qualifications:
                        </h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                          {career.qualifications.map((qual, index) => (
                            <li key={index} className="text-sm">{qual}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Entrance Exams */}
                    {career.exams && career.exams.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          📚 Entrance Exams & Certifications:
                        </h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                          {career.exams.map((exam, index) => (
                            <li key={index} className="text-sm">{exam}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Scholarships */}
                    {career.scholarships && career.scholarships.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                          💰 Scholarships Available:
                        </h4>
                        <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                          {career.scholarships.map((scholarship, index) => (
                            <li key={index} className="text-sm">{scholarship}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleViewRoadmap(career)}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-bold hover:from-blue-600 hover:to-blue-700 transition flex items-center justify-center gap-2"
                >
                  <FaRoad /> View Full Roadmap & AI Assistant
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Viewer Modal */}
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
                  setShowChatbot(false);
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 p-4 mb-6 rounded">
              <p className="text-green-800 font-semibold flex items-center gap-2">
                <FaUsers /> Executive Full Access
              </p>
              <p className="text-green-600 text-sm mt-1">You have complete access to all career roadmaps and AI assistant!</p>
            </div>

            <div className="prose max-w-none mb-6">
              <div className="whitespace-pre-wrap text-gray-700 bg-gray-50 p-6 rounded-lg border border-gray-200">
                {selectedCareer.roadmap || 'No roadmap available yet.'}
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
                  setSelectedCareer(null);
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
        isPurchased={true}
      />
    </div>
  );
};

export default ExecutiveDashboard;
