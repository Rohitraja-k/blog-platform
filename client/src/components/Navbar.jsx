import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  PenSquare,
  LogOut,
  User,
  Home,
  Compass,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    user?.name || 'User'
  )}&backgroundColor=2563eb&textColor=ffffff`;

  return (
    <header className="navbar-wrapper">
      <div className="navbar">
        {/* Brand */}
        <Link to="/" className="brand-logo" id="brand-logo">
          <div className="brand-icon-box">
            <Sparkles size={20} />
          </div>
          <span>Ink<span className="accent">&</span>Echo</span>
        </Link>

        {/* Navigation links & Actions */}
        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            id="nav-home"
          >
            <Home size={17} />
            <span>Home</span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/create-post"
                className={`btn btn-primary btn-sm ${
                  location.pathname === '/create-post' ? 'active' : ''
                }`}
                id="nav-create-post"
              >
                <PenSquare size={16} />
                <span>Write Post</span>
              </Link>

              {/* User Avatar & Dropdown */}
              <div className="user-nav-dropdown" ref={dropdownRef}>
                <button
                  type="button"
                  className="user-avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="user-menu-button"
                  aria-expanded={dropdownOpen}
                >
                  <img
                    src={user?.avatar || defaultAvatar}
                    alt={user?.name || 'User'}
                    className="avatar-img"
                  />
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} color="var(--text-muted)" />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown-menu" id="user-dropdown-menu">
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{user?.name}</div>
                      <div className="dropdown-user-email">{user?.email}</div>
                    </div>

                    <Link
                      to="/profile"
                      className="dropdown-item"
                      id="dropdown-profile-link"
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/create-post"
                      className="dropdown-item"
                      id="dropdown-create-link"
                    >
                      <PenSquare size={16} />
                      <span>Create New Post</span>
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="dropdown-item danger"
                      id="dropdown-logout-btn"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm" id="nav-login-btn">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
