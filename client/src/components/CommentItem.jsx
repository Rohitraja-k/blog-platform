import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';

export default function CommentItem({ comment, currentUserId, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [submitting, setSubmitting] = useState(false);

  // Author verification
  const isOwner =
    currentUserId &&
    (comment.author?._id === currentUserId || comment.author === currentUserId);

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    comment.author?.name || 'User'
  )}&backgroundColor=2563eb&textColor=ffffff`;

  const handleSaveEdit = async () => {
    if (!editText.trim() || editText.trim() === comment.content) {
      setIsEditing(false);
      return;
    }
    setSubmitting(true);
    const success = await onUpdate(comment._id, editText.trim());
    setSubmitting(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditText(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="comment-card" id={`comment-${comment._id}`}>
      <div className="comment-top-bar">
        <div className="comment-author-badge">
          <img
            src={comment.author?.avatar || defaultAvatar}
            alt={comment.author?.name || 'Commenter'}
            className="comment-avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
          <div>
            <span className="comment-author-name">{comment.author?.name || 'Anonymous'}</span>
            <div className="comment-date">{formatDate(comment.createdAt)}</div>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="comment-edit-actions">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="icon-btn"
              title="Edit comment"
              aria-label="Edit comment"
            >
              <Pencil size={15} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(comment._id)}
              className="icon-btn danger"
              title="Delete comment"
              aria-label="Delete comment"
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>

      {isEditing ? (
        <div style={{ marginTop: '0.75rem' }}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="form-textarea"
            style={{ minHeight: '80px', marginBottom: '0.6rem' }}
            disabled={submitting}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="btn btn-secondary btn-sm"
              disabled={submitting}
            >
              <X size={14} /> Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="btn btn-primary btn-sm"
              disabled={submitting || !editText.trim()}
            >
              <Check size={14} /> {submitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <p className="comment-body">{comment.content}</p>
      )}
    </div>
  );
}
