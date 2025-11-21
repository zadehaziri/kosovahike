import React, { useState } from 'react';
import './chathelper.scss';

const HikingChatbot = () => {
  const [showChat, setShowChat] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showReloadingScreen, setShowReloadingScreen] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const hikingFAQs = [
    {
      question: 'What is hiking?',
      answer: 'Hiking is a recreational activity that involves walking on trails or paths, typically in natural environments such as forests, mountains, or countryside. It is a popular outdoor activity enjoyed by people of all ages and fitness levels.',
    },
    {
      question: 'Hiking gear recommendations',
      answer: 'When it comes to hiking gear, it is essential to choose equipment that is suitable for the terrain and weather conditions. Some basic gear recommendations include comfortable and sturdy hiking boots, moisture-wicking socks, appropriate clothing layers, a backpack to carry essentials such as water, snacks, a first aid kit, navigation tools like a map and compass, sun protection such as a hat and sunscreen, and depending on the location, additional items like bear spray or insect repellent.',
    },
    {
      question: 'How do I choose the right hiking trail?',
      answer: 'When choosing a hiking trail, consider factors such as your fitness level, the length and difficulty of the trail, the terrain, and the weather conditions. Start with shorter and easier trails if you are a beginner, and gradually increase the difficulty as you gain experience. Research trail guides and reviews to find trails that match your preferences and abilities.',
    },
    {
      question: 'What\'s a hiking buddy?',
      answer: 'A hiking buddy is someone who accompanies you on your hiking trips. Having a hiking buddy can enhance safety, provide companionship, and offer assistance in case of emergencies. It\'s always a good idea to hike with a partner or a group, especially on more challenging trails or in remote areas.',
    },
    {
      question: 'What safety precautions should I take while hiking?',
      answer: 'Before heading out on a hike, make sure to inform someone of your plans, including your intended route and expected return time. Always carry essential safety gear, such as a map, compass, or GPS device, a fully charged cellphone, a first aid kit, and extra food and water. Stay on marked trails, be aware of your surroundings, and watch out for wildlife. In case of an emergency, stay calm, assess the situation, and know how to signal for help.',
    },
    {
      question: 'Other question ?',
      answer: 'If you have any further inquiries, feel free to reach out to us at hello@kosovahike.com. Were here to help!',
    },
  ];

  const toggleChat = () => {
    setShowChat(!showChat);
    setSelectedQuestion(null);
  };

  const handleQuestionClick = (index) => {
    setShowReloadingScreen(true);
    setTimeout(() => {
      setSelectedQuestion(index);
      setShowReloadingScreen(false);
    }, 500);
  };

  const handleFeedback = (isHelpful) => {
    setFeedback(isHelpful);
  };

  return (
    <div className='hiking-chatbot'>
      {!showChat && (
        <div className='chat-icon-button' onClick={toggleChat}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
      {showChat && (
        <>
          <div className='hiking-chat-window'>
            <div className='hiking-header'>
              <div className='hiking-title'>Commonly asked questions</div>
              <div className='hiking-close' onClick={toggleChat}>X</div>
            </div>
            <div className='hiking-conversation'>
              {selectedQuestion === null ? (
                hikingFAQs.map((faq, index) => (
                  <div className='hiking-question' key={index} onClick={() => handleQuestionClick(index)}>
                    {faq.question}
                  </div>
                ))
              ) : (
                <div>
                  <div className='hiking-answer'>{hikingFAQs[selectedQuestion].answer}</div>
                  {showReloadingScreen && <div className='hiking-reloading-screen'>Loading...</div>}
                  {feedback === null && (
                    <div className='feedback-buttons'>
                      <button onClick={() => handleFeedback(true)}>👍 Helpful</button>
                      <button onClick={() => handleFeedback(false)}>👎 Not Helpful</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HikingChatbot;
