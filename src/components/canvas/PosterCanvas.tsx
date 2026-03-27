import React, { useRef, useState, useCallback } from 'react';
import { usePoster } from '../../store/posterStore';
import PosterElementComp from './PosterElement';
import ContextMenu from '../common/ContextMenu';
import { gradientDirections } from '../../data/fontData';

interface Props {
  isExporting?: boolean;
  scale?: number;
}

export default function PosterCanvas({ isExporting = false, scale = 1 }: Props) {
  const { state, dispatch, canvasSize } = usePoster();
  const { poster } = state;
  const canvasRef = useRef<HTMLDivElement>(null);

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string } | null>(null);

  const sc = isExporting ? 1 : scale;

  const getBackgroundStyle = (): React.CSSProperties => {
    const { background } = poster;
    if (background.type === 'solid') {
      return { background: background.colors[0] };
    }
    const dir = gradientDirections.find(d => d.id === background.gradientDirection);
    const cssDir = dir?.cssValue ?? 'to bottom';
    return {
      background: `linear-gradient(${cssDir}, ${background.colors[0]}, ${background.colors[1] ?? background.colors[0]})`,
    };
  };

  const handleCanvasClick = useCallback(() => {
    dispatch({ type: 'SELECT_ELEMENT', id: null });
    setContextMenu(null);
  }, [dispatch]);

  const handleContextMenu = useCallback((e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, elementId });
    dispatch({ type: 'SELECT_ELEMENT', id: elementId });
  }, [dispatch]);

  const sortedElements = [...poster.elements].sort((a, b) => a.zIndex - b.zIndex);

  return (
    <div style={{ position: 'relative', width: canvasSize.width * sc, height: canvasSize.height * sc }}>
      <div
        id="poster-canvas"
        ref={canvasRef}
        className="relative overflow-hidden shadow-2xl"
        style={{
          width: canvasSize.width,
          height: canvasSize.height,
          transform: `scale(${sc})`,
          transformOrigin: 'top left',
          ...getBackgroundStyle(),
        }}
        onClick={handleCanvasClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        {sortedElements.map(el => (
          <PosterElementComp
            key={el.id}
            element={el}
            canvasWidth={canvasSize.width}
            canvasHeight={canvasSize.height}
            onContextMenu={handleContextMenu}
            scale={sc}
          />
        ))}
      </div>

      {contextMenu && !isExporting && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          elementId={contextMenu.elementId}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
