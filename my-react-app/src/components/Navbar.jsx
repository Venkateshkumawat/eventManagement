import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, HeartHandshake } from 'lucide-react';
import { useAuth } from '../context/authContext';
import axios from 'axios';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); // ✅ local role state

  const navigate = useNavigate();
  const { isLoggedIn, logout, API_BASE_URL } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleProfile = () => setProfileOpen(!profileOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      alert('Are you sure you want to logout?');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ✅ Fetch user role only if logged in
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          withCredentials: true,
        });
        setUserRole(res.data.role); // e.g., 'volunteer', 'admin'
      } catch (error) {
        console.error('Failed to fetch user role:', error);
        setUserRole(null);
      }
    };

    if (isLoggedIn) fetchUserRole();
  }, [isLoggedIn, API_BASE_URL]);

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-wide hover:text-gray-200 transition">
          <HeartHandshake className="w-7 h-7 text-red-500" />
          VolunteerHub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 bg-purple-800 px-6 py-2 rounded-xl">
          <Link to="/" className="hover:text-gray-200 font-medium">Home</Link>
          <Link to="/event" className="hover:text-gray-200 font-medium">Events</Link>
          <Link to="/contact" className="hover:text-gray-200 font-medium">Contact</Link>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={toggleProfile}
              className="flex items-center gap-2 bg-white text-pink-600 px-2 py-1.5 rounded-full hover:bg-gray-100 transition"
            >
              <User className="w-5 h-5" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white text-gray-800 rounded-md shadow-md z-10">
                {!isLoggedIn ? (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/login');
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    🔐 Login
                  </button>
                ) : (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      👤 My Profile
                    </Link>

                    {/* ✅ Volunteer-only option */}
                    {userRole === 'volunteer' && (
                      <Link
                        to="/myevent"
                        onClick={() => setProfileOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        
                        📋 My Events
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      🚪 Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2 bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 rounded-b-xl">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-white font-medium hover:text-gray-200">Home</Link>
          <Link to="/event" onClick={() => setIsOpen(false)} className="block text-white font-medium hover:text-gray-200">Events</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-white font-medium hover:text-gray-200">Contact</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
