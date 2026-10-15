import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, Lock } from 'lucide-react';

export default function CommentForm({ onSubmit, loading }) {
  const { isAuthenticated, user } = useAuth();
  const [content, setContent] = useState('');
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const success = await onSubmit(content.trim());
    if (success) {
      setContent('');
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <Lock size={24} color="var(--accent-blue)" style={{ marginBottom: '0.5rem' }} />
        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Want to join the discussion?</h4>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Sign in to share your thoughts and interact with the author.
        </p>
        <Link
          to="/login"
          state={{ from: location }}
          className="btn btn-primary btn-sm"
          id="comment-login-cta"
        >
          Sign In to Comment
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form-container" id="comment-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Commenting as ${user?.name || 'User'}... Share your insights or questions`}
        className="comment-form-textarea"
        disabled={loading}
        rows={3}
        required
        id="comment-textarea"
      />
      <div className="comment-form-actions">
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={loading || !content.trim()}
          id="comment-submit-btn"
        >
          <Send size={14} />
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
}
