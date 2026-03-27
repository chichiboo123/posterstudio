import React, { useState, useRef, useCallback } from 'react';
import { usePoster, genId } from '../../store/posterStore';
import { t } from '../../i18n';
import { emojiCategories } from '../../data/emojiData';
import type { PosterElement } from '../../types';

const EMOJIS_PER_PAGE = 24;

export default function Step4Media() {
  const { state, dispatch, showToast, canvasSize } = usePoster();
  const { language } = state;
  const { elements, selectedElementId } = state.poster;

  const [activeCategory, setActiveCategory] = useState(emojiCategories[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState<'emoji' | 'image'>('emoji');
  const fileRef = useRef<HTMLInputElement>(null);

  const mediaElements = elements.filter(e => e.type === 'emoji' || e.type === 'image');
  const selected = elements.find(e => e.id === selectedElementId && (e.type === 'emoji' || e.type === 'image')) ?? null;

  // Search or category items
  const displayedEmojis = searchQuery.trim()
    ? emojiCategories.flatMap(cat => cat.items).filter(item =>
        item.keywords.some(k => k.includes(searchQuery.trim())) ||
        item.emoji === searchQuery.trim()
      )
    : (emojiCategories.find(c => c.id === activeCategory)?.items ?? []);

  const totalPages = Math.ceil(displayedEmojis.length / EMOJIS_PER_PAGE);
  const pageEmojis = displayedEmojis.slice(page * EMOJIS_PER_PAGE, (page + 1) * EMOJIS_PER_PAGE);

  const addEmoji = useCallback((emoji: string) => {
    const el: PosterElement = {
      id: genId(),
      type: 'emoji',
      content: emoji,
      position: { x: Math.random() * (canvasSize.width - 80), y: Math.random() * (canvasSize.height - 80) },
      style: { fontSize: 48 },
      zIndex: Math.max(...elements.map(e => e.zIndex), 0) + 1,
    };
    dispatch({ type: 'ADD_ELEMENT', element: el });
    showToast(t(language, 'emojiAdded'));
  }, [canvasSize, elements, dispatch, showToast, language]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const el: PosterElement = {
        id: genId(),
        type: 'image',
        content: dataUrl,
        position: { x: 50, y: 50 },
        style: { fontSize: 120 },
        zIndex: Math.max(...elements.map(e => e.zIndex), 0) + 1,
      };
      dispatch({ type: 'ADD_ELEMENT', element: el });
      showToast(t(language, 'imageAdded'));
    };
    reader.readAsDataURL(file);
  }, [elements, dispatch, showToast, language]);

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
      {/* Tab */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        <button
          onClick={() => setTab('emoji')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            tab === 'emoji' ? 'bg-white shadow text-amber-600' : 'text-gray-500'
          }`}
        >
          😊 {t(language, 'addEmoji')}
        </button>
        <button
          onClick={() => setTab('image')}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            tab === 'image' ? 'bg-white shadow text-amber-600' : 'text-gray-500'
          }`}
        >
          <span className="material-icons align-middle mr-1" style={{ fontSize: 16 }}>image</span>
          {t(language, 'uploadImage')}
        </button>
      </div>

      {tab === 'emoji' ? (
        <>
          {/* Search */}
          <div className="relative">
            <span className="material-icons absolute left-3 top-2.5 text-gray-400" style={{ fontSize: 18 }}>search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
              placeholder={t(language, 'searchEmoji')}
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Categories */}
          {!searchQuery && (
            <div className="flex gap-1 flex-wrap">
              {emojiCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setPage(0); }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs transition-all ${
                    activeCategory === cat.id
                      ? 'bg-amber-100 text-amber-700 border border-amber-300'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{language === 'ko' ? cat.label : cat.labelEn}</span>
                </button>
              ))}
            </div>
          )}

          {/* Emoji grid */}
          <div className="grid grid-cols-6 gap-1">
            {pageEmojis.map((item, i) => (
              <button
                key={i}
                onClick={() => addEmoji(item.emoji)}
                className="text-2xl p-2 rounded-lg hover:bg-amber-50 transition-all hover:scale-110 active:scale-95"
                title={item.keywords[0]}
              >
                {item.emoji}
              </button>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200 text-sm"
              >
                ‹
              </button>
              <span className="px-3 py-1 text-sm text-gray-500">{page + 1} / {totalPages}</span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 disabled:opacity-40 hover:bg-gray-200 text-sm"
              >
                ›
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center gap-3 p-8 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all"
          >
            <span className="material-icons text-4xl text-gray-400">upload_file</span>
            <div className="text-sm text-gray-500 text-center">
              <div className="font-semibold">{t(language, 'uploadImage')}</div>
              <div className="text-xs mt-1">JPG, PNG, GIF</div>
            </div>
            <button className="px-4 py-2 bg-amber-400 text-white rounded-lg font-medium text-sm hover:bg-amber-500 transition-all">
              {language === 'ko' ? '파일 선택' : 'Choose File'}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/gif"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
              e.target.value = '';
            }}
          />
        </div>
      )}

      {/* Selected element size */}
      {selected && (
        <div className="mt-2 border-t pt-4">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {t(language, 'elementSize')}
            </label>
            <span className="text-sm font-bold text-amber-600">{selected.style.fontSize ?? 48}px</span>
          </div>
          <input
            type="range"
            min={20}
            max={200}
            value={selected.style.fontSize ?? 48}
            onChange={e =>
              dispatch({
                type: 'UPDATE_ELEMENT',
                id: selected.id,
                updates: { style: { ...selected.style, fontSize: Number(e.target.value) } },
              })
            }
            className="w-full accent-amber-400"
          />
        </div>
      )}

      {/* Media elements list */}
      {mediaElements.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            {t(language, 'elementsOnPoster')}
          </label>
          <div className="flex flex-col gap-1">
            {mediaElements.map(el => (
              <button
                key={el.id}
                onClick={() => dispatch({ type: 'SELECT_ELEMENT', id: el.id })}
                className={`flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-all ${
                  selectedElementId === el.id
                    ? 'bg-amber-50 border border-amber-300'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                {el.type === 'emoji' ? (
                  <span className="text-xl">{el.content}</span>
                ) : (
                  <img src={el.content} alt="" className="w-8 h-8 object-cover rounded" />
                )}
                <span className="text-gray-600 text-xs">{el.type === 'emoji' ? 'Emoji' : 'Image'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
