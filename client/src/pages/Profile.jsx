import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { postsAPI } from '../services/api';
import PostCard from '../components/PostCard';
import EmptyState from '../components/EmptyState';
import { PostCardSkeleton } from '../components/SkeletonLoader';
import {
  User as UserIcon,
  BookOpen,
  Calendar,
  Settings,
  Mail,
  PenSquare,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('articles'); // 'articles' | 'edit'

  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Edit profile form state
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  // Fetch posts written by current user
  useEffect(() => {
    let isMounted = true;
    const fetchUserPosts = async () => {
      if (!user?._id) return;
      setLoadingPosts(true);
      try {
        const res = await postsAPI.getAll({ author: user._id, limit: 50 });
        if (isMounted && res.data.success) {
          setUserPosts(res.data.posts);
        }
      } catch (err) {
        console.error('Failed to load user posts:', err);
      } finally {
        if (isMounted) setLoadingPosts(false);
      }
    };

    fetchUserPosts();
    return () => {
      isMounted = false;
    };
  }, [user?._id]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile({ name: name.trim(), bio: bio.trim(), avatar: avatar.trim() });
    setSavingProfile(false);
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const defaultAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    user?.name || 'User'
  )}&backgroundColor=2563eb&textColor=ffffff`;

  return (
    <div className="profile-container">
      {/* Profile Header Card */}
      <div className="profile-header-card">
        <div className="profile-cover" />
        <div className="profile-content">
          <img
            src={user?.avatar || defaultAvatar}
            alt={user?.name}
            className="profile-avatar-large"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />

          <div className="profile-details">
            <h1 className="profile-name">{user?.name}</h1>
            <div className="profile-email">
              <Mail size={14} style={{ display: 'inline', marginRight: '4px' }} />
              {user?.email}
            </div>
            <p className="profile-bio">
              {user?.bio || 'Passionate reader and contributor on Ink & Echo.'}
            </p>

            <div className="profile-stats-row">
              <div className="profile-stat-item">
                <span className="stat-value">{userPosts.length}</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="profile-stat-item">
                <span className="stat-value">{formatDate(user?.createdAt)}</span>
                <span className="stat-label">Member Since</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
        <button
          type="button"
          onClick={() => setActiveTab('articles')}
          className={`btn ${activeTab === 'articles' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          id="tab-my-articles"
        >
          <BookOpen size={15} />
          <span>My Articles ({userPosts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('edit')}
          className={`btn ${activeTab === 'edit' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          id="tab-edit-profile"
        >
          <Settings size={15} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Tab 1: User's Articles */}
      {activeTab === 'articles' && (
        <div>
          {loadingPosts ? (
            <div className="posts-grid">
              {[...Array(3)].map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          ) : userPosts.length > 0 ? (
            <div className="posts-grid" id="user-posts-grid">
              {userPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="You haven't published any articles yet"
              description="Share your insights, architectural designs, or lessons learned with the community."
              actionText="Write Your First Story"
              actionLink="/create-post"
              icon={PenSquare}
            />
          )}
        </div>
      )}

      {/* Tab 2: Edit Profile */}
      {activeTab === 'edit' && (
        <div className="card" style={{ padding: '2rem', maxWidth: '640px' }}>
          <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Personal Information</h2>
          <form onSubmit={handleProfileSave} id="edit-profile-form">
            <div className="form-group">
              <label className="form-label" htmlFor="profile-name">
                Display Name
              </label>
              <input
                type="text"
                id="profile-name"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-email">
                Email Address
              </label>
              <input
                type="email"
                id="profile-email"
                className="form-input"
                value={user?.email || ''}
                disabled
                style={{ backgroundColor: 'var(--bg-tertiary)', cursor: 'not-allowed' }}
              />
              <span className="form-hint">Email address cannot be changed</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-avatar">
                Avatar Image URL
              </label>
              <input
                type="url"
                id="profile-avatar"
                className="form-input"
                placeholder="https://..."
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
              />
              <span className="form-hint">Leave blank to use an auto-generated initials avatar</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="profile-bio">
                Bio
              </label>
              <textarea
                id="profile-bio"
                className="form-textarea"
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={300}
                placeholder="Tell readers about yourself, your tech stack, or interests..."
              />
              <div style={{ textAlign: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {bio.length}/300
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={savingProfile}
                id="save-profile-btn"
              >
                <Save size={16} />
                {savingProfile ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
