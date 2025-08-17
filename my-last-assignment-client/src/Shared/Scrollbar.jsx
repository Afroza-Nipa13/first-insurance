import React from 'react';
import { FaArrowUp } from 'react-icons/fa';

const Scrollbar = () => {
    const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
    return (
         <button
      onClick={handleScrollToTop}
      className="fixed bottom-4 right-4 cursor-pointer   bg-radial-[at_25%_25%] from-[#f299c0] to-[#851143] to-75% hover:bg-[#6c0e36] text-white lg:p-3 p-1 rounded-full shadow-lg transition-all z-50"
      title="Scroll to top"
    >
      <FaArrowUp size={20} />
    </button>
    );
};

export default Scrollbar;