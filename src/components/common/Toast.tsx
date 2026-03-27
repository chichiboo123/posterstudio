import React, { useEffect } from 'react';
import { usePoster } from '../../store/posterStore';

export default function Toast() {
  const { state } = usePoster();
  const { toast } = state;

  if (!toast) return null;

  const icons: Record<string, string> = {
    success: 'check_circle',
    error: 'error',
    info: 'info',
  };

  return (
    <div className="toast-container">
      <div className={`toast ${toast.type}`}>
        <span className="material-icons" style={{ fontSize: 18 }}>{icons[toast.type]}</span>
        {toast.message}
      </div>
    </div>
  );
}
