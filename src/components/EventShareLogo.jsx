const EventShareLogo = ({ className = "", size = "medium" }) => {
  const sizeStyles = {
    small: "text-2xl",
    medium: "text-3xl md:text-4xl",
    large: "text-4xl md:text-5xl"
  };

  return (
    <div className={`inline-flex items-center ${className}`}>
      <div
        className={`font-bold font-nepali ${sizeStyles[size]} bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent leading-tight`}
      >
        भेटौं
      </div>
      <div className="ml-1 md:ml-2 w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
    </div>
  );
};

export default EventShareLogo;

