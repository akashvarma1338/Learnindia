import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';

const Consultation = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [topic, setTopic] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleBooking = () => {
    if (!currentUser) {
      toast.error('Please login to book consultation');
      navigate('/login');
      return;
    }

    if (!selectedTime || !topic) {
      toast.error('Please select time and enter topic');
      return;
    }

    const bookingData = {
      date: selectedDate.toISOString(),
      time: selectedTime,
      topic: topic,
      amount: 100
    };

    navigate('/payment/consultation', { state: bookingData });
  };

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Book Executive Consultation</h1>
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Select Date</h2>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                minDate={new Date()}
                className="w-full border-none shadow-md rounded-lg"
              />
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">Select Time Slot</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
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

              <h2 className="text-2xl font-bold mb-4">Consultation Topic</h2>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What would you like to discuss?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                rows="4"
              />
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-600">Selected Date: <span className="font-semibold">{selectedDate.toDateString()}</span></p>
                <p className="text-gray-600">Selected Time: <span className="font-semibold">{selectedTime || 'Not selected'}</span></p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Amount</p>
                <p className="text-3xl font-bold text-primary">₹100</p>
              </div>
            </div>
            <button onClick={handleBooking} className="btn-primary w-full text-lg py-3">
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Consultation;
