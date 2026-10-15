import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postsAPI, commentsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PostDetailSkeleton } from '../components/SkeletonLoader';
import CommentItem from '../components/CommentItem';
import CommentForm from '../components/CommentForm';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';
import {
  Calendar,
  Clock,
  Pencil,
  Trash2,
  ArrowLeft,
  Share2,
  MessageSquare,
} from 'lucide-react';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [addingComment, setAddingComment] = useState(false);

  // Deletion modals state
  const [deletePostModalOpen, setDeletePostModalOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState(null);

  // Load post and comments
  useEffect(() => {
    let isMounted = true;
    const fetchPostAndComments = async () => {
      setLoading(true);
      try {
        const [postRes, commentsRes] = await Promise.all([
          postsAPI.getById(id),
          commentsAPI.getByPost(id),
        ]);

        if (isMounted) {
          if (postRes.data.success) {
            setPost(postRes.data.post);
          }
          if (commentsRes.data.success) {
            setComments(commentsRes.data.comments);
          }
        }
      } catch (err) {
        console.error('Error fetching post details:', err);
        toast.error('Article could not be found or was removed.');
        navigate('/');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPostAndComments();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  // Is current user post owner?
  const isPostOwner =
    user && post && (post.author?._id === user._id || post.author === user._id);

  // Handle post deletion
  const handleConfirmDeletePost = async () => {
    try {
      const res = await postsAPI.delete(post._id);
      if (res.data.success) {
        toast.success('Post successfully deleted');
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete post');
    } finally {
      setDeletePostModalOpen(false);
    }
  };

  // Handle create comment
  const handleAddComment = async (content) => {
    setAddingComment(true);
    try {
      const res = await commentsAPI.create(post._id, { content });
      if (res.data.success) {
        setComments((prev) => [res.data.comment, ...prev]);
        setPost((prev) => ({
          ...prev,
          commentCount: (prev.commentCount || 0) + 1,
        }));
        toast.success('Comment posted!');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
      return false;
    } finally {
      setAddingComment(false);
    }
  };

  // Handle update comment
  const handleUpdateComment = async (commentId, content) => {
    try {
      const res = await commentsAPI.update(commentId, { content });
      if (res.data.success) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? res.data.comment : c))
        );
        toast.success('Comment updated');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update comment');
      return false;
    }
  };

  // Handle delete comment
  const handleConfirmDeleteComment = async () => {
    if (!deleteCommentId) return;
    try {
      const res = await commentsAPI.delete(deleteCommentId);
      if (res.data.success) {
        setComments((prev) => prev.filter((c) => c._id !== deleteCommentId));
        setPost((prev) => ({
          ...prev,
          commentCount: Math.max(0, (prev.commentCount || 0) - 1),
        }));
        toast.success('Comment deleted');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete comment');
    } finally {
      setDeleteCommentId(null);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Article link copied to clipboard!');
    }
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Simple rich text formatting for markdown-like posts
  const renderFormattedContent = (content) => {
    if (!content) return null;
    const lines = content.split('\n');

    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <br key={idx} />;

      if (trimmed.startsWith('### ')) {
        return <h3 key={idx}>{trimmed.substring(4)}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx}>{trimmed.substring(3)}</h2>;
      }
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx}>{trimmed.substring(2)}</h1>;
      }
      if (trimmed.startsWith('> ')) {
        return <blockquote key={idx}>{trimmed.substring(2)}</blockquote>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <ul key={idx}>
            <li>{trimmed.substring(2)}</li>
          </ul>
        );
      }
      if (trimmed.startsWith('```')) {
        return null; // Ignore fence wrappers
      }

      return <p key={idx}>{trimmed}</p>;
    });
  };

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <h2>Post not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    post.author?.name || 'Author'
  )}&backgroundColor=2563eb&textColor=ffffff`;

  return (
    <div className="post-detail-container" id="post-details-view">
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={16} /> Back to all articles
        </Link>
      </div>

      {/* Post Header */}
      <header className="post-detail-header">
        <span className="post-detail-category">{post.category || 'General'}</span>
        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-detail-meta">
          <div className="post-detail-author-row">
            <img
              src={post.author?.avatar || defaultAvatar}
              alt={post.author?.name || 'Author'}
              className="detail-author-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
            <div>
              <div className="detail-author-name">{post.author?.name || 'Author'}</div>
              <div className="detail-author-sub">
                <Calendar size={13} />
                <span>{formatDate(post.createdAt)}</span>
                <span>•</span>
                <Clock size={13} />
                <span>{post.readTime || '3 min read'}</span>
              </div>
            </div>
          </div>

          <div className="post-detail-actions">
            <button
              type="button"
              onClick={handleShare}
              className="btn btn-secondary btn-sm"
              title="Share article"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>

            {isPostOwner && (
              <>
                <Link
                  to={`/edit-post/${post._id}`}
                  className="btn btn-secondary btn-sm"
                  id="edit-post-btn"
                  title="Edit this post"
                >
                  <Pencil size={15} />
                  <span>Edit</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setDeletePostModalOpen(true)}
                  className="btn btn-danger-outline btn-sm"
                  id="delete-post-btn"
                  title="Delete this post"
                >
                  <Trash2 size={15} />
                  <span>Delete</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Banner image if present */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="post-banner-image"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      {/* Main post content */}
      <article className="post-content-body">
        {renderFormattedContent(post.content)}
      </article>

      {/* Author Bio Card */}
      <div className="author-bio-card">
        <img
          src={post.author?.avatar || defaultAvatar}
          alt={post.author?.name}
          className="author-bio-avatar"
        />
        <div className="author-bio-details">
          <div className="author-bio-name">Written by {post.author?.name}</div>
          <p className="author-bio-text">
            {post.author?.bio ||
              'Software engineer and technology writer exploring modern full-stack development, distributed architecture, and software design.'}
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <section className="comments-section" id="comments-section">
        <div className="comments-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <MessageSquare size={20} color="var(--accent-blue)" />
            <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Discussion</h3>
          </div>
          <span className="comments-count-badge">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </span>
        </div>

        {/* Comment Submission Form */}
        <CommentForm onSubmit={handleAddComment} loading={addingComment} />

        {/* Comments List */}
        <div className="comment-list" id="comment-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUserId={user?._id}
                onUpdate={handleUpdateComment}
                onDelete={(commentId) => setDeleteCommentId(commentId)}
              />
            ))
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                color: 'var(--text-muted)',
                fontSize: '0.925rem',
              }}
            >
              No comments yet. Be the first to share your perspectives!
            </div>
          )}
        </div>
      </section>

      {/* Delete Post Modal */}
      <ConfirmModal
        isOpen={deletePostModalOpen}
        title="Delete Article?"
        message="Are you sure you want to permanently delete this article? All associated comments will also be removed."
        confirmText="Delete Article"
        confirmVariant="danger"
        onConfirm={handleConfirmDeletePost}
        onCancel={() => setDeletePostModalOpen(false)}
      />

      {/* Delete Comment Modal */}
      <ConfirmModal
        isOpen={!!deleteCommentId}
        title="Delete Comment?"
        message="Are you sure you want to remove your comment?"
        confirmText="Delete Comment"
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteComment}
        onCancel={() => setDeleteCommentId(null)}
      />
    </div>
  );
}
