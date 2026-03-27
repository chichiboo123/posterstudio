import React from 'react';
import { PosterProvider, usePoster } from './store/posterStore';
import { t } from './i18n';
import PosterCanvas from './components/canvas/PosterCanvas';
import ToolSidebar from './components/sidebar/ToolSidebar';
import LayerPanel from './components/sidebar/LayerPanel';
import Step1Orientation from './components/panels/Step1Orientation';
import Toast from './components/common/Toast';

const TOTAL_STEPS = 6;

const stepConfig = [
  { icon: 'aspect_ratio', titleKey: 'step1' },
  { icon: 'palette', titleKey: 'step2' },
  { icon: 'text_fields', titleKey: 'step3' },
  { icon: 'add_photo_alternate', titleKey: 'step4' },
  { icon: 'event_note', titleKey: 'step5' },
  { icon: 'download', titleKey: 'step6' },
];

function ProgressSteps() {
  const { state, dispatch } = usePoster();
  const { language } = state;
  const { currentStep } = state.poster;

  return (
    <div className="flex items-center gap-1">
      {stepConfig.map((step, idx) => {
        const num = idx + 1;
        const isDone = num < currentStep;
        const isActive = num === currentStep;

        return (
          <React.Fragment key={num}>
            <button
              onClick={() => (isDone || num === currentStep) && dispatch({ type: 'SET_STEP', step: num })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-amber-400 text-white shadow-md'
                  : isDone
                  ? 'bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600'
                  : 'bg-gray-200 text-gray-400 cursor-default'
              }`}
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
              <div className={`h-px flex-1 min-w-2 transition-all ${isDone ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Header() {
  const { state, dispatch } = usePoster();
  const { language } = state;
  const { currentStep } = state.poster;

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center shadow-sm">
            <span className="material-icons text-white" style={{ fontSize: 18 }}>theater_comedy</span>
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-gray-800 leading-tight">{t(language, 'appName')}</div>
          </div>
        </div>

        {/* Progress (hidden on step 1) */}
        {currentStep > 1 && (
          <div className="flex-1 hidden md:block mx-4">
            <ProgressSteps />
          </div>
        )}

        <div className="flex items-center gap-2 ml-auto flex-shrink-0">
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
              onClick={() => { if (confirm(language === 'ko' ? '처음으로 돌아가면 작업 내용이 사라집니다. 계속하시겠습니까?' : 'All work will be lost. Continue?')) dispatch({ type: 'RESET' }); }}
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

function MainContent() {
  const { state, dispatch, canvasSize } = usePoster();
  const { currentStep } = state.poster;
  const { language } = state;

  return (
    <main className="flex-1">
      {currentStep === 1 ? (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8" style={{ minHeight: 'calc(100vh - 57px)' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-400 rounded-3xl shadow-xl mb-6">
              <span className="material-icons text-white" style={{ fontSize: 42 }}>theater_comedy</span>
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
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-amber-400 text-white hover:bg-amber-500 transition-all shadow-sm"
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
