const EventShareLogo = ({ className = "", size = "medium" }) => {
  const sizeStyles = {
    small: "text-xl",
    medium: "text-2xl md:text-3xl",
    large: "text-3xl md:text-4xl"
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div
        className={`font-bold font-sans ${sizeStyles[size]} bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight`}
      >
        EventHub
      </div>
      <div className="ml-1 md:ml-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
    </div>
  );
};

export default EventShareLogo;

