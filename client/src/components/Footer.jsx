import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Brand & mission */}
        <div className="footer-brand">
          <Link to="/" className="brand-logo" style={{ marginBottom: '0.75rem', display: 'inline-flex' }}>
            <div className="brand-icon-box" style={{ width: '32px', height: '32px' }}>
              <Sparkles size={16} />
            </div>
            <span>Ink<span className="accent">&</span>Echo</span>
          </Link>
          <p>
            A modern, high-performance publishing platform crafted for thinkers, developers, and creators to share ideas that shape tomorrow.
          </p>
        </div>

        {/* Explore Links */}
        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link to="/?category=Web Development">Web Development</Link></li>
            <li><Link to="/?category=Technology">Technology & Cloud</Link></li>
            <li><Link to="/?category=Design">Design Systems</Link></li>
            <li><Link to="/?category=Career">Career & Leadership</Link></li>
            <li><Link to="/?category=Tutorials">Practical Tutorials</Link></li>
          </ul>
        </div>

        {/* Quick Nav */}
        <div className="footer-col">
          <h4>Platform</h4>
          <ul>
            <li><Link to="/">Home Feed</Link></li>
            <li><Link to="/create-post">Write a Story</Link></li>
            <li><Link to="/profile">Author Profile</Link></li>
            <li><Link to="/login">Sign In</Link></li>
            <li><Link to="/register">Create Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          &copy; {new Date().getFullYear()} Ink & Echo. Built with MERN Stack (React, Node, Express, MongoDB).
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          Crafted with care & precision.
        </div>
      </div>
    </footer>
  );
}
