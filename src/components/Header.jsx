import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={`
      bg-white w-full fixed top-0 left-0 right-0
      transition-all duration-300 ease-in-out z-40
      ${isScrolled ? 'shadow-md' : 'shadow-sm'}
    `}>
      <div className="px-4 py-3 lg:px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleSidebar}
            className="
              p-2 rounded-lg text-gray-600
              hover:bg-gray-100 focus:outline-none
              transition-transform duration-300 ease-in-out
              transform hover:scale-105
              lg:hidden
            "
            aria-label="Toggle Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h2 className="text-xl font-semibold text-blue-600 truncate">
            Leader Admin Panel
          </h2>
        </div>

        <div className="flex items-center space-x-4" ref={profileMenuRef}>
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="
                flex items-center space-x-2 p-2 rounded-lg
                hover:bg-gray-100 focus:outline-none
                transition-all duration-300 ease-in-out
              "
            >
              <div className="
                w-8 h-8 rounded-full bg-blue-600
                flex items-center justify-center text-white
                transform transition-transform duration-300
                hover:scale-105
              ">
                <span>LP</span>
              </div>
              <span className="hidden md:block text-gray-700 font-medium">
                Leader Name
              </span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`
                  h-5 w-5 text-gray-500
                  transition-transform duration-300
                  ${showProfileMenu ? 'rotate-180' : ''}
                `}
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            {showProfileMenu && (
              <div className="
                absolute right-0 mt-2 w-48 bg-white rounded-lg
                shadow-lg py-1 z-50
                transform origin-top-right
                transition-all duration-300 ease-in-out
                animate-fadeIn
              ">
                <Link 
                  to="/leader/profile" 
                  className="
                    block px-4 py-2 text-sm text-gray-700
                    hover:bg-blue-50 transition-colors duration-200
                    first:rounded-t-lg
                  "
                >
                  Profile Settings
                </Link>
                <Link 
                  to="/logout" 
                  className="
                    block px-4 py-2 text-sm text-red-600
                    hover:bg-red-50 transition-colors duration-200
                    last:rounded-b-lg
                  "
                >
                  Logout
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;