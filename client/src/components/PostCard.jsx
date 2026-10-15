import { Link } from 'react-router-dom';
import { Clock, MessageSquare, Calendar } from 'lucide-react';

export default function PostCard({ post }) {
  // Format readable date
  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Strip markdown hashes/symbols for clean excerpt
  const cleanExcerpt = (text) => {
    if (!text) return '';
    return text
      .replace(/#{1,6}\s+/g, '')
      .replace(/(\*\*|__)(.*?)\1/g, '$2')
      .replace(/(\*|_)(.*?)\1/g, '$2')
      .replace(/`{1,3}.*?`{1,3}/g, '')
      .trim();
  };

  const defaultImage =
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80';

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    post.author?.name || 'Author'
  )}&backgroundColor=2563eb&textColor=ffffff`;

  return (
    <article className="post-card" id={`post-card-${post._id}`}>
      <Link to={`/posts/${post._id}`} className="post-card-thumb-wrapper" tabIndex={-1}>
        <img
          src={post.imageUrl || defaultImage}
          alt={post.title}
          className="post-card-thumb"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
          }}
        />
        <span className="post-card-category-badge">{post.category || 'General'}</span>
      </Link>

      <div className="post-card-body">
        <div className="post-card-meta-top">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} />
            {formatDate(post.createdAt)}
          </span>
          <span>•</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} />
            {post.readTime || '3 min read'}
          </span>
        </div>

        <Link to={`/posts/${post._id}`}>
          <h3 className="post-card-title">{post.title}</h3>
        </Link>

        <p className="post-card-excerpt">{cleanExcerpt(post.content)}</p>

        <div className="post-card-footer">
          <div className="post-author-info">
            <img
              src={post.author?.avatar || defaultAvatar}
              alt={post.author?.name || 'Author'}
              className="post-author-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <span className="post-author-name">{post.author?.name || 'Anonymous'}</span>
          </div>

          <div className="post-card-stats" title="Comments">
            <MessageSquare size={14} color="var(--accent-blue)" />
            <span>{post.commentCount ?? 0}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
