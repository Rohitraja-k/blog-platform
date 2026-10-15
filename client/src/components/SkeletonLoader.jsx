export function PostCardSkeleton() {
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="skeleton" style={{ width: '100%', height: '180px' }} />
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div className="skeleton" style={{ width: '35%', height: '14px' }} />
        <div className="skeleton" style={{ width: '85%', height: '22px' }} />
        <div className="skeleton" style={{ width: '100%', height: '14px' }} />
        <div className="skeleton" style={{ width: '90%', height: '14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
          <div className="skeleton" style={{ width: '40%', height: '24px', borderRadius: '999px' }} />
          <div className="skeleton" style={{ width: '15%', height: '20px' }} />
        </div>
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="post-detail-container" style={{ padding: '1rem 0' }}>
      <div className="skeleton" style={{ width: '120px', height: '24px', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ width: '90%', height: '42px', marginBottom: '0.75rem' }} />
      <div className="skeleton" style={{ width: '60%', height: '42px', marginBottom: '1.5rem' }} />
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
        <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
          <div className="skeleton" style={{ width: '140px', height: '16px' }} />
          <div className="skeleton" style={{ width: '100px', height: '12px' }} />
        </div>
      </div>

      <div className="skeleton" style={{ width: '100%', height: '340px', borderRadius: '16px', marginBottom: '2rem' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className="skeleton" style={{ width: '100%', height: '18px' }} />
        <div className="skeleton" style={{ width: '95%', height: '18px' }} />
        <div className="skeleton" style={{ width: '98%', height: '18px' }} />
        <div className="skeleton" style={{ width: '70%', height: '18px' }} />
      </div>
    </div>
  );
}
