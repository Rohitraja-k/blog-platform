import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function EmptyState({
  icon: Icon = BookOpen,
  title = 'No posts found',
  description = 'Try searching with different keywords or exploring other categories.',
  actionText,
  actionLink,
  onAction,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-primary btn-sm">
          {actionText}
        </Link>
      )}
      {actionText && onAction && !actionLink && (
        <button type="button" onClick={onAction} className="btn btn-primary btn-sm">
          {actionText}
        </button>
      )}
    </div>
  );
}
