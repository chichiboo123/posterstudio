import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PosterProvider, usePoster, useTheme } from './store/posterStore';
import { t } from './i18n';
import { THEMES, type Theme } from './data/themes';
import PosterCanvas from './components/canvas/PosterCanvas';
import ToolSidebar from './components/sidebar/ToolSidebar';
import LayerPanel from './components/sidebar/LayerPanel';
import Step1Orientation from './components/panels/Step1Orientation';
import Toast from './components/common/Toast';

const TOTAL_STEPS = 6;
const HEADER_HEIGHT = 52;
const FOOTER_HEIGHT = 40;
const APP_BODY_MIN_HEIGHT = `calc(100vh - ${HEADER_HEIGHT + FOOTER_HEIGHT}px)`;

const stepConfig = [
  { icon: 'aspect_ratio',        titleKey: 'step1' },
  { icon: 'palette',             titleKey: 'step2' },
  { icon: 'text_fields',         titleKey: 'step3' },
  { icon: 'add_photo_alternate', titleKey: 'step4' },
  { icon: 'event_note',          titleKey: 'step5' },
  { icon: 'download',            titleKey: 'step6' },
];

// ─── Poster SVG Icon ──────────────────────────────────────────────────────────
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

// ─── Help Modal ───────────────────────────────────────────────────────────────
function HelpModal({ onClose }: { onClose: () => void }) {
  const { state } = usePoster();
  const { language } = state;
  const tc = useTheme();

  const steps = language === 'ko' ? [
    { icon: 'aspect_ratio',        title: '방향 선택',    desc: '세로형(A4 세로) 또는 가로형(A4 가로) 포스터 방향을 선택합니다.' },
    { icon: 'palette',             title: '배경 설정',    desc: '단색 또는 그라데이션 배경색을 선택하거나 커스텀 색상을 지정합니다. 다양한 프리셋도 있습니다.' },
    { icon: 'text_fields',         title: '텍스트 추가',  desc: '텍스트를 추가하고 폰트, 크기, 색상, 방향(가로/세로/대각선)을 설정합니다. 포스터에서 드래그하여 위치를 이동할 수 있습니다.' },
    { icon: 'add_photo_alternate', title: '이미지/이모지', desc: '카테고리별 이모지를 추가하거나 기기 이모지를 직접 입력할 수 있습니다. JPG/PNG 이미지도 업로드 가능합니다.' },
    { icon: 'event_note',          title: '공연 정보',    desc: '공연 일시, 장소, 출연진, 창작진, 제작사 정보를 입력하고 포스터에 삽입합니다.' },
    { icon: 'download',            title: '내보내기',     desc: 'PNG 이미지, PDF 파일로 저장하거나 클립보드에 복사합니다.' },
  ] : [
    { icon: 'aspect_ratio',        title: 'Orientation',  desc: 'Choose portrait (A4) or landscape (A4) orientation for your poster.' },
    { icon: 'palette',             title: 'Background',   desc: 'Pick a solid color or gradient background, or use custom colors. Try the presets too.' },
    { icon: 'text_fields',         title: 'Add Text',     desc: 'Add text and customize font, size, color, and direction (horizontal/vertical/diagonal). Drag elements to reposition.' },
    { icon: 'add_photo_alternate', title: 'Image/Emoji',  desc: 'Add emoji by category, type from your device emoji picker, or upload JPG/PNG images.' },
    { icon: 'event_note',          title: 'Show Info',    desc: 'Enter performance details (date, venue, cast, crew, production) and insert them onto the poster.' },
    { icon: 'download',            title: 'Export',       desc: 'Save as PNG, PDF, or copy to clipboard.' },
  ];

  const tips = language === 'ko' ? [
    '포스터 요소를 드래그하여 위치를 자유롭게 이동할 수 있습니다.',
    '요소를 우클릭(또는 길게 터치)하면 복제, 삭제, 순서 변경 메뉴가 나타납니다.',
    '선택된 요소의 파란 원 핸들을 드래그하면 크기를 조절할 수 있습니다.',
    '헤더의 완료된 단계 버튼을 클릭하면 해당 단계로 이동할 수 있습니다.',
    '도구 패널 우측 상단의 ↺ 버튼으로 처음부터 다시 시작할 수 있습니다.',
  ] : [
    'Drag elements to freely reposition them on the poster.',
    'Right-click (or long press) an element to duplicate, delete, or reorder it.',
    'Drag the blue circle handle on a selected element to resize it.',
    'Click completed step buttons in the header to navigate back.',
    'Use the ↺ button in the tool panel to reset and start over.',
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2
            className="text-lg font-bold text-gray-800"
            style={{ fontFamily: "'Black Han Sans', sans-serif" }}
          >
            {t(language, 'helpTitle')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="p-5 flex flex-col gap-3">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white mt-0.5"
                style={{ background: tc.gradient }}
              >
                <span className="material-icons" style={{ fontSize: 16 }}>{step.icon}</span>
              </div>
              <div>
                <div className="font-semibold text-sm text-gray-800">{i + 1}. {step.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.desc}</div>
              </div>
            </div>
          ))}

          {/* Tips box */}
          <div className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
            <div className="text-xs font-semibold text-amber-700 mb-2 flex items-center gap-1">
              <span className="material-icons" style={{ fontSize: 14 }}>lightbulb</span>
              {language === 'ko' ? '꿀팁' : 'Tips'}
            </div>
            {tips.map((tip, i) => (
              <div key={i} className="flex gap-1.5 text-xs text-amber-800 mb-1 leading-relaxed">
                <span className="flex-shrink-0">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
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
              className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold transition-all"
              style={
                isActive
                  ? { background: tc.accent, color: 'white', boxShadow: `0 2px 8px ${tc.accent}66` }
                  : isDone
                  ? { background: '#10B981', color: 'white', cursor: 'pointer' }
                  : { background: '#E5E7EB', color: '#9CA3AF', cursor: 'default' }
              }
            >
              {isDone ? (
                <span className="material-icons" style={{ fontSize: 13 }}>check</span>
              ) : (
                <span className="material-icons" style={{ fontSize: 13 }}>{step.icon}</span>
              )}
              <span className="hidden lg:inline">{t(language, step.titleKey)}</span>
              <span className="lg:hidden">{num}</span>
            </button>
            {idx < TOTAL_STEPS - 1 && (
              <div
                className="h-px flex-1 min-w-1 transition-all"
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
  const [showHelp, setShowHelp] = useState(false);

  const goToStep1 = useCallback(() => {
    dispatch({ type: 'SET_STEP', step: 1 });
  }, [dispatch]);

  return (
    <>
      <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-3 py-2 flex items-center gap-3">
          {/* Logo — clicking goes to step 1 without reset */}
          <button
            onClick={goToStep1}
            className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0"
              style={{ background: tc.gradient }}
            >
              <PosterIcon size={16} color="white" />
            </div>
            <span
              className="hidden sm:block text-sm font-bold text-gray-800 leading-tight"
              style={{ fontFamily: "'Black Han Sans', sans-serif" }}
            >
              {t(language, 'appName')}
            </span>
          </button>

          {/* Progress */}
          {currentStep > 1 && (
            <div className="flex-1 hidden md:block mx-2">
              <ProgressSteps />
            </div>
          )}

          <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
            {/* Theme selector */}
            <ThemeDropdown />

            {/* Language toggle */}
            <button
              onClick={() => dispatch({ type: 'SET_LANGUAGE', language: language === 'ko' ? 'en' : 'ko' })}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span className="material-icons" style={{ fontSize: 13 }}>language</span>
              {t(language, 'langToggle')}
            </button>

            {/* Help button — to the RIGHT of lang toggle */}
            <button
              onClick={() => setShowHelp(true)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span className="material-icons" style={{ fontSize: 13 }}>help_outline</span>
              <span className="hidden sm:inline">{t(language, 'helpBtn')}</span>
            </button>
          </div>
        </div>

        {/* Mobile progress */}
        {currentStep > 1 && (
          <div className="md:hidden px-3 pb-2 overflow-x-auto">
            <ProgressSteps />
          </div>
        )}
      </header>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}
    </>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="text-center py-3 text-xs text-gray-400 border-t border-gray-100 bg-white">
      Created by.{' '}
      <a
        href="https://litt.ly/chichiboo"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-gray-700 underline underline-offset-2 transition-colors"
      >
        교육뮤지컬 꿈꾸는 치수쌤
      </a>
    </footer>
  );
}

// ─── Canvas scale helper ──────────────────────────────────────────────────────
// Callback ref so the observer fires the moment the element actually mounts.
// A regular ref + useEffect would miss the step-1 → step-2 transition because
// canvasWidth never changes and the effect never re-runs.
function useCanvasScale(canvasWidth: number) {
  const [scale, setScale] = useState(1);
  const obsRef = useRef<ResizeObserver | null>(null);

  const containerRef = useCallback(
    (el: HTMLDivElement | null) => {
      obsRef.current?.disconnect();
      obsRef.current = null;
      if (!el) return;
      const update = () => {
        const available = Math.max(60, el.clientWidth - 16);
        setScale(Math.min(1, available / canvasWidth));
      };
      update();
      const obs = new ResizeObserver(update);
      obs.observe(el);
      obsRef.current = obs;
    },
    [canvasWidth],
  );

  // Cleanup on unmount
  useEffect(() => () => { obsRef.current?.disconnect(); }, []);

  return { containerRef, scale };
}

// ─── Main Content ─────────────────────────────────────────────────────────────
function MainContent() {
  const { state, dispatch, canvasSize } = usePoster();
  const tc = useTheme();
  const { currentStep } = state.poster;
  const { language } = state;
  const { containerRef, scale: canvasScale } = useCanvasScale(canvasSize.width);

  if (currentStep === 1) {
    return (
      <main
        className="flex-1 flex flex-col items-center justify-center p-6"
        style={{ minHeight: APP_BODY_MIN_HEIGHT, background: tc.heroBg }}
      >
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl shadow-xl mb-6"
            style={{ background: tc.gradient }}
          >
            <PosterIcon size={44} color="white" />
          </div>
          <h1
            className="text-4xl font-bold text-gray-800 mb-3"
            style={{ fontFamily: "'Black Han Sans', sans-serif" }}
          >
            {t(language, 'appName')}
          </h1>
          <p className="text-gray-500 text-lg">{t(language, 'appSubtitle')}</p>
        </div>
        <Step1Orientation />
      </main>
    );
  }

  return (
    <main className="flex-1" style={{ background: '#f0f0f5' }}>
      {/* Single responsive layout: canvas first in DOM (top on mobile, center on desktop) */}
      <div
        className="flex flex-col md:flex-row gap-2 p-2 items-start"
        style={{ minHeight: APP_BODY_MIN_HEIGHT }}
      >

        {/* Canvas — order-first on mobile, order-2 on desktop */}
        <div
          ref={containerRef}
          className="md:order-2 flex-1 min-w-0 w-full"
        >
          <div className="bg-white rounded-xl shadow-md p-2">
            {/* Nav bar above canvas */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <span className="material-icons" style={{ fontSize: 13 }}>aspect_ratio</span>
                {canvasSize.width} × {canvasSize.height}
              </span>
              <div className="flex gap-1.5">
                {currentStep > 2 && (
                  <button
                    onClick={() => dispatch({ type: 'SET_STEP', step: currentStep - 1 })}
                    className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-xs border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    <span className="material-icons" style={{ fontSize: 13 }}>chevron_left</span>
                    {t(language, 'prev')}
                  </button>
                )}
                {currentStep < TOTAL_STEPS && (
                  <button
                    onClick={() => dispatch({ type: 'SET_STEP', step: currentStep + 1 })}
                    className="flex items-center gap-0.5 px-2.5 py-1 rounded-lg text-xs text-white transition-all shadow-sm"
                    style={{ background: tc.accent }}
                    onMouseEnter={e => (e.currentTarget.style.background = tc.accentHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = tc.accent)}
                  >
                    {t(language, 'next')}
                    <span className="material-icons" style={{ fontSize: 13 }}>chevron_right</span>
                  </button>
                )}
              </div>
            </div>
            {/* Canvas — centered in its container */}
            <div className="flex justify-center">
              <PosterCanvas scale={canvasScale} />
            </div>
          </div>
        </div>

        {/* Tool sidebar — order-2 on mobile (below canvas), order-1 on desktop (left) */}
        <div className="md:order-1 w-full md:w-[300px] flex-shrink-0 md:sticky md:top-[52px] md:self-start">
          <ToolSidebar />
        </div>

        {/* Layer panel — only on large screens */}
        <div className="hidden lg:block md:order-3 flex-shrink-0 sticky top-[52px] self-start">
          <LayerPanel />
        </div>
      </div>
    </main>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
function AppInner() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <MainContent />
      <Footer />
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
