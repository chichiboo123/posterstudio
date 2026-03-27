import React from 'react';
import { usePoster } from '../../store/posterStore';
import { t } from '../../i18n';

export default function LayerPanel() {
  const { state, dispatch } = usePoster();
  const { language } = state;
  const { elements, selectedElementId } = state.poster;

  if (state.poster.currentStep === 1 || elements.length === 0) return null;

  const sorted = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ width: 200, minWidth: 200 }}>
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          <span className="material-icons" style={{ fontSize: 16 }}>layers</span>
          {t(language, 'layers')}
        </h3>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 300 }}>
        {sorted.map(el => (
          <button
            key={el.id}
            onClick={() => dispatch({ type: 'SELECT_ELEMENT', id: el.id })}
            className={`flex items-center gap-2 w-full px-3 py-2 text-left text-xs transition-all border-b border-gray-50 ${
              selectedElementId === el.id
                ? 'bg-amber-50 text-amber-700'
                : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            <span className="material-icons" style={{ fontSize: 14 }}>
              {el.type === 'text' ? 'text_fields' : el.type === 'emoji' ? 'emoji_emotions' : 'image'}
            </span>
            <span className="truncate flex-1">
              {el.type === 'text' ? el.content.slice(0, 12) : el.type === 'emoji' ? el.content : 'img'}
            </span>
            <span className="text-gray-300" style={{ fontSize: 10 }}>z:{el.zIndex}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
