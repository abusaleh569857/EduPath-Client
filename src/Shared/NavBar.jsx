// import { useState, useEffect, useRef, useContext } from "react";
// import { NavLink, Link, useNavigate } from "react-router-dom";
// import { Menu, X, ChevronDown } from "lucide-react";
// import { FaUserTie } from "react-icons/fa";

// import { AuthContext } from "../Provider/AuthProvider";

// const ResponsiveNavbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const { user, logout } = useContext(AuthContext);
//   const { userInfo } = useContext(AuthContext);

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const toggleMenu = () => setMenuOpen(!menuOpen);
//   const closeMenu = () => setMenuOpen(false);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       closeMenu();
//       setDropdownOpen(false);
//       navigate("/login");
//     } catch (error) {
//       console.error("Logout failed:", error.message);
//     }
//   };

//   return (
//     <nav className="w-full bg-gradient-to-r from-blue-50 to-purple-100 shadow-md fixed z-50">
//       <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
//         {/* Logo */}
//         <div className="flex items-center gap-2">
//           <img src="/logo.png" alt="Logo" className="w-10 h-10" />
//           <span className="text-xl font-bold text-blue-600">EduPath</span>
//         </div>

//         {/* Desktop Navigation Links */}
//         <div className="hidden md:flex items-center gap-6 font-medium text-gray-700">
//           <NavLink
//             to="/"
//             className={({ isActive }) =>
//               isActive
//                 ? "text-purple-600 font-semibold"
//                 : "hover:text-purple-500"
//             }
//           >
//             Home
//           </NavLink>
//           <NavLink to="/courses" className="hover:text-purple-500">
//             Courses
//           </NavLink>
//           <NavLink to="/about" className="hover:text-purple-500">
//             About Us
//           </NavLink>
//           <NavLink to="/pricing" className="hover:text-purple-500">
//             Pricing
//           </NavLink>
//           <NavLink to="/contact" className="hover:text-purple-500">
//             Contact
//           </NavLink>
//         </div>

//         {/* Right Side - Auth Buttons */}
//         <div className="hidden md:flex items-center gap-3">
//           {!user ? (
//             <>
//               <NavLink
//                 to="/register"
//                 className="text-sm font-medium text-blue-700 hover:underline"
//               >
//                 Sign Up
//               </NavLink>
//               <NavLink
//                 to="/login"
//                 className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700"
//               >
//                 Login
//               </NavLink>
//             </>
//           ) : (
//             <div className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="flex items-center gap-2 hover:bg-purple-100 px-3 py-1 rounded-md"
//               >
//                 {user.photoURL ? (
//                   <img
//                     src={user.photoURL}
//                     alt="User"
//                     className="w-8 h-8 rounded-full object-cover"
//                   />
//                 ) : (
//                   <FaUserTie className="w-8 h-8 text-blue-700 bg-white rounded-full p-1" />
//                 )}
//                 <span className="text-sm font-medium text-gray-700">
//                   {userInfo?.first_name || "User"}
//                 </span>

//                 <ChevronDown className="w-4 h-4" />
//               </button>

//               {dropdownOpen && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
//                   <Link
//                     to="/dashboard"
//                     onClick={() => setDropdownOpen(false)}
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     My Courses
//                   </Link>
//                   <Link
//                     to="/leaderboard"
//                     onClick={() => setDropdownOpen(false)}
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     Leaderboard
//                   </Link>
//                   <Link
//                     to="/feedback"
//                     onClick={() => setDropdownOpen(false)}
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     Feedback
//                   </Link>
//                   <button
//                     onClick={handleLogout}
//                     className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Hamburger (Mobile) */}
//         <div className="md:hidden flex items-center">
//           <button onClick={toggleMenu}>
//             {menuOpen ? (
//               <X className="w-6 h-6 text-blue-700" />
//             ) : (
//               <Menu className="w-6 h-6 text-blue-700" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile Drawer */}
//       <div
//         className={`md:hidden fixed top-0 right-0 h-full w-3/4 bg-gradient-to-b from-blue-50 to-purple-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
//           menuOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="p-4 flex flex-col gap-4 font-medium text-gray-700">
//           <NavLink to="/" onClick={closeMenu}>
//             Home
//           </NavLink>
//           <NavLink to="/courses" onClick={closeMenu}>
//             Courses
//           </NavLink>
//           <NavLink to="/about" onClick={closeMenu}>
//             About Us
//           </NavLink>
//           <NavLink to="/pricing" onClick={closeMenu}>
//             Pricing
//           </NavLink>
//           <NavLink to="/contact" onClick={closeMenu}>
//             Contact
//           </NavLink>
//           {!user ? (
//             <>
//               <Link to="/register" onClick={closeMenu}>
//                 Sign Up
//               </Link>
//               <Link to="/login" onClick={closeMenu}>
//                 Login
//               </Link>
//             </>
//           ) : (
//             <>
//               <Link to="/dashboard" onClick={closeMenu}>
//                 My Courses
//               </Link>
//               <Link to="/leaderboard" onClick={closeMenu}>
//                 Leaderboard
//               </Link>
//               <Link to="/feedback" onClick={closeMenu}>
//                 Feedback
//               </Link>
//               <button onClick={handleLogout} className="text-red-600 text-left">
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default ResponsiveNavbar;

import { useState, useEffect, useRef, useContext } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { FaUserTie } from "react-icons/fa";
import { AuthContext } from "../Provider/AuthProvider";

const ResponsiveNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { user, logout, userInfo } = useContext(AuthContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      setDropdownOpen(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-50 to-purple-100 shadow-md fixed z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          {/* <img src="/logo.png" alt="Logo" className="w-10 h-10" /> */}
          <span className="text-xl font-bold text-blue-600">EduPath</span>
        </div>

        {/* Desktop Navigation + Search */}
        <div className="hidden md:flex items-center gap-6 font-medium text-gray-700">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-purple-600 font-semibold"
                : "hover:text-purple-500"
            }
          >
            Home
          </NavLink>
          <NavLink to="/courses" className="hover:text-purple-500">
            Courses
          </NavLink>
          <NavLink to="/about" className="hover:text-purple-500">
            About Us
          </NavLink>
          <NavLink to="/pricing" className="hover:text-purple-500">
            Pricing
          </NavLink>
          <NavLink to="/contact" className="hover:text-purple-500">
            Contact
          </NavLink>

          {/* 🔍 Search Box */}
          <div className="relative ml-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm w-52"
            />
          </div>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <NavLink
                to="/register"
                className="text-sm font-medium text-blue-700 hover:underline"
              >
                Sign Up
              </NavLink>
              <NavLink
                to="/login"
                className="bg-purple-600 text-white px-4 py-1 rounded-md text-sm hover:bg-purple-700"
              >
                Login
              </NavLink>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:bg-purple-100 px-3 py-1 rounded-md"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUserTie className="w-8 h-8 text-blue-700 bg-white rounded-full p-1" />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {userInfo?.first_name || "User"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute -right-4 mt-0 w-48 bg-gradient-to-r from-blue-50 to-purple-100 shadow-md rounded-md py-2 z-50">
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    My Courses
                  </Link>
                  <Link
                    to="/leaderboard"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Leaderboard
                  </Link>
                  <Link
                    to="/feedback"
                    onClick={() => setDropdownOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Feedback
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu}>
            {menuOpen ? (
              <X className="w-6 h-6 text-blue-700" />
            ) : (
              <Menu className="w-6 h-6 text-blue-700" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-3/4 bg-gradient-to-b from-blue-50 to-purple-100 shadow-lg transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex flex-col gap-4 font-medium text-gray-700">
          <NavLink to="/" onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to="/courses" onClick={closeMenu}>
            Courses
          </NavLink>
          <NavLink to="/about" onClick={closeMenu}>
            About Us
          </NavLink>
          <NavLink to="/pricing" onClick={closeMenu}>
            Pricing
          </NavLink>
          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>
          {!user ? (
            <>
              <Link to="/register" onClick={closeMenu}>
                Sign Up
              </Link>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" onClick={closeMenu}>
                My Courses
              </Link>
              <Link to="/leaderboard" onClick={closeMenu}>
                Leaderboard
              </Link>
              <Link to="/feedback" onClick={closeMenu}>
                Feedback
              </Link>
              <button onClick={handleLogout} className="text-red-600 text-left">
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default ResponsiveNavbar;
