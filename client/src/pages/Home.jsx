import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import PostCard from '../components/PostCard';
import { PostCardSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { Search, ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Technology',
  'Design',
  'Career',
  'Tutorials',
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedSearch = useDebounce(searchTerm, 350);

  // Sync category changes with URL search params
  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  // Fetch posts from API
  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 6,
        };

        if (debouncedSearch.trim()) {
          params.search = debouncedSearch.trim();
        }

        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }

        const res = await postsAPI.getAll(params);
        if (isMounted && res.data.success) {
          setPosts(res.data.posts);
          setTotalPages(res.data.totalPages);
          setTotalCount(res.data.total);
        }
      } catch (err) {
        console.error('Failed to load posts:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, [debouncedSearch, selectedCategory, currentPage]);

  const handleClearSearch = () => {
    setSearchTerm('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  return (
    <div className="home-page">
      {/* Hero Header */}
      <section className="hero-section">
        <div className="hero-pill">
          <Sparkles size={13} />
          <span>Insights & Architecture</span>
        </div>
        <h1 className="hero-title">
          Ideas that engineer the modern web.
        </h1>
        <p className="hero-subtitle">
          Explore thoughtful articles, design patterns, and engineering deep-dives written by modern practitioners.
        </p>

        {/* Filter & Search Bar */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search posts by title or keyword..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              id="search-posts-input"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="icon-btn"
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }}
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Category Pills */}
          <div className="category-pills" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategorySelect(cat)}
                role="tab"
                aria-selected={selectedCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Results Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
          {selectedCategory === 'All' ? 'Latest Stories' : `${selectedCategory} Articles`}
        </h2>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {totalCount} {totalCount === 1 ? 'article' : 'articles'}
        </span>
      </div>

      {/* Posts Grid */}
      {loading ? (
        <div className="posts-grid">
          {[...Array(6)].map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="posts-grid" id="posts-container">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination" id="posts-pagination">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                className="pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="No articles found"
          description={
            searchTerm
              ? `No articles match "${searchTerm}". Try checking your spelling or selecting another category.`
              : 'There are currently no articles published in this category.'
          }
          actionText="Clear Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCategory('All');
          }}
        />
      )}
    </div>
  );
}
