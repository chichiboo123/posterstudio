import React from 'react';
import { usePoster, useTheme } from '../../store/posterStore';
import { t } from '../../i18n';

export default function Step1Orientation() {
  const { state, dispatch } = usePoster();
  const tc = useTheme();
  const { language } = state;
  const { orientation } = state.poster;

  const select = (o: 'portrait' | 'landscape') => {
    dispatch({ type: 'SET_ORIENTATION', orientation: o });
    dispatch({ type: 'SET_STEP', step: 2 });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t(language, 'chooseOrientation')}</h2>
        <p className="text-gray-500 text-sm">
          {language === 'ko' ? '포스터의 방향을 먼저 선택하세요' : 'Select the orientation for your poster'}
        </p>
      </div>

      <div className="flex gap-8 flex-wrap justify-center">
        {/* Portrait */}
        <button
          onClick={() => select('portrait')}
          className="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border-2 bg-white transition-all duration-200 hover:shadow-lg cursor-pointer"
          style={{
            minWidth: 180,
            borderColor: orientation === 'portrait' ? tc.accent : '#E5E7EB',
            background: orientation === 'portrait' ? tc.accentLight : 'white',
            boxShadow: orientation === 'portrait' ? `0 4px 16px ${tc.accent}33` : undefined,
          }}
        >
          {orientation === 'portrait' && (
            <div
              className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: tc.accent }}
            >
              <span className="material-icons text-white" style={{ fontSize: 14 }}>check</span>
            </div>
          )}
          <div
            className="rounded-lg"
            style={{
              width: 80,
              height: 113,
              background: orientation === 'portrait' ? tc.gradient : '#E5E7EB',
              border: '2px solid rgba(0,0,0,0.08)',
            }}
          />
          <div className="text-center">
            <div className="font-bold text-gray-800 text-lg">{t(language, 'portrait')}</div>
            <div className="text-xs text-gray-500 mt-1">{t(language, 'portraitDesc')}</div>
          </div>
          <span
            className="material-icons transition-colors"
            style={{ color: orientation === 'portrait' ? tc.accent : '#9CA3AF' }}
          >
            crop_portrait
          </span>
        </button>

        {/* Landscape */}
        <button
          onClick={() => select('landscape')}
          className="group relative flex flex-col items-center gap-4 p-8 rounded-2xl border-2 bg-white transition-all duration-200 hover:shadow-lg cursor-pointer"
          style={{
            minWidth: 180,
            borderColor: orientation === 'landscape' ? tc.accent : '#E5E7EB',
            background: orientation === 'landscape' ? tc.accentLight : 'white',
            boxShadow: orientation === 'landscape' ? `0 4px 16px ${tc.accent}33` : undefined,
          }}
        >
          {orientation === 'landscape' && (
            <div
              className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: tc.accent }}
            >
              <span className="material-icons text-white" style={{ fontSize: 14 }}>check</span>
            </div>
          )}
          <div
            className="rounded-lg"
            style={{
              width: 113,
              height: 80,
              background: orientation === 'landscape' ? tc.gradient : '#E5E7EB',
              border: '2px solid rgba(0,0,0,0.08)',
            }}
          />
          <div className="text-center">
            <div className="font-bold text-gray-800 text-lg">{t(language, 'landscape')}</div>
            <div className="text-xs text-gray-500 mt-1">{t(language, 'landscapeDesc')}</div>
          </div>
          <span
            className="material-icons transition-colors"
            style={{ color: orientation === 'landscape' ? tc.accent : '#9CA3AF' }}
          >
            crop_landscape
          </span>
        </button>
      </div>
    </div>
  );
}
