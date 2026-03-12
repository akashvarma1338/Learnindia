import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Payment = () => {
  const { type, id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [processing, setProcessing] = useState(false);

  const bookingData = location.state || {};

  const handlePayment = async () => {
    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (type === 'roadmap') {
        await addDoc(collection(db, 'purchases'), {
          userId: currentUser.uid,
          type: 'roadmap',
          careerId: id,
          careerName: bookingData.careerName,
          amount: bookingData.amount,
          purchaseDate: new Date().toISOString(),
          paymentStatus: 'completed'
        });
      } else if (type === 'consultation' || type === 'expert') {
        await addDoc(collection(db, 'bookings'), {
          userId: currentUser.uid,
          type: type,
          date: bookingData.date,
          time: bookingData.time,
          amount: bookingData.amount,
          status: 'confirmed',
          expertId: bookingData.expertId || null,
          expertName: bookingData.expertName || null,
          topic: bookingData.topic || null,
          meetingLink: null,
          createdAt: new Date().toISOString()
        });
      }

      toast.success('Payment successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Payment failed: ' + error.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Payment</h2>
          
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            {type === 'roadmap' && (
              <p className="text-gray-600">Career Roadmap: {bookingData.careerName}</p>
            )}
            {type === 'consultation' && (
              <>
                <p className="text-gray-600">Executive Consultation</p>
                <p className="text-sm text-gray-500">Date: {new Date(bookingData.date).toDateString()}</p>
                <p className="text-sm text-gray-500">Time: {bookingData.time}</p>
              </>
            )}
            {type === 'expert' && (
              <>
                <p className="text-gray-600">Expert Talk with {bookingData.expertName}</p>
                <p className="text-sm text-gray-500">Date: {new Date(bookingData.date).toDateString()}</p>
                <p className="text-sm text-gray-500">Time: {bookingData.time}</p>
              </>
            )}
            <p className="text-2xl font-bold text-primary mt-3">₹{bookingData.amount}</p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-3">Payment Method</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" defaultChecked className="text-primary" />
                <span>UPI</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" className="text-primary" />
                <span>Credit/Debit Card</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="radio" name="payment" className="text-primary" />
                <span>Net Banking</span>
              </label>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is a placeholder payment page. In production, integrate with Razorpay, Paytm, or other payment gateways.
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={processing}
            className="btn-primary w-full text-lg py-3 disabled:opacity-50"
          >
            {processing ? 'Processing...' : `Pay ₹${bookingData.amount}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
