import React from "react";
import claude from "../gifs/claude.gif";
import Logo from "../images/My-Nakama-Logo.png";
import { Link } from "react-router-dom";
import { Typewriter } from 'react-simple-typewriter';

const Login = () => {
  
  // const [showHeader, setShowHeader] = useState(true);
  // let lastScrollY = window.pageYOffset;
  // // const svgRef = useRef(null);
  // // const ellipsePathRef = useRef(null);

  // useEffect(() => {
  // //   // const animateStars = () => {
  // //   //   const stars = document.querySelectorAll(".star");
  // //   //   const ellipsePath = document.querySelector("#ellipsePath");
  // //   //   // const ellipsePath = ellipsePathRef.current;
  // //   //   const pathLength = ellipsePath.getTotalLength();

  // //   //   stars.forEach((star, index) => {
  // //   //     // let startOffset = index * (pathLength / stars.length);

  // //   //     // const animate = () => {
  // //   //     //   startOffset = (startOffset + 1) % pathLength;
  // //   //     //   const point = ellipsePath.getPointAtLength(startOffset);

  // //   //     //   star.setAttribute("transform", `translate(${point.x},${point.y})`);
  // //   //     //   requestAnimationFrame(animate);
  // //   //     // };

  // //   //     // animate();
  // //   //   });
  // //   };

  //   const handleScroll = () => {
  //     const currentScrollY = window.pageYOffset;
  //     if (currentScrollY > lastScrollY) {
  //       setShowHeader(false);
  //     } else {
  //       setShowHeader(true);
  //     }
  //     lastScrollY = ;
  //   };

  // //   window.addEventListener("scroll", handleScroll);

  // //   const startAnimation = () => {
  // //       requestAnimationFrame(animateStars);
  // //   };

  // //   if (document.readyState === "complete") {
  // //     startAnimation();
  // //   } else {
  // //     window.addEventListener("load", startAnimation);
  // //   }

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  // //     window.removeEventListener("load", startAnimation);
  //   };
  // }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <header className={`fixed top-0 left-0 right-0 z-10 flex items-center overflow-hidden justify-between w-full p-4 bg-transparent transition-transform duration-300 ease-in-out`}>
        <div className="flex items-center pl-8">
          <img src={Logo} alt="Logo" className="h-12 mr-2" />
          <h1 className="text-2xl font-playfair font-bold text-gray-800">MY NAKAMA</h1>
        </div>
        <nav className="flex items-center space-x-8 pr-16">
          <Link to="/blogs" className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900">Blogs</Link>
          <Link to="/login" className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900">Login</Link>
          <Link to="/signup" className="nav-link text-lg font-lora text-gray-800 hover:text-gray-900">Sign Up</Link>
        </nav>
      </header>

      <div className="bg-gradient-to-r from-purple-200 via-pink-300 to-red-200 min-h-screen flex flex-col">
        <div className="flex flex-1 p-6">
          <div className="flex flex-col justify-center items-start w-1/2 pl-32 relative">
            <h1 className="relative text-8xl font-playfair text-white tracking-tight italic mb-4">my nakama</h1>
            <svg className="absolute inset-0 transform rotate-[60deg] w-full h-full pointer-events-none" viewBox="0 0 800 400">
              <defs>
                <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="100%">
                  <stop offset="0%" style={{ stopColor: "white", stopOpacity: 0.4 }} />
                  <stop offset="100%" style={{ stopColor: "white", stopOpacity: 0.4 }} />
                </linearGradient>
              </defs>
              <ellipse id="ellipsePath" cx="310" cy="300" rx="220" ry="90" stroke="url(#whiteGradient)" strokeWidth="3" fill="none" transform="rotate(155 350 222)" />
            </svg>
            <div className="text-container">
              <p className="text-xl font-chivo italic tracking-widest font-bold text-white mb-8">
                  <Typewriter
              words={["Your Mental Health Companion"]}
              loop={20}
              cursor
              cursorStyle='_'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
              </p>
            </div>
            <div className="flex space-x-4 mt-8">
              <Link to="/login" className="bg-black text-white px-6 py-2 rounded-lg text-lg font-playfair hover:bg-gray-800 hover:text-white transition duration-300 ease-in-out">Try now</Link>
              <Link to="/blogs" className="bg-white text-black px-6 py-2 rounded-lg border border-black text-lg font-playfair hover:bg-gray-200 hover:text-black transition duration-300 ease-in-out">Blogs</Link>
            </div>
          </div>
          <div className="flex items-center justify-center w-1/2">
            <img src={claude} alt="Companion GIF" className="w-full max-w-md" />
          </div>
        </div>
        {/* <div className="flex items-center justify-center mb-2">
          <div className="text-2xl italic font-playfair text-center">
            <Typewriter
              words={["It's okay to not be okay", "You're heard", "You're Loved"]}
              loop={5}
              cursor
              cursorStyle='_'
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={1000}
            />
          </div>
        </div> */}
        {/* Decorative shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-20 w-48 h-48 bg-yellow-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-10 right-20 w-64 h-64 bg-blue-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-green-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-40 h-40 bg-red-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-pink-400 rounded-full opacity-20 blur-3xl"></div>
          {/* Rotating four-edged star shapes */}
          <svg className="absolute star" viewBox="0 0 100 100" width="25" height="25">
            <polygon points="50,15 61,50 50,85 39,50" fill="white" opacity="0.6" />
            <polygon points="15,50 50,61 85,50 50,39" fill="white" opacity="0.6" />
          </svg>
          <svg className="absolute star" viewBox="0 0 100 100" width="25" height="25">
            <polygon points="50,15 61,50 50,85 39,50" fill="white" opacity="0.6" />
            <polygon points="15,50 50,61 85,50 50,39" fill="white" opacity="0.6" />
          </svg>
          <svg className="absolute star" viewBox="0 0 100 100" width="25" height="25">
            <polygon points="50,15 61,50 50,85 39,50" fill="white" opacity="0.6" />
            <polygon points="15,50 50,61 85,50 50,39" fill="white" opacity="0.6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Login;
