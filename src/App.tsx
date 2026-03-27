import React, { useState, useRef, useEffect } from 'react';
import { PosterProvider, usePoster, useTheme } from './store/posterStore';
import { t } from './i18n';
import { THEMES, type Theme } from './data/themes';
import PosterCanvas from './components/canvas/PosterCanvas';
import ToolSidebar from './components/sidebar/ToolSidebar';
import LayerPanel from './components/sidebar/LayerPanel';
import Step1Orientation from './components/panels/Step1Orientation';
import Toast from './components/common/Toast';

const TOTAL_STEPS = 6;

const stepConfig = [
  { icon: 'aspect_ratio',       titleKey: 'step1' },
  { icon: 'palette',            titleKey: 'step2' },
  { icon: 'text_fields',        titleKey: 'step3' },
  { icon: 'add_photo_alternate',titleKey: 'step4' },
  { icon: 'event_note',         titleKey: 'step5' },
  { icon: 'download',           titleKey: 'step6' },
];

// ─── Poster SVG Icon ─────────────────────────────────────────────────────────
function PosterIcon({ size = 24, color = 'white' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="1" width="18" height="22" rx="2" fill={color} fillOpacity="0.25" stroke={color} strokeWidth="1.5"/>
      <rect x="3" y="1" width="18" height="7" rx="2" fill={color} fillOpacity="0.5"/>
      <polygon points="12,3 13,5.5 15.5,5.5 13.5,7 14.5,9.5 12,8 9.5,9.5 10.5,7 8.5,5.5 11,5.5" fill={color}/>
      <rect x="6" y="11" width="12" height="1.5" rx="0.75" fill={color} fillOpacity="0.7"/>
      <rect x="7" y="14" width="10" height="1.2" rx="0.6" fill={color} fillOpacity="0.5"/>
      <rect x="7" y="17" width="10" height="1.2" rx="0.6" fill={color} fillOpacity="0.5"/>
      <rect x="6" y="20" width="12" height="1.2" rx="0.6" fill={color} fillOpacity="0.35"/>
    </svg>
  );
}

// ─── Theme Dropdown ───────────────────────────────────────────────────────────
function ThemeDropdown() {
  const { state, dispatch } = usePoster();
  const { language, theme } = state;
  const tc = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const themeOrder: Theme[] = ['blue', 'green', 'yellow', 'pink'];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all"
        style={{ borderColor: tc.accentBorder, background: open ? tc.accentLight : undefined }}
      >
        <span
          className="w-3 h-3 rounded-full border border-white shadow-sm flex-shrink-0"
          style={{ background: tc.accent }}
        />
        <span className="hidden sm:inline">
          {language === 'ko' ? THEMES[theme].label : THEMES[theme].labelEn}
        </span>
        <span className="material-icons" style={{ fontSize: 14 }}>
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 min-w-[160px]">
          <div className="px-3 py-1 mb-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {language === 'ko' ? '테마 색상' : 'Theme Color'}
            </span>
          </div>
          {themeOrder.map(th => {
            const isActive = theme === th;
            return (
              <button
                key={th}
                onClick={() => { dispatch({ type: 'SET_THEME', theme: th }); setOpen(false); }}
                className="flex items-center gap-3 w-full px-4 py-2 text-sm transition-all hover:bg-gray-50"
              >
                <span
                  className="w-5 h-5 rounded-full border-2 shadow-sm flex-shrink-0"
                  style={{
                    background: THEMES[th].gradient,
                    borderColor: isActive ? THEMES[th].accentText : 'transparent',
                  }}
                />
                <span className={`font-medium ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                  {language === 'ko' ? THEMES[th].label : THEMES[th].labelEn}
                </span>
                {isActive && (
                  <span className="material-icons ml-auto" style={{ fontSize: 16, color: THEMES[th].accentText }}>
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Progress Steps ───────────────────────────────────────────────────────────
function ProgressSteps() {
  const { state, dispatch } = usePoster();
  const tc = useTheme();
  const { language } = state;
  const { currentStep } = state.poster;

  return (
    <div className="flex items-center gap-1">
      {stepConfig.map((step, idx) => {
        const num = idx + 1;
        const isDone   = num < currentStep;
        const isActive = num === currentStep;

        return (
          <React.Fragment key={num}>
            <button
              onClick={() => (isDone || isActive) && dispatch({ type: 'SET_STEP', step: num })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={
                isActive
                  ? { background: tc.accent, color: 'white', boxShadow: `0 2px 8px ${tc.accent}66` }
                  : isDone
                  ? { background: '#10B981', color: 'white', cursor: 'pointer' }
                  : { background: '#E5E7EB', color: '#9CA3AF', cursor: 'default' }
              }
            >
              {isDone ? (
                <span className="material-icons" style={{ fontSize: 14 }}>check</span>
              ) : (
                <span className="material-icons" style={{ fontSize: 14 }}>{step.icon}</span>
              )}
              <span className="hidden sm:inline">{t(language, step.titleKey)}</span>
              <span className="sm:hidden">{num}</span>
            </button>
            {idx < TOTAL_STEPS - 1 && (
              <div
                className="h-px flex-1 min-w-2 transition-all"
                style={{ background: isDone ? '#10B981' : '#E5E7EB' }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header() {
  const { state, dispatch } = usePoster();
  const tc = useTheme();
  const { language } = state;
  const { currentStep } = state.poster;

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
            style={{ background: tc.gradient }}
          >
            <PosterIcon size={18} color="white" />
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-gray-800 leading-tight">{t(language, 'appName')}</div>
          </div>
        </div>

        {/* Progress */}
        {currentStep > 1 && (
          <div className="flex-1 hidden md:block mx-4">
            <ProgressSteps />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
          {/* Theme selector */}
          <ThemeDropdown />

          {/* Language toggle */}
          <button
            onClick={() => dispatch({ type: 'SET_LANGUAGE', language: language === 'ko' ? 'en' : 'ko' })}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all"
          >
            <span className="material-icons" style={{ fontSize: 14 }}>language</span>
            {t(language, 'langToggle')}
          </button>

          {/* Home button */}
          {currentStep > 1 && (
            <button
              onClick={() => {
                if (confirm(language === 'ko'
                  ? '처음으로 돌아가면 작업 내용이 사라집니다. 계속하시겠습니까?'
                  : 'All work will be lost. Continue?'
                )) dispatch({ type: 'RESET' });
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span className="material-icons" style={{ fontSize: 14 }}>home</span>
              <span className="hidden sm:inline">{t(language, 'goHome')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile progress */}
      {currentStep > 1 && (
        <div className="md:hidden px-4 pb-3 overflow-x-auto">
          <ProgressSteps />
        </div>
      )}
    </header>
  );
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function MainContent() {
  const { state, dispatch, canvasSize } = usePoster();
  const tc = useTheme();
  const { currentStep } = state.poster;
  const { language } = state;

  return (
    <main className="flex-1">
      {currentStep === 1 ? (
        <div
          className="flex flex-col items-center justify-center p-8"
          style={{ minHeight: 'calc(100vh - 57px)', background: tc.heroBg }}
        >
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-xl mb-6"
              style={{ background: tc.gradient }}
            >
              <PosterIcon size={44} color="white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-3">{t(language, 'appName')}</h1>
            <p className="text-gray-500 text-lg">{t(language, 'appSubtitle')}</p>
          </div>
          <Step1Orientation />
        </div>
      ) : (
        <div
          className="flex gap-4 p-4 items-start"
          style={{ minHeight: 'calc(100vh - 57px)', background: '#f0f0f5' }}
        >
          {/* Left: Tool Sidebar */}
          <div className="flex-shrink-0 sticky top-20 self-start">
            <ToolSidebar />
          </div>

          {/* Center: Canvas */}
          <div className="flex flex-col items-center gap-4 flex-1 min-w-0">
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <span className="material-icons" style={{ fontSize: 14 }}>aspect_ratio</span>
                  {canvasSize.width} × {canvasSize.height} px
                </span>
                <div className="flex gap-2">
                  {currentStep > 2 && (
                    <button
                      onClick={() => dispatch({ type: 'SET_STEP', step: currentStep - 1 })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                    >
                      <span className="material-icons" style={{ fontSize: 14 }}>chevron_left</span>
                      {t(language, 'prev')}
                    </button>
                  )}
                  {currentStep < TOTAL_STEPS && (
                    <button
                      onClick={() => dispatch({ type: 'SET_STEP', step: currentStep + 1 })}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-white transition-all shadow-sm"
                      style={{ background: tc.accent }}
                      onMouseEnter={e => (e.currentTarget.style.background = tc.accentHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = tc.accent)}
                    >
                      {t(language, 'next')}
                      <span className="material-icons" style={{ fontSize: 14 }}>chevron_right</span>
                    </button>
                  )}
                </div>
              </div>
              <PosterCanvas />
            </div>
          </div>

          {/* Right: Layer panel */}
          <div className="flex-shrink-0 hidden lg:block sticky top-20 self-start">
            <LayerPanel />
          </div>
        </div>
      )}
    </main>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function AppInner() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <MainContent />
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <PosterProvider>
      <AppInner />
    </PosterProvider>
  );
}
