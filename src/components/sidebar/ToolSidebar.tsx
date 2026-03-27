import React from 'react';
import { usePoster, useTheme } from '../../store/posterStore';
import { t } from '../../i18n';
import Step2Background from '../panels/Step2Background';
import Step3Text from '../panels/Step3Text';
import Step4Media from '../panels/Step4Media';
import Step5Performance from '../panels/Step5Performance';
import Step6Export from '../panels/Step6Export';

const stepIcons: Record<number, string> = {
  1: 'aspect_ratio',
  2: 'palette',
  3: 'text_fields',
  4: 'add_photo_alternate',
  5: 'event_note',
  6: 'download',
};

const stepTitles: Record<number, string> = {
  1: 'step1', 2: 'step2', 3: 'step3', 4: 'step4', 5: 'step5', 6: 'step6',
};

export default function ToolSidebar() {
  const { state, dispatch } = usePoster();
  const tc = useTheme();
  const { language } = state;
  const { currentStep } = state.poster;

  if (currentStep === 1) return null;

  const handleReset = () => {
    if (window.confirm(language === 'ko'
      ? '모든 작업 내용이 초기화됩니다. 계속하시겠습니까?'
      : 'All work will be reset. Continue?'
    )) {
      dispatch({ type: 'RESET' });
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden w-full">
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 text-white"
        style={{ background: tc.gradient }}
      >
        <span className="material-icons">{stepIcons[currentStep]}</span>
        <span className="font-semibold">{t(language, stepTitles[currentStep])}</span>
      </div>

      {/* Step nav tabs + reset */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-100 overflow-x-auto">
        {[2, 3, 4, 5, 6].map(s => (
          <button
            key={s}
            onClick={() => dispatch({ type: 'SET_STEP', step: s })}
            className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-all flex-shrink-0"
            style={
              currentStep === s
                ? { background: tc.accentLight, color: tc.accentText }
                : { color: '#9CA3AF' }
            }
          >
            <span className="material-icons" style={{ fontSize: 18 }}>{stepIcons[s]}</span>
            <span style={{ fontSize: 10 }}>{t(language, stepTitles[s])}</span>
          </button>
        ))}

        {/* Reset icon button */}
        <div className="ml-auto flex-shrink-0">
          <button
            onClick={handleReset}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
            title={language === 'ko' ? '초기화' : 'Reset'}
          >
            <span className="material-icons" style={{ fontSize: 18 }}>restart_alt</span>
          </button>
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden">
        {currentStep === 2 && <Step2Background />}
        {currentStep === 3 && <Step3Text />}
        {currentStep === 4 && <Step4Media />}
        {currentStep === 5 && <Step5Performance />}
        {currentStep === 6 && <Step6Export />}
      </div>
    </div>
  );
}
