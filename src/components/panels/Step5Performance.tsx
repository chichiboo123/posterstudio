import React from 'react';
import { usePoster, genId, useTheme } from '../../store/posterStore';
import { t } from '../../i18n';
import type { PerformanceInfo, PosterElement } from '../../types';

type FieldKey = keyof PerformanceInfo;

interface FieldConfig {
  key: FieldKey;
  labelKey: string;
  placeholder: { ko: string; en: string };
  icon: string;
}

const fields: FieldConfig[] = [
  { key: 'date', labelKey: 'perfDate', placeholder: { ko: '2026년 3월 27일 19:30', en: 'March 27, 2026 7:30PM' }, icon: 'event' },
  { key: 'venue', labelKey: 'perfVenue', placeholder: { ko: '치수쌤 씨어터 1관', en: 'Chisoo Theater Hall 1' }, icon: 'location_on' },
  { key: 'cast', labelKey: 'perfCast', placeholder: { ko: '홍길동, 김민지, 이수현', en: 'John, Jane, Bob' }, icon: 'people' },
  { key: 'crew', labelKey: 'perfCrew', placeholder: { ko: '연출: 김감독, 음악: 이작곡', en: 'Director: Kim, Music: Lee' }, icon: 'manage_accounts' },
  { key: 'production', labelKey: 'perfProduction', placeholder: { ko: '(주)뮤지컬프로덕션', en: 'Musical Productions Inc.' }, icon: 'business' },
];

export default function Step5Performance() {
  const tc = useTheme();
  const { state, dispatch, showToast } = usePoster();
  const { language } = state;
  const { performanceInfo, elements } = state.poster;

  const updateInfo = (key: FieldKey, value: string) => {
    dispatch({ type: 'SET_PERFORMANCE_INFO', info: { ...performanceInfo, [key]: value } });
  };

  const insertField = (key: FieldKey, yOffset = 0) => {
    const value = performanceInfo[key];
    if (!value) return;

    const el: PosterElement = {
      id: genId(),
      type: 'text',
      content: value,
      position: { x: 20, y: 420 + yOffset },
      style: {
        fontSize: 16,
        color: '#333333',
        fontFamily: "'Noto Sans KR', sans-serif",
        fontWeight: 'normal',
        fontStyle: 'normal',
        direction: 'horizontal',
      },
      zIndex: Math.max(...elements.map(e => e.zIndex), 0) + 1,
    };
    dispatch({ type: 'ADD_ELEMENT', element: el });
    showToast(t(language, 'infoInserted'));
  };

  const insertAll = () => {
    const populated = fields.filter(f => performanceInfo[f.key]);
    if (populated.length === 0) return;

    populated.forEach((f, i) => {
      const value = performanceInfo[f.key];
      if (!value) return;
      const el: PosterElement = {
        id: genId(),
        type: 'text',
        content: value,
        position: { x: 20, y: 420 + i * 30 },
        style: {
          fontSize: 15,
          color: '#333333',
          fontFamily: "'Noto Sans KR', sans-serif",
          fontWeight: 'normal',
          fontStyle: 'normal',
          direction: 'horizontal',
        },
        zIndex: Math.max(...elements.map(e => e.zIndex), 0) + i + 1,
      };
      dispatch({ type: 'ADD_ELEMENT', element: el });
    });
    showToast(t(language, 'infoInserted'));
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
      <p className="text-xs text-gray-500">
        {language === 'ko'
          ? '공연 정보를 입력하고 삽입 버튼을 눌러 포스터에 추가하세요.'
          : 'Enter performance info and click Insert to add to poster.'}
      </p>

      {fields.map(field => (
        <div key={field.key} className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span className="material-icons" style={{ fontSize: 14 }}>{field.icon}</span>
              {t(language, field.labelKey)}
            </label>
            <button
              onClick={() => insertField(field.key)}
              disabled={!performanceInfo[field.key]}
              className="text-xs px-2 py-1 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: tc.accentLight, color: tc.accentText }}
            >
              {t(language, 'insertBtn')}
            </button>
          </div>
          <input
            type="text"
            value={performanceInfo[field.key] ?? ''}
            onChange={e => updateInfo(field.key, e.target.value)}
            placeholder={field.placeholder[language]}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors"
            onFocus={e => (e.currentTarget.style.borderColor = tc.accent)}
            onBlur={e => (e.currentTarget.style.borderColor = '#E5E7EB')}
          />
        </div>
      ))}

      <button
        onClick={insertAll}
        disabled={!fields.some(f => performanceInfo[f.key])}
        className="flex items-center justify-center gap-2 w-full py-3 text-white font-semibold rounded-xl transition-all shadow-sm hover:shadow disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: tc.accent }}
        onMouseEnter={e => (e.currentTarget.style.background = tc.accentHover)}
        onMouseLeave={e => (e.currentTarget.style.background = tc.accent)}
      >
        <span className="material-icons" style={{ fontSize: 20 }}>playlist_add</span>
        {t(language, 'insertAll')}
      </button>
    </div>
  );
}
