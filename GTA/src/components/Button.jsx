import React from 'react';

const Button = ({ children, onClick, className = "", style = {} }) => {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 text-base font-bold text-black bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors border-none cursor-pointer ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;