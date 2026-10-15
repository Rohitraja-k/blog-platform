import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Delete',
  confirmVariant = 'danger',
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel} id="confirm-modal-overlay">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-icon-danger">
            <AlertTriangle size={20} />
          </div>
          <h3 className="modal-title">{title}</h3>
        </div>

        <p className="modal-body">{message}</p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onCancel}
            id="modal-cancel-btn"
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${confirmVariant === 'danger' ? 'btn-danger' : 'btn-primary'} btn-sm`}
            onClick={onConfirm}
            id="modal-confirm-btn"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
