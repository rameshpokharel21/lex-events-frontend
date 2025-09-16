import React from "react";

const SimpleEventLogo = ({ size = "normal", className = "" }) => {
  const styles = {
    normal: "text-xl",
    large: "text-2xl",
    small: "text-lg",
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div
        className={`font-bold font-nepali text-4xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent ${styles[size]}`}
      >
        भेटाैं
      </div>
      <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
    </div>
  );
};

export default SimpleEventLogo;
