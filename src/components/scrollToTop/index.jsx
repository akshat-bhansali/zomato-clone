import React from 'react';
import { FaArrowUp } from 'react-icons/fa'; 

const ScrollToTopButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' 
    });
  };

  return (
    <button
      onClick={handleScrollToTop}
      className="fixed bottom-10 right-10 z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollToTopButton;
