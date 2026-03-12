import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from 'react-icons/fa';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('careers');
  const [careers, setCareers] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [roadmaps, setRoadmaps] = useState([]);
  const [newCareer, setNewCareer] = useState({ 
    name: '', 
    description: '', 
    category: '',
    qualifications: [],
    exams: [],
    scholarships: []
  });
  const [editingCareer, setEditingCareer] = useState(null);
  const [editForm, setEditForm] = useState({ 
    name: '', 
    description: '', 
    category: '', 
    roadmap: '',
    qualifications: [],
    exams: [],
    scholarships: []
  });
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'careers') {
        const careersSnap = await getDocs(collection(db, 'careers'));
        setCareers(careersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (activeTab === 'users') {
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } else if (activeTab === 'bookings') {
        const bookingsSnap = await getDocs(collection(db, 'bookings'));
        setBookings(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } else if (activeTab === 'roadmaps') {
        const purchasesSnap = await getDocs(collection(db, 'purchases'));
        const allPurchases = purchasesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRoadmaps(allPurchases.filter(p => p.type === 'roadmap'));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data: ' + error.message);
    }
  };

  const handleAddCareer = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'careers'), {
        ...newCareer,
        createdAt: new Date().toISOString()
      });
      toast.success('Career added successfully!');
      setNewCareer({ name: '', description: '', category: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to add career');
    }
  };

  const handleDeleteCareer = async (id) => {
    if (window.confirm('Are you sure you want to delete this career?')) {
      try {
        await deleteDoc(doc(db, 'careers', id));
        toast.success('Career deleted successfully!');
        fetchData();
      } catch (error) {
        toast.error('Failed to delete career');
      }
    }
  };

  const handleEditCareer = (career) => {
    setEditingCareer(career.id);
    setEditForm({
      name: career.name,
      description: career.description,
      category: career.category,
      roadmap: career.roadmap || '',
      qualifications: career.qualifications || [],
      exams: career.exams || [],
      scholarships: career.scholarships || []
    });
  };

  const handleViewDetails = (career) => {
    setSelectedCareer(career);
    setShowDetailsModal(true);
  };

  const handleUpdateCareer = async (id) => {
    try {
      await updateDoc(doc(db, 'careers', id), {
        name: editForm.name,
        description: editForm.description,
        category: editForm.category,
        roadmap: editForm.roadmap,
        updatedAt: new Date().toISOString()
      });
      toast.success('Career updated successfully!');
      setEditingCareer(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update career');
    }
  };

  const handleCancelEdit = () => {
    setEditingCareer(null);
    setEditForm({ name: '', description: '', category: '', roadmap: '' });
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole,
        updatedAt: new Date().toISOString()
      });
      toast.success(`User role updated to ${newRole}!`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleManageRoadmap = (career) => {
    setSelectedCareer(career);
    setShowRoadmapModal(true);
  };

  const handleSaveRoadmap = async () => {
    if (!selectedCareer) return;
    
    try {
      await updateDoc(doc(db, 'careers', selectedCareer.id), {
        roadmap: editForm.roadmap,
        updatedAt: new Date().toISOString()
      });
      toast.success('Roadmap updated successfully!');
      setShowRoadmapModal(false);
      setSelectedCareer(null);
      setEditForm({ name: '', description: '', category: '', roadmap: '' });
      fetchData();
    } catch (error) {
      toast.error('Failed to update roadmap');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Control Panel</h1>
          <p className="text-blue-600">Manage platform content and monitor activities</p>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTab('careers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'careers' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            📚 Careers
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'users' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'bookings' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            📅 Bookings
          </button>
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'roadmaps' 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
            }`}
          >
            🗺️ Roadmaps
          </button>
        </div>

        {activeTab === 'careers' && (
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Career</h2>
              <form onSubmit={handleAddCareer} className="space-y-4">
                <input
                  type="text"
                  placeholder="Career Name"
                  value={newCareer.name}
                  onChange={(e) => setNewCareer({...newCareer, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newCareer.category}
                  onChange={(e) => setNewCareer({...newCareer, category: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={newCareer.description}
                  onChange={(e) => setNewCareer({...newCareer, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  rows="3"
                  required
                />
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg">Add Career</button>
              </form>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">All Careers</h2>
              <div className="space-y-4">
                {careers.map(career => (
                  <div key={career.id}>
                    {editingCareer === career.id ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="Career Name"
                          />
                          <input
                            type="text"
                            value={editForm.category}
                            onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="Category"
                          />
                          <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            rows="3"
                            placeholder="Description"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateCareer(career.id)}
                              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                            >
                              <FaSave /> Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                            >
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-lg">{career.name}</h3>
                          <p className="text-sm text-gray-600 mb-1">{career.category}</p>
                          <p className="text-sm text-gray-700">{career.description}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {career.roadmap && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                ✓ Roadmap
                              </span>
                            )}
                            {career.qualifications && career.qualifications.length > 0 && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                ✓ Qualifications
                              </span>
                            )}
                            {career.exams && career.exams.length > 0 && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                ✓ Exams
                              </span>
                            )}
                            {career.scholarships && career.scholarships.length > 0 && (
                              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                ✓ Scholarships
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleViewDetails(career)}
                            className="flex items-center gap-1 bg-cyan-600 text-white px-3 py-2 rounded hover:bg-cyan-700 transition text-sm"
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => handleManageRoadmap(career)}
                            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
                          >
                            <FaPlus /> Roadmap
                          </button>
                          <button
                            onClick={() => handleEditCareer(career)}
                            className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition text-sm"
                          >
                            <FaEdit /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCareer(career.id)}
                            className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition text-sm"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Users ({users.length})</h2>
            {users.length === 0 ? (
              <div className="text-center py-12 bg-blue-50 rounded-xl">
                <div className="text-6xl mb-4">👥</div>
                <p className="text-gray-600 mb-2">No users found</p>
                <p className="text-sm text-gray-500">Users will appear here after they sign up</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 text-blue-600">Name</th>
                      <th className="text-left py-3 text-blue-600">Email</th>
                      <th className="text-left py-3 text-blue-600">Current Role</th>
                      <th className="text-left py-3 text-blue-600">Joined</th>
                      <th className="text-left py-3 text-blue-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 text-gray-800">{user.name || 'N/A'}</td>
                        <td className="py-3 text-gray-600">{user.email || 'N/A'}</td>
                        <td className="py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'executive' ? 'bg-blue-100 text-blue-700' :
                            user.role === 'expert' ? 'bg-purple-100 text-purple-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </td>
                        <td className="py-3 text-gray-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td className="py-3">
                          <select
                            value={user.role || 'user'}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                          >
                            <option value="user">User</option>
                            <option value="executive">Executive</option>
                            <option value="expert">Expert</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Bookings</h2>
            <div className="space-y-3">
              {bookings.map(booking => (
                <div key={booking.id} className="border-b border-gray-200 pb-3">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800">{booking.type === 'consultation' ? 'Consultation' : 'Expert Talk'}</h3>
                      <p className="text-sm text-gray-600">Date: {new Date(booking.date).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Status: {booking.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">₹{booking.amount}</p>
                    </div>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <p className="text-gray-500 text-center py-4">No bookings yet.</p>}
            </div>
          </div>
        )}

        {activeTab === 'roadmaps' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Roadmap Purchases</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 text-blue-600">Career Roadmap</th>
                    <th className="text-left py-3 px-3 text-blue-600">User ID</th>
                    <th className="text-left py-3 px-3 text-blue-600">Amount</th>
                    <th className="text-left py-3 px-3 text-blue-600">Status</th>
                    <th className="text-left py-3 px-3 text-blue-600">Purchase Date</th>
                  </tr>
                </thead>
                <tbody>
                  {roadmaps.map(purchase => (
                    <tr key={purchase.id} className="border-b border-gray-100 hover:bg-blue-50">
                      <td className="py-3 px-3 font-semibold text-gray-800">{purchase.careerName}</td>
                      <td className="py-3 px-3 text-sm text-gray-600 font-mono">{purchase.userId?.slice(0, 10)}...</td>
                      <td className="py-3 px-3 font-bold text-blue-600">₹{purchase.amount}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          purchase.paymentStatus === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {purchase.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm text-gray-600">
                        {purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {roadmaps.length === 0 && (
                <p className="text-gray-500 text-center py-8">No roadmap purchases yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Roadmap Management Modal */}
      {showRoadmapModal && selectedCareer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Manage Roadmap: {selectedCareer.name}</h2>
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  setSelectedCareer(null);
                  setEditForm({ name: '', description: '', category: '', roadmap: '', qualifications: [], exams: [], scholarships: [] });
                }}
                className="text-gray-400 hover:text-gray-800 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-gray-800 font-semibold mb-2">Career Roadmap Content</label>
              <p className="text-gray-600 text-sm mb-4">
                Add a comprehensive roadmap for this career. You can include steps, skills, resources, and timeline.
              </p>
              <textarea
                value={editForm.roadmap || selectedCareer.roadmap || ''}
                onChange={(e) => setEditForm({...editForm, roadmap: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-mono text-sm"
                rows="15"
                placeholder={`Example roadmap format:

## Step 1: Foundation (Months 1-3)
- Learn basic concepts
- Complete online courses
- Build small projects

## Step 2: Intermediate (Months 4-6)
- Advanced topics
- Internships
- Portfolio building

## Step 3: Advanced (Months 7-12)
- Specialization
- Real-world projects
- Job preparation

## Resources:
- Course 1: [Link]
- Course 2: [Link]
- Books: [List]

## Skills Required:
- Skill 1
- Skill 2
- Skill 3`}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-gray-800 font-semibold mb-2">💡 Tips for Creating Roadmaps:</h3>
              <ul className="text-gray-700 text-sm space-y-1">
                <li>• Break down the journey into clear phases</li>
                <li>• Include specific skills and tools to learn</li>
                <li>• Add estimated timelines for each phase</li>
                <li>• Provide links to courses, books, and resources</li>
                <li>• Include practical projects and milestones</li>
                <li>• Mention certifications if applicable</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSaveRoadmap}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
              >
                <FaSave /> Save Roadmap
              </button>
              <button
                onClick={() => {
                  setShowRoadmapModal(false);
                  setSelectedCareer(null);
                  setEditForm({ name: '', description: '', category: '', roadmap: '', qualifications: [], exams: [], scholarships: [] });
                }}
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Career Details Modal */}
      {showDetailsModal && selectedCareer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">{selectedCareer.name}</h2>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedCareer(null);
                }}
                className="text-gray-400 hover:text-gray-800 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">📋 Category</h3>
                <p className="text-gray-700">{selectedCareer.category}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">📝 Description</h3>
                <p className="text-gray-700">{selectedCareer.description}</p>
              </div>

              {selectedCareer.qualifications && selectedCareer.qualifications.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-blue-600 mb-2">🎓 Education Qualifications</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {selectedCareer.qualifications.map((qual, index) => (
                      <li key={index}>{qual}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCareer.exams && selectedCareer.exams.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-purple-600 mb-2">📚 Entrance Exams & Certifications</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {selectedCareer.exams.map((exam, index) => (
                      <li key={index}>{exam}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCareer.scholarships && selectedCareer.scholarships.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-yellow-600 mb-2">💰 Scholarships Available</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    {selectedCareer.scholarships.map((scholarship, index) => (
                      <li key={index}>{scholarship}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedCareer.roadmap && (
                <div>
                  <h3 className="text-xl font-bold text-green-600 mb-2">🗺️ Roadmap Status</h3>
                  <p className="text-green-700">✓ Roadmap is available for this career</p>
                </div>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedCareer(null);
                }}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
