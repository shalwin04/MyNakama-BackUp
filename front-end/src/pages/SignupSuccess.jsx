import { Link, useNavigate } from "react-router-dom";
import LoginImg from "../images/LoginImg.png";
import Logo from "../images/My-Nakama-Logo.png";

const SignupSuccess = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="h-screen bg-citrine-white overflow-hidden">
      <header className="flex items-center justify-between w-full p-4 bg-citrine-white shadow-md">
        <div className="flex items-center pl-8">
          <img
            src={Logo}
            alt="Logo"
            className="h-12 mr-2"
            onClick={handleClick}
          />
          <h1 className="text-2xl font-playfair font-bold text-gray-800">
            My Nakama
          </h1>
        </div>
        <nav className="flex items-center space-x-8 pr-16">
          <Link to="/login" className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900">Login</Link>
          <Link
            to="/blogs"
            className="nav-link text-lg font-lora text-gray-600 hover:text-gray-800"
          >
            Blogs
          </Link>
        </nav>
      </header>
      <div className="flex h-screen bg-citrine-white">
        <div className="w-1/2 flex items-center justify-center p-8">
          <div className="max-w-md w-full p-4 overflow-y-scroll h-3/4 scrollbar-hide mt-40">
            <h1 className="text-5xl font-playfair italic text-espresso mb-6">
              Almost there!
            </h1>
            <p className="font-libre-baskerville mb-6">
              Please check your email for a confirmation link to complete your registration. 
            </p>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center p-8">
            <img
              src={LoginImg}
              alt="Login illustration"
              className="w-full max-w-md"
            />
          </div>
      </div>
    </div>
  );
};

export default SignupSuccess;
