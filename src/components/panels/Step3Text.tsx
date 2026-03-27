import React, { useCallback } from 'react';
import { usePoster, genId, useTheme } from '../../store/posterStore';
import { t } from '../../i18n';
import { fontOptions, textColorPresets } from '../../data/fontData';
import type { PosterElement, ElementStyle } from '../../types';

export default function Step3Text() {
  const tc = useTheme();
  const { state, dispatch, showToast, canvasSize } = usePoster();
  const { language } = state;
  const { elements, selectedElementId } = state.poster;

  const textElements = elements.filter(e => e.type === 'text');
  const selected = elements.find(e => e.id === selectedElementId && e.type === 'text') ?? null;

  const addText = useCallback(() => {
    const existingCount = textElements.length;
    const newEl: PosterElement = {
      id: genId(),
      type: 'text',
      content: language === 'ko' ? '새 텍스트' : 'New Text',
      position: { x: 30, y: 100 + existingCount * 40 },
      style: {
        fontSize: 32,
        color: '#222222',
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: 'normal',
        fontStyle: 'normal',
        textShadow: undefined,
        direction: 'horizontal',
      },
      zIndex: Math.max(...elements.map(e => e.zIndex), 0) + 1,
    };
    dispatch({ type: 'ADD_ELEMENT', element: newEl });
    showToast(t(language, 'textAdded'));
  }, [elements, textElements.length, language, dispatch, showToast]);

  const update = (id: string, style: Partial<ElementStyle>) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    dispatch({ type: 'UPDATE_ELEMENT', id, updates: { style: { ...el.style, ...style } } });
  };

  const alignCenter = (id: string) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    const span = document.createElement('span');
    span.style.fontSize = `${el.style.fontSize ?? 24}px`;
    span.style.fontFamily = el.style.fontFamily ?? 'Pretendard';
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.style.whiteSpace = 'nowrap';
    span.innerText = el.content;
    document.body.appendChild(span);
    const textWidth = span.offsetWidth;
    document.body.removeChild(span);
    const x = Math.max(0, (canvasSize.width - textWidth) / 2);
    dispatch({ type: 'UPDATE_ELEMENT', id, updates: { position: { x, y: el.position.y } } });
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
      <button
        onClick={addText}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow"
        style={{ background: tc.accent }}
        onMouseEnter={e => (e.currentTarget.style.background = tc.accentHover)}
        onMouseLeave={e => (e.currentTarget.style.background = tc.accent)}
      >
        <span className="material-icons" style={{ fontSize: 20 }}>text_fields</span>
        {t(language, 'addText')}
      </button>

      {/* Text element list */}
      {textElements.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            {t(language, 'elementsOnPoster')}
          </label>
          <div className="flex flex-col gap-1">
            {textElements.map(el => (
              <button
                key={el.id}
                onClick={() => dispatch({ type: 'SELECT_ELEMENT', id: el.id })}
                className="flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-all border"
                style={selectedElementId === el.id
                  ? { background: tc.accentLight, borderColor: tc.accentBorder, color: tc.accentText }
                  : { background: '#F9FAFB', borderColor: 'transparent', color: '#374151' }}
              >
                <span className="material-icons" style={{ fontSize: 16 }}>text_fields</span>
                <span className="truncate">{el.content}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Properties of selected text element */}
      {selected ? (
        <div className="flex flex-col gap-4 mt-2">
          <div className="h-px bg-gray-100" />

          {/* Content */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              {t(language, 'textContent')}
            </label>
            <textarea
              value={selected.content}
              onChange={e => dispatch({ type: 'UPDATE_ELEMENT', id: selected.id, updates: { content: e.target.value } })}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:border-amber-400"
              rows={3}
            />
          </div>

          {/* Font */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
              {t(language, 'fontFamily')}
            </label>
            <select
              value={selected.style.fontFamily ?? ''}
              onChange={e => update(selected.id, { fontFamily: e.target.value })}
              className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-amber-400"
              style={{ fontFamily: selected.style.fontFamily }}
            >
              {fontOptions.map(f => (
                <option key={f.id} value={f.family} style={{ fontFamily: f.family }}>
                  {f.labelKo} ({f.name})
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                {t(language, 'fontSize')}
              </label>
              <span className="text-sm font-bold text-amber-600">{selected.style.fontSize ?? 24}px</span>
            </div>
            <input
              type="range"
              min={12}
              max={150}
              value={selected.style.fontSize ?? 24}
              onChange={e => update(selected.id, { fontSize: Number(e.target.value) })}
              className="w-full accent-amber-400"
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              {t(language, 'fontColor')}
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {textColorPresets.map(c => (
                <button
                  key={c}
                  onClick={() => update(selected.id, { color: c })}
                  className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    background: c,
                    borderColor: selected.style.color === c ? '#F59E0B' : '#E5E7EB',
                    boxShadow: selected.style.color === c ? '0 0 0 2px #F59E0B' : undefined,
                  }}
                />
              ))}
              <input
                type="color"
                value={selected.style.color ?? '#000000'}
                onChange={e => update(selected.id, { color: e.target.value })}
                className="w-8 h-8 rounded-full border border-gray-200 cursor-pointer"
                title={t(language, 'customColor')}
              />
            </div>
          </div>

          {/* Direction */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              {t(language, 'textDirection')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'horizontal', label: t(language, 'horizontal'), icon: 'text_rotation_none' },
                { id: 'vertical', label: t(language, 'vertical'), icon: 'text_rotation_angledown' },
                { id: 'diagonal', label: t(language, 'diagonal'), icon: 'rotate_90_degrees_ccw' },
              ].map(dir => (
                <button
                  key={dir.id}
                  onClick={() => update(selected.id, { direction: dir.id as any })}
                  className={`flex flex-col items-center gap-1 py-2 px-1 rounded-lg border-2 text-xs transition-all ${
                    (selected.style.direction ?? 'horizontal') === dir.id
                      ? 'border-amber-400 bg-amber-50 text-amber-600'
                      : 'border-gray-200 text-gray-500 hover:border-amber-200'
                  }`}
                >
                  <span className="material-icons" style={{ fontSize: 18 }}>{dir.icon}</span>
                  {dir.label}
                </button>
              ))}
            </div>
          </div>

          {/* Style toggles */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              {language === 'ko' ? '스타일' : 'Style'}
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => update(selected.id, { fontWeight: selected.style.fontWeight === 'bold' ? 'normal' : 'bold' })}
                className={`flex-1 py-2 rounded-lg border-2 font-bold text-sm transition-all ${
                  selected.style.fontWeight === 'bold'
                    ? 'border-amber-400 bg-amber-50 text-amber-600'
                    : 'border-gray-200 text-gray-500 hover:border-amber-200'
                }`}
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => update(selected.id, { fontStyle: selected.style.fontStyle === 'italic' ? 'normal' : 'italic' })}
                className={`flex-1 py-2 rounded-lg border-2 text-sm transition-all ${
                  selected.style.fontStyle === 'italic'
                    ? 'border-amber-400 bg-amber-50 text-amber-600'
                    : 'border-gray-200 text-gray-500 hover:border-amber-200'
                }`}
              >
                <em>I</em>
              </button>
              <button
                onClick={() => update(selected.id, {
                  textShadow: selected.style.textShadow
                    ? undefined
                    : '2px 2px 4px rgba(0,0,0,0.5)',
                })}
                className={`flex-1 py-2 rounded-lg border-2 text-sm transition-all ${
                  selected.style.textShadow
                    ? 'border-amber-400 bg-amber-50 text-amber-600'
                    : 'border-gray-200 text-gray-500 hover:border-amber-200'
                }`}
              >
                <span className="material-icons" style={{ fontSize: 16, verticalAlign: 'middle' }}>shadow</span>
              </button>
            </div>
          </div>

          {/* Align center */}
          <button
            onClick={() => alignCenter(selected.id)}
            className="flex items-center justify-center gap-2 w-full py-2 px-4 border-2 border-gray-200 rounded-lg text-sm text-gray-600 hover:border-amber-400 hover:text-amber-600 transition-all"
          >
            <span className="material-icons" style={{ fontSize: 18 }}>format_align_center</span>
            {t(language, 'alignCenter')}
          </button>
        </div>
      ) : textElements.length > 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-gray-400">
          <span className="material-icons text-3xl">touch_app</span>
          <p className="text-sm">{t(language, 'clickToSelect')}</p>
        </div>
      ) : null}
    </div>
  );
}
