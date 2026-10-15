import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  PenSquare,
  Image as ImageIcon,
  Send,
  Sparkles,
  ArrowLeft,
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

const PRESET_IMAGES = [
  {
    name: 'Code & Screen',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Workspace Minimal',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Modern Architecture',
    url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1000&auto=format&fit=crop&q=80',
  },
  {
    name: 'Cloud & Tech',
    url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1000&auto=format&fit=crop&q=80',
  },
];

export default function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter an article title.');
      return;
    }

    if (!content.trim()) {
      toast.error('Please write some content for your article.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await postsAPI.create({
        title: title.trim(),
        category,
        imageUrl: imageUrl.trim(),
        content: content.trim(),
      });

      if (res.data.success) {
        toast.success('Your story was published successfully!');
        navigate(`/posts/${res.data.post._id}`);
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Failed to publish post. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '1.5rem', display: 'inline-flex' }}
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="card" style={{ padding: '2.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <div className="hero-pill" style={{ marginBottom: '0.75rem' }}>
            <PenSquare size={13} />
            <span>Publish Article</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Create New Story</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Share your insights, code patterns, and ideas with thousands of developers.
          </p>
        </div>

        <form onSubmit={handleSubmit} id="create-post-form">
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="post-title">
              Article Title *
            </label>
            <input
              type="text"
              id="post-title"
              className="form-input"
              placeholder="e.g. Building High-Performance Microservices in Node.js"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={150}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {title.length}/150
            </div>
          </div>

          {/* Category */}
          <div className="form-group">
            <label className="form-label" htmlFor="post-category">
              Category
            </label>
            <select
              id="post-category"
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

          {/* Image URL & Quick Presets */}
          <div className="form-group">
            <label className="form-label" htmlFor="post-image">
              Cover Image URL (Optional)
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="url"
                id="post-image"
                className="form-input"
                placeholder="https://images.unsplash.com/photo-..."
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

            {/* Quick image preset picks */}
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                Quick Presets:
              </span>
              <div style={{ display: 'inline-flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                {PRESET_IMAGES.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setImageUrl(preset.url)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Preview */}
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

          {/* Content */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="post-content">
                Article Content *
              </label>
              <span className="form-hint">Supports markdown headings (##, ###) and lists (-)</span>
            </div>
            <textarea
              id="post-content"
              className="form-textarea"
              rows={12}
              placeholder="Write your article here... Organize with sections using ## Heading 2, ### Heading 3, and bullet points."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '2rem' }}>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              id="publish-btn"
            >
              <Send size={16} />
              {submitting ? 'Publishing...' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
