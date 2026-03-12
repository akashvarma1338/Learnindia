const express = require('express');
const router = express.Router();

// Using Hugging Face Inference API (Free)
const HUGGINGFACE_API = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

router.post('/chatbot', async (req, res) => {
  try {
    const { message, careerName } = req.body;

    // Create context-aware prompt
    const prompt = `You are a helpful career guidance assistant specializing in ${careerName}. Answer the following question professionally and concisely:\n\nQuestion: ${message}\n\nAnswer:`;

    // Call Hugging Face API (No API key needed for public models)
    const response = await fetch(HUGGINGFACE_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_length: 200,
          temperature: 0.7,
          top_p: 0.9,
        }
      })
    });

    const data = await response.json();
    
    let reply = '';
    if (data && data[0] && data[0].generated_text) {
      reply = data[0].generated_text.replace(prompt, '').trim();
    } else {
      // Fallback responses based on common questions
      reply = getFallbackResponse(message, careerName);
    }

    res.json({ reply });
  } catch (error) {
    console.error('Chatbot error:', error);
    const { message, careerName } = req.body;
    res.json({ reply: getFallbackResponse(message, careerName) });
  }
});

// Fallback responses for common questions
function getFallbackResponse(message, careerName) {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
    return `For ${careerName}, focus on building both technical and soft skills. Start with foundational knowledge, practice regularly through projects, and stay updated with industry trends. Consider online courses, certifications, and hands-on experience through internships.`;
  }
  
  if (lowerMessage.includes('salary') || lowerMessage.includes('pay')) {
    return `Salaries in ${careerName} vary based on experience, location, and company size. Entry-level positions typically start at ₹3-6 LPA in India, while experienced professionals can earn ₹15-40 LPA or more. Top companies and specialized roles offer even higher compensation.`;
  }
  
  if (lowerMessage.includes('course') || lowerMessage.includes('study')) {
    return `To pursue ${careerName}, you can explore various educational paths including degree programs, online courses, bootcamps, and certifications. Popular platforms include Coursera, Udemy, edX, and specialized training institutes. Choose based on your current level and career goals.`;
  }
  
  if (lowerMessage.includes('job') || lowerMessage.includes('opportunity')) {
    return `${careerName} offers diverse job opportunities across industries. Build a strong portfolio, network with professionals, apply through job portals like LinkedIn, Naukri, and company websites. Internships and freelancing can help you gain initial experience.`;
  }
  
  if (lowerMessage.includes('exam') || lowerMessage.includes('entrance')) {
    return `For ${careerName}, entrance exams and certifications vary by specialization. Research specific requirements for your target colleges or certifications. Prepare thoroughly using standard textbooks, online resources, and mock tests.`;
  }

  if (lowerMessage.includes('start') || lowerMessage.includes('begin')) {
    return `To start your journey in ${careerName}, first understand the basics and required qualifications. Create a learning roadmap, set clear goals, and begin with foundational courses. Practice consistently and build projects to demonstrate your skills.`;
  }

  return `Great question about ${careerName}! I recommend checking the detailed roadmap provided above for comprehensive guidance. You can also explore online resources, connect with professionals in the field, and consider joining relevant communities for more insights.`;
}

module.exports = router;
