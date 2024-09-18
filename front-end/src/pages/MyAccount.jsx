import React from "react";
import AccountIcon from "../images/account.png"; // Replace with your account icon
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUserId } from "../redux/userSlice";

const MyAccount = () => {
  // const [showMenu, setShowMenu] = useState(false);
  // const menuRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target)) {
  //       setShowMenu(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  // const toggleMenu = () => {
  //   setShowMenu(!showMenu);
  // };

  const handleLogout = async () => {
    try {
      const response = await axios.post("https://my-nakama-backend.onrender.com/api/logout");

      if (response.status === 200) {
        console.log("User logged out");
        // Clear any authentication data, if stored locally (e.g., tokens)
        dispatch(clearUserId());
        // Redirect to login page or home page after successful logout
        navigate('/login');
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // const handleProfile = () => {
  //   navigate('/profile');
  // };

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="myaccount"
            src={AccountIcon} />
        </div>
      </div>
      <ul
        tabIndex={0}
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li>
          <Link to="/profile" className="justify-between">
            Profile
            <span className="badge">New</span>
          </Link>
        </li>
        <li><Link>Settings</Link></li>
        <li><Link onClick={handleLogout}>Logout</Link></li>
      </ul>
    </div>
  );
};

export default MyAccount;
