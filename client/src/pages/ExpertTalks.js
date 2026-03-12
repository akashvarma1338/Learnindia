import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import { toast } from 'react-toastify';

const ExpertTalks = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const expertsQuery = query(collection(db, 'users'), where('role', '==', 'expert'));
      const expertsSnap = await getDocs(expertsQuery);
      setExperts(expertsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!currentUser) {
      toast.error('Please login to book expert talk');
      navigate('/login');
      return;
    }

    if (!selectedExpert || !selectedTime) {
      toast.error('Please select expert and time slot');
      return;
    }

    const bookingData = {
      expertId: selectedExpert.id,
      expertName: selectedExpert.name,
      date: selectedDate.toISOString(),
      time: selectedTime,
      amount: 500
    };

    navigate('/payment/expert', { state: bookingData });
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading experts...</div>;
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Talk to Industry Experts</h1>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {experts.map(expert => (
              <div
                key={expert.id}
                onClick={() => setSelectedExpert(expert)}
                className={`card cursor-pointer transition ${
                  selectedExpert?.id === expert.id ? 'ring-4 ring-primary' : ''
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{expert.name}</h3>
                <p className="text-gray-600 mb-2">{expert.expertise}</p>
                <p className="text-sm text-gray-500">{expert.experience} years experience</p>
                <p className="text-primary font-bold mt-3">₹500 / session</p>
              </div>
            ))}
          </div>

          {selectedExpert && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6">Book Session with {selectedExpert.name}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Select Date</h3>
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    minDate={new Date()}
                    className="w-full border-none shadow-md rounded-lg"
                  />
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Select Time Slot</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-4 rounded-lg border-2 transition ${
                          selectedTime === time
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t pt-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-gray-600">Expert: <span className="font-semibold">{selectedExpert.name}</span></p>
                    <p className="text-gray-600">Date: <span className="font-semibold">{selectedDate.toDateString()}</span></p>
                    <p className="text-gray-600">Time: <span className="font-semibold">{selectedTime || 'Not selected'}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600">Amount</p>
                    <p className="text-3xl font-bold text-primary">₹500</p>
                  </div>
                </div>
                <button onClick={handleBooking} className="btn-primary w-full text-lg py-3">
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpertTalks;
