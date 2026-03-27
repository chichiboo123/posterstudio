import React from 'react';
import { usePoster } from '../../store/posterStore';
import { t } from '../../i18n';
import { pastelColors, gradientPresets, gradientDirections } from '../../data/fontData';
import type { Background } from '../../types';

export default function Step2Background() {
  const { state, dispatch } = usePoster();
  const { language } = state;
  const { background } = state.poster;

  const updateBg = (updates: Partial<Background>) => {
    dispatch({ type: 'SET_BACKGROUND', background: { ...background, ...updates } });
  };

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto" style={{ maxHeight: '70vh' }}>
      {/* Type toggle */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
        {(['solid', 'gradient'] as const).map(type => (
          <button
            key={type}
            onClick={() => updateBg({ type })}
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
              background.type === type
                ? 'bg-white shadow text-amber-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="material-icons align-middle mr-1" style={{ fontSize: 16 }}>
              {type === 'solid' ? 'circle' : 'gradient'}
            </span>
            {t(language, type === 'solid' ? 'solidColor' : 'gradient')}
          </button>
        ))}
      </div>

      {background.type === 'solid' ? (
        <>
          {/* Palette */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              {language === 'ko' ? '색상 팔레트' : 'Color Palette'}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {pastelColors.map((color) => (
                <button
                  key={color}
                  onClick={() => updateBg({ colors: [color] })}
                  className="w-10 h-10 rounded-lg border-2 transition-transform hover:scale-110"
                  style={{
                    background: color,
                    borderColor: background.colors[0] === color ? '#F59E0B' : 'transparent',
                    boxShadow: background.colors[0] === color ? '0 0 0 2px #F59E0B' : undefined,
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
          {/* Custom */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">{t(language, 'customColor')}</label>
            <input
              type="color"
              value={background.colors[0]}
              onChange={e => updateBg({ colors: [e.target.value] })}
              className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
            />
            <span className="text-sm text-gray-400 font-mono">{background.colors[0]}</span>
          </div>
        </>
      ) : (
        <>
          {/* Gradient colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                {t(language, 'gradientStart')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={background.colors[0]}
                  onChange={e => updateBg({ colors: [e.target.value, background.colors[1] ?? '#FFFFFF'] })}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <span className="text-xs text-gray-400 font-mono">{background.colors[0]}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">
                {t(language, 'gradientEnd')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={background.colors[1] ?? '#FFFFFF'}
                  onChange={e => updateBg({ colors: [background.colors[0], e.target.value] })}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <span className="text-xs text-gray-400 font-mono">{background.colors[1] ?? '#FFFFFF'}</span>
              </div>
            </div>
          </div>

          {/* Direction */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              {t(language, 'gradientDirection')}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {gradientDirections.map(d => (
                <button
                  key={d.id}
                  onClick={() => updateBg({ gradientDirection: d.id })}
                  className={`py-2 rounded-lg text-lg font-bold border-2 transition-all ${
                    background.gradientDirection === d.id
                      ? 'border-amber-400 bg-amber-50 text-amber-600'
                      : 'border-gray-200 bg-white text-gray-500 hover:border-amber-200'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
              {t(language, 'presets')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {gradientPresets.map((preset, i) => {
                const dir = gradientDirections.find(d => d.id === preset.direction);
                return (
                  <button
                    key={i}
                    onClick={() => updateBg({ colors: [...preset.colors], gradientDirection: preset.direction })}
                    className="h-10 rounded-lg border-2 border-transparent hover:border-amber-400 transition-all hover:scale-105"
                    style={{
                      background: `linear-gradient(${dir?.cssValue ?? 'to bottom'}, ${preset.colors[0]}, ${preset.colors[1]})`,
                    }}
                    title={preset.label}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
