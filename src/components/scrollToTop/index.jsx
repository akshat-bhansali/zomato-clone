import React from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollToTopButton = () => {
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCartClick = () => {
    console.log("Cart clicked");
  };
  const handleViewMenu = () => {
    console.log("Menu clicked");
  };
  const handleCancel = () => {
    console.log("Cancel clicked");
  };

  return (
    <div className="flex">
      <div className="fixed bottom-10 left-10 z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
        <div className="flex justify-between text-sm text-black">
          {/* menu */}
          <div className="flex">
            <img src="./banner.jpg" className="w-8 h-8 mt-3 rounded-lg" />
            <div className="flex flex-col mt-2 m-2">
              <div className="text-start">Restaurant Name</div>
              <div className="flex items-center">
                <div>1 Item</div>
                <div className="m-1 bg-gray-200 rounded-full w-[2px] h-4"></div>
                <button onClick={handleViewMenu}>View Menu &#8594;</button>
              </div>
            </div>
          </div>
          {/* cart */}
          <button
            className="bg-red-500 p-2 flex flex-col items-center rounded-md mx-2"
            onClick={handleCartClick}
          >
            <div className="text-white">₹133</div>
            <div className="ml-2 text-white">View Cart</div>
          </button>
          {/* cancel */}
          <button onClick={handleCancel} className="bg-gray-200 rounded-lg w-6 h-6 self-center">&times;</button>
        </div>
      </div>
      <button
        onClick={handleScrollToTop}
        className="fixed bottom-10 text-5xl right-10 z-10 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <FaArrowUp />
      </button>
    </div>
  );
};

export default ScrollToTopButton;
