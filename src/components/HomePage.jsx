import { useNavigate } from "react-router-dom"


const HomePage = () => {

    const navigate = useNavigate();


  return (
    <div>
      <div className="min-h-screen p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400">
      <div className="max-w-4xl mx-auto bg-white bg-opacity-10 backdrop-blur-md rounded-xl p-4 md:p-6 shadow-lg text-gray">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4 md:mb-6 text-center">
          Welcome to Bhetau Event Hub!
        </h2>
        
        <div className="p-4 md:p-8 font-sans leading-relaxed text-gray-800">
          <p className="text-base md:text-lg mb-3 md:mb-4">
            Step into the home page of our event sharing app—a vibrant space
            designed to keep you connected, inspired, and in control. Whether
            you're browsing for exciting happenings or ready to host your own,
            everything starts here.
          </p>

          <h3 className="text-lg md:text-xl font-bold mt-4 md:mt-6 mb-2 md:mb-3 text-gray-700">
            🚀 Getting Started:
          </h3>
          <ul className="list-disc pl-4 md:pl-6 mb-3 md:mb-4 space-y-2">
            <li>
              <strong>Register/SignUp:</strong> If you haven't signed up before,
                Please register using your email.
            </li>
            <li>
              <strong>Login:</strong>Login using your credentials.
            </li>
          </ul>

          <h3 className="text-lg md:text-xl font-bold mt-4 md:mt-6 mb-2 md:mb-3 text-gray-700">
            ✨ What You Can Do:
          </h3>
          <ul className="list-disc pl-4 md:pl-6 mb-3 md:mb-4 space-y-2">
            <li>
              <strong>Discover Events:</strong> Instantly view a curated list of
              upcoming events tailored to your interests.
            </li>
            <li>
              <strong>Share Your Event:</strong> Got something special to share?
              Start by verifying your email—it's quick and secure. Once
              verified, you'll be guided straight to our intuitive event
              creation form.
            </li>
          </ul>

          <p className="text-base md:text-lg font-medium mt-4 md:mt-6">
            So go ahead—explore, create, and connect. Your next great event
            starts right here.
          </p>
        </div>
        <div className="flex flex-row justify-center gap-4 mt-6">
            <button
                className="px-4 py-2 bg-green-300 text-white font-semibold rounded hover:bg-green-400 text-center"
                onClick={() => navigate("/login")}
                >
                Login
            </button>
            <button
                className="px-4 py-2 bg-blue-300 text-white font-semibold rounded hover:bg-blue-400 text-center"
                onClick={() => navigate("/register")}
                >
                Register
            </button>
        </div>
        
      </div>
    </div>
    </div>
  )
}

export default HomePage
