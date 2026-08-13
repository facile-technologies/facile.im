import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-md flex flex-col items-center justify-center z-[999]">
      <div className="h-12 w-12 border-4 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
      <p className="text-white text-sm mt-4 tracking-wide">Please wait...</p>
    </div>
  );
};

export default Loader;
