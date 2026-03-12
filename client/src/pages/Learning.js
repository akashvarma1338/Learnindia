import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { toast } from 'react-toastify';

const Learning = () => {
  const { currentUser, userProfile, fetchUserProfile } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [learningContent, setLearningContent] = useState([]);

  useEffect(() => {
    if (userProfile && !userProfile.learningPreference) {
      setShowQuiz(true);
    } else if (userProfile?.learningPreference) {
      loadContent(userProfile.learningPreference);
    }
  }, [userProfile]);

  const quizQuestions = [
    {
      id: 1,
      question: 'How do you prefer to learn new concepts?',
      options: ['Watching Videos', 'Reading Articles', 'Interactive Quizzes', 'Real-life Stories']
    },
    {
      id: 2,
      question: 'What helps you remember information better?',
      options: ['Visual Diagrams', 'Written Notes', 'Practice Problems', 'Case Studies']
    },
    {
      id: 3,
      question: 'Which learning method do you enjoy most?',
      options: ['Video Tutorials', 'Text-based Learning', 'Hands-on Practice', 'Story-based Learning']
    }
  ];

  const handleQuizSubmit = async () => {
    const preferences = Object.values(quizAnswers);
    const preferenceCount = {};
    
    preferences.forEach(pref => {
      preferenceCount[pref] = (preferenceCount[pref] || 0) + 1;
    });

    const dominantPreference = Object.keys(preferenceCount).reduce((a, b) => 
      preferenceCount[a] > preferenceCount[b] ? a : b
    );

    const learningStyle = dominantPreference.includes('Video') ? 'Visual' :
                          dominantPreference.includes('Reading') || dominantPreference.includes('Text') ? 'Reading' :
                          dominantPreference.includes('Quiz') || dominantPreference.includes('Practice') ? 'Interactive' :
                          'Story-based';

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        learningPreference: learningStyle
      });
      await fetchUserProfile(currentUser.uid);
      setShowQuiz(false);
      toast.success('Learning preference saved!');
      loadContent(learningStyle);
    } catch (error) {
      toast.error('Failed to save preference');
    }
  };

  const loadContent = (preference) => {
    const contentMap = {
      'Visual': [
        { type: 'video', title: 'Introduction to BTech Careers', url: 'https://example.com/video1' },
        { type: 'video', title: 'Software Engineering Path', url: 'https://example.com/video2' },
        { type: 'infographic', title: 'Career Roadmap Visualization', url: 'https://example.com/infographic' }
      ],
      'Reading': [
        { type: 'article', title: 'Complete Guide to BTech Specializations', content: 'Detailed article content...' },
        { type: 'article', title: 'Career Opportunities in Engineering', content: 'Article content...' }
      ],
      'Interactive': [
        { type: 'quiz', title: 'Test Your Engineering Knowledge', questions: 10 },
        { type: 'quiz', title: 'Career Assessment Quiz', questions: 15 }
      ],
      'Story-based': [
        { type: 'story', title: 'From Student to Tech Lead', content: 'Success story...' },
        { type: 'story', title: 'Breaking into Data Science', content: 'Journey story...' }
      ]
    };

    setLearningContent(contentMap[preference] || []);
  };

  if (showQuiz) {
    return (
      <div className="min-h-screen bg-light py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Discover Your Learning Style</h1>
            
            {quizQuestions.map(q => (
              <div key={q.id} className="mb-6">
                <h3 className="text-lg font-semibold mb-3">{q.question}</h3>
                <div className="space-y-2">
                  {q.options.map(option => (
                    <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        onChange={(e) => setQuizAnswers({...quizAnswers, [q.id]: e.target.value})}
                        className="text-primary focus:ring-primary"
                      />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleQuizSubmit}
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              Submit & Get Personalized Content
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Personalized Learning</h1>
          <button onClick={() => setShowQuiz(true)} className="btn-secondary">
            Retake Quiz
          </button>
        </div>

        <div className="mb-6 bg-white rounded-lg shadow p-4">
          <p className="text-gray-600">Your Learning Style: <span className="font-bold text-primary">{userProfile?.learningPreference}</span></p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningContent.map((content, index) => (
            <div key={index} className="card">
              <div className="text-sm text-primary font-semibold mb-2 uppercase">{content.type}</div>
              <h3 className="text-xl font-bold mb-3">{content.title}</h3>
              {content.type === 'video' && (
                <button className="btn-primary w-full">Watch Video</button>
              )}
              {content.type === 'article' && (
                <button className="btn-secondary w-full">Read Article</button>
              )}
              {content.type === 'quiz' && (
                <div>
                  <p className="text-gray-600 mb-3">{content.questions} Questions</p>
                  <button className="btn-primary w-full">Start Quiz</button>
                </div>
              )}
              {content.type === 'story' && (
                <button className="btn-secondary w-full">Read Story</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learning;
