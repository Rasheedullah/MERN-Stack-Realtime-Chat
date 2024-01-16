import React, { useState, useEffect } from 'react';
import './TypingIndicator.css'; // Import your CSS file for styling

const TypingIndicator = () => {
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000); // Adjust the timeout duration as needed

    return () => clearTimeout(typingTimeout);
  }, [isTyping]);

  // Simulate typing when the component mounts
  useEffect(() => {
    // setIsTyping(true);
  }, []);

  return (
    <div className={`typing-indicator ${isTyping ? 'active' : ''}`}>
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );
};

export default TypingIndicator;
