import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Pencil,
  ArrowLeft,
  Send,
  Loader2,
  X,
} from 'lucide-react';

const CATEGORIES = [
  'Web Development',
  'Technology',
  'Design',
  'Career',
  'Tutorials',
  'General',
];

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchPost = async () => {
      try {
        const res = await postsAPI.getById(id);
        if (isMounted && res.data.success) {
          const p = res.data.post;

          // Verify ownership
          const authorId = p.author?._id || p.author;
          if (user && authorId !== user._id) {
            toast.error('You do not have permission to edit this article.');
            navigate(`/posts/${id}`);
            return;
          }

          setTitle(p.title);
          setCategory(p.category || 'General');
          setImageUrl(p.imageUrl || '');
          setContent(p.content);
        }
      } catch (err) {
        toast.error('Failed to load article details');
        navigate('/');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      isMounted = false;
    };
  }, [id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error('Please provide both title and content.');
      return;
    }

    setSaving(true);
    try {
      const res = await postsAPI.update(id, {
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim(),
        content: content.trim(),
      });

      if (res.data.success) {
        toast.success('Article updated successfully!');
        navigate(`/posts/${id}`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to update article. Please try again.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Loader2 className="spin" size={36} color="var(--accent-blue)" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <button
        type="button"
        onClick={() => navigate(`/posts/${id}`)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem', display: 'inline-flex' }}
      >
        <ArrowLeft size={15} /> Back to Story
      </button>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="hero-pill" style={{ marginBottom: '0.75rem' }}>
            <Pencil size={13} />
            <span>Edit Story</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Update Article</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Modify your content, image, or category and save your revisions.
          </p>
        </div>

        <form onSubmit={handleSubmit} id="edit-post-form">
          <div className="form-group">
            <label className="form-label" htmlFor="edit-title">
              Article Title *
            </label>
            <input
              type="text"
              id="edit-title"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-category">
              Category
            </label>
            <select
              id="edit-category"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-image">
              Cover Image URL (Optional)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="url"
                id="edit-image"
                className="form-input"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="btn btn-secondary btn-sm"
                  title="Clear image"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {imageUrl && (
              <div className="image-preview-box">
                <img
                  src={imageUrl}
                  alt="Cover preview"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit-content">
              Article Content *
            </label>
            <textarea
              id="edit-content"
              className="form-textarea"
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => navigate(`/posts/${id}`)}
              className="btn btn-secondary"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              id="save-post-btn"
            >
              <Send size={16} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
