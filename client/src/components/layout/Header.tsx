import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User, CheckSquare } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <CheckSquare className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">TaskFlow</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Tasks
                </Link>
                <div className="relative ml-4" ref={profileDropdownRef}>
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    <span className="mr-1">{user.name}</span>
                    <User className="h-4 w-4" />
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/tasks"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tasks
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex w-full px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-2" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
