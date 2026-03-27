import React, { useEffect, useRef } from 'react';
import { usePoster } from '../../store/posterStore';
import { t } from '../../i18n';

interface ContextMenuProps {
  x: number;
  y: number;
  elementId: string;
  onClose: () => void;
}

export default function ContextMenu({ x, y, elementId, onClose }: ContextMenuProps) {
  const { dispatch, showToast, state } = usePoster();
  const { language } = state;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [onClose]);

  const action = (type: string) => {
    onClose();
    switch (type) {
      case 'duplicate':
        dispatch({ type: 'DUPLICATE_ELEMENT', id: elementId });
        showToast(t(language, 'elementDuplicated'));
        break;
      case 'delete':
        dispatch({ type: 'DELETE_ELEMENT', id: elementId });
        showToast(t(language, 'elementDeleted'), 'info');
        break;
      case 'front':
        dispatch({ type: 'MOVE_TO_FRONT', id: elementId });
        break;
      case 'forward':
        dispatch({ type: 'MOVE_FORWARD', id: elementId });
        break;
      case 'backward':
        dispatch({ type: 'MOVE_BACKWARD', id: elementId });
        break;
      case 'back':
        dispatch({ type: 'MOVE_TO_BACK', id: elementId });
        break;
    }
  };

  return (
    <div ref={ref} className="context-menu" style={{ left: x, top: y }}>
      <div className="context-menu-item" onClick={() => action('duplicate')}>
        <span className="material-icons" style={{ fontSize: 16 }}>content_copy</span>
        {t(language, 'duplicate')}
      </div>
      <div className="context-menu-divider" />
      <div className="context-menu-item" onClick={() => action('front')}>
        <span className="material-icons" style={{ fontSize: 16 }}>flip_to_front</span>
        {t(language, 'bringToFront')}
      </div>
      <div className="context-menu-item" onClick={() => action('forward')}>
        <span className="material-icons" style={{ fontSize: 16 }}>arrow_upward</span>
        {t(language, 'bringForward')}
      </div>
      <div className="context-menu-item" onClick={() => action('backward')}>
        <span className="material-icons" style={{ fontSize: 16 }}>arrow_downward</span>
        {t(language, 'sendBackward')}
      </div>
      <div className="context-menu-item" onClick={() => action('back')}>
        <span className="material-icons" style={{ fontSize: 16 }}>flip_to_back</span>
        {t(language, 'sendToBack')}
      </div>
      <div className="context-menu-divider" />
      <div className="context-menu-item danger" onClick={() => action('delete')}>
        <span className="material-icons" style={{ fontSize: 16 }}>delete</span>
        {t(language, 'delete')}
      </div>
    </div>
  );
}
