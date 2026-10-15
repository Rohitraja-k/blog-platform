import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '5rem 1.5rem',
        maxWidth: '540px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          backgroundColor: 'var(--bg-blue-light)',
          color: 'var(--accent-blue)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <Compass size={36} />
      </div>

      <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--accent-blue)', marginBottom: '0.5rem' }}>
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
        The article or page you are searching for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <Link to="/" className="btn btn-primary" id="notfound-home-btn">
        <Home size={16} /> Return to Home Feed
      </Link>
    </div>
  );
}
