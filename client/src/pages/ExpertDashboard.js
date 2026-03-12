import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { FaVideo, FaUsers, FaStar, FaChartLine } from 'react-icons/fa';

const ExpertDashboard = () => {
  const { userProfile } = useAuth();
  const [expertTalks, setExpertTalks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpertTalks();
  }, []);

  const fetchExpertTalks = async () => {
    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('type', '==', 'expert')
      );
      const bookingsSnap = await getDocs(bookingsQuery);
      setExpertTalks(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching expert talks:', error);
    } finally {
      setLoading(false);
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
            Expert Dashboard 🎯
          </h1>
          <p className="text-xl text-gray-600">Welcome, {userProfile?.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-2 border-blue-100">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaVideo className="text-3xl text-white" />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-2">{expertTalks.length}</h3>
            <p className="text-gray-600 font-semibold">Total Expert Talks</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-2 border-blue-100">
            <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-3xl text-white" />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-2">{expertTalks.filter(t => t.status === 'confirmed').length}</h3>
            <p className="text-gray-600 font-semibold">Upcoming Sessions</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 text-center border-2 border-blue-100">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaStar className="text-3xl text-white" />
            </div>
            <h3 className="text-4xl font-extrabold text-gray-800 mb-2">{expertTalks.filter(t => t.status === 'completed').length}</h3>
            <p className="text-gray-600 font-semibold">Completed</p>
          </div>
        </div>

        {/* Expert Talks List */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaVideo className="text-blue-500" />
            My Expert Talks
          </h2>
          {expertTalks.length > 0 ? (
            <div className="space-y-4">
              {expertTalks.map(talk => (
                <div key={talk.id} className="flex justify-between items-center p-5 border-2 border-gray-100 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center">
                      <FaVideo className="text-white text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-800">Expert Talk Session</h3>
                      <p className="text-sm text-gray-500">{new Date(talk.date).toLocaleString()}</p>
                      <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        talk.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        talk.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {talk.status}
                      </span>
                    </div>
                  </div>
                  {talk.meetingLink && (
                    <a href={talk.meetingLink} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-purple-700 transition">
                      Join Meeting
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-6xl mb-4">🎯</div>
              <p className="text-gray-600">No expert talks scheduled yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertDashboard;
