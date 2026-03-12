const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const chatbotRoutes = require('./routes/chatbot');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Learn India API Server' });
});

// Chatbot routes
app.use('/api', chatbotRoutes);

// Career routes
app.get('/api/careers', async (req, res) => {
  try {
    // Fetch careers from Firebase
    res.json({ message: 'Careers endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Booking routes
app.post('/api/bookings', async (req, res) => {
  try {
    // Create booking in Firebase
    res.json({ message: 'Booking created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Payment routes (placeholder)
app.post('/api/payment/initiate', async (req, res) => {
  try {
    // Integrate with payment gateway (Razorpay, Paytm, etc.)
    res.json({ message: 'Payment initiated', orderId: 'ORDER_' + Date.now() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  try {
    // Verify payment
    res.json({ message: 'Payment verified', status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Video call routes (placeholder)
app.post('/api/meeting/create', async (req, res) => {
  try {
    // Create Zoom/Jitsi meeting
    res.json({ 
      message: 'Meeting created', 
      meetingLink: 'https://meet.example.com/meeting-' + Date.now() 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
