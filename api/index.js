const express = require('express');
const cors = require('cors');
const chatbotRoutes = require('../server/routes/chatbot');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Learn India API Server' });
});

app.use('/api', chatbotRoutes);

app.get('/api/careers', async (req, res) => {
  try {
    res.json({ message: 'Careers endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    res.json({ message: 'Booking created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payment/initiate', async (req, res) => {
  try {
    res.json({ message: 'Payment initiated', orderId: 'ORDER_' + Date.now() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/payment/verify', async (req, res) => {
  try {
    res.json({ message: 'Payment verified', status: 'success' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/meeting/create', async (req, res) => {
  try {
    res.json({ 
      message: 'Meeting created', 
      meetingLink: 'https://meet.example.com/meeting-' + Date.now() 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
