import React, { useRef, useCallback } from 'react';
import type { PosterElement as PosterElementType } from '../../types';
import { usePoster } from '../../store/posterStore';

interface Props {
  element: PosterElementType;
  canvasWidth: number;
  canvasHeight: number;
  onContextMenu: (e: React.MouseEvent, id: string) => void;
  scale: number;
}

export default function PosterElementComp({ element, canvasWidth, canvasHeight, onContextMenu, scale }: Props) {
  const { state, dispatch } = usePoster();
  const { selectedElementId } = state.poster;
  const isSelected = selectedElementId === element.id;

  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; origSize: number } | null>(null);

  // ── Drag ──────────────────────────────────────────────────────────────────
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch({ type: 'SELECT_ELEMENT', id: element.id });

      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        origX: element.position.x,
        origY: element.position.y,
      };

      const onMove = (me: MouseEvent) => {
        if (!dragRef.current) return;
        const dx = (me.clientX - dragRef.current.startX) / scale;
        const dy = (me.clientY - dragRef.current.startY) / scale;
        const newX = Math.max(0, Math.min(canvasWidth - 10, dragRef.current.origX + dx));
        const newY = Math.max(0, Math.min(canvasHeight - 10, dragRef.current.origY + dy));
        dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates: { position: { x: newX, y: newY } } });
      };

      const onUp = () => {
        dragRef.current = null;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [element.id, element.position.x, element.position.y, canvasWidth, canvasHeight, dispatch, scale]
  );

  // ── Touch Drag ─────────────────────────────────────────────────────────────
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      dispatch({ type: 'SELECT_ELEMENT', id: element.id });
      const touch = e.touches[0];
      dragRef.current = {
        startX: touch.clientX,
        startY: touch.clientY,
        origX: element.position.x,
        origY: element.position.y,
      };

      const onMove = (me: TouchEvent) => {
        if (!dragRef.current) return;
        const t = me.touches[0];
        const dx = (t.clientX - dragRef.current.startX) / scale;
        const dy = (t.clientY - dragRef.current.startY) / scale;
        const newX = Math.max(0, Math.min(canvasWidth - 10, dragRef.current.origX + dx));
        const newY = Math.max(0, Math.min(canvasHeight - 10, dragRef.current.origY + dy));
        dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates: { position: { x: newX, y: newY } } });
      };

      const onEnd = () => {
        dragRef.current = null;
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
      };

      document.addEventListener('touchmove', onMove, { passive: true });
      document.addEventListener('touchend', onEnd);
    },
    [element.id, element.position.x, element.position.y, canvasWidth, canvasHeight, dispatch, scale]
  );

  // ── Resize ────────────────────────────────────────────────────────────────
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      const origSize = element.style.fontSize ?? 24;
      resizeRef.current = { startX: e.clientX, startY: e.clientY, origSize };

      const onMove = (me: MouseEvent) => {
        if (!resizeRef.current) return;
        const dx = (me.clientX - resizeRef.current.startX) / scale;
        const dy = (me.clientY - resizeRef.current.startY) / scale;
        const delta = (dx + dy) / 2;
        const newSize = Math.max(12, Math.min(200, resizeRef.current.origSize + delta));
        dispatch({ type: 'UPDATE_ELEMENT', id: element.id, updates: { style: { ...element.style, fontSize: Math.round(newSize) } } });
      };

      const onUp = () => {
        resizeRef.current = null;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [element.id, element.style, dispatch, scale]
  );

  // ── Render ────────────────────────────────────────────────────────────────
  const fontSize = element.style.fontSize ?? 24;
  const { direction } = element.style;
  const writingMode = direction === 'vertical' ? 'vertical-rl' as const : undefined;
  const transform = direction === 'diagonal' ? 'rotate(45deg)' : undefined;

  return (
    <div
      style={{
        position: 'absolute',
        left: element.position.x,
        top: element.position.y,
        zIndex: element.zIndex,
        cursor: 'move',
        outline: isSelected ? '2px dashed #3B82F6' : undefined,
        outlineOffset: isSelected ? '3px' : undefined,
        transform,
        touchAction: 'none',
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, element.id); }}
    >
      <span
        style={{
          fontSize: `${fontSize}px`,
          color: element.style.color ?? '#000000',
          fontFamily: element.type === 'emoji' ? undefined : (element.style.fontFamily ?? "'Pretendard GOV', sans-serif"),
          fontWeight: element.style.fontWeight as React.CSSProperties['fontWeight'] ?? 'normal',
          fontStyle: element.style.fontStyle ?? 'normal',
          textShadow: element.style.textShadow ?? undefined,
          writingMode,
          lineHeight: 1.2,
          display: 'block',
          whiteSpace: element.type === 'text' ? 'pre-wrap' : undefined,
        }}
      >
        {element.type === 'image' ? (
          <img
            src={element.content}
            alt=""
            style={{ width: fontSize, height: fontSize, objectFit: 'contain', display: 'block' }}
            draggable={false}
          />
        ) : element.content}
      </span>

      {isSelected && (
        <div
          className="resize-handle"
          style={{
            position: 'absolute',
            top: -8, right: -8,
            width: 16, height: 16,
            background: '#3B82F6',
            border: '2px solid white',
            borderRadius: '50%',
            cursor: 'nwse-resize',
            zIndex: 10,
          }}
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}
