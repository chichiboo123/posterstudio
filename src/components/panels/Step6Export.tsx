import React, { useState } from 'react';
import { usePoster } from '../../store/posterStore';
import { t } from '../../i18n';

export default function Step6Export() {
  const { state, dispatch, showToast, canvasSize } = usePoster();
  const { language } = state;
  const [exporting, setExporting] = useState(false);

  const getCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const { default: html2canvas } = await import('html2canvas');
    const el = document.getElementById('poster-canvas');
    if (!el) return null;

    // Deselect to hide handles
    dispatch({ type: 'SELECT_ELEMENT', id: null });
    await new Promise(r => setTimeout(r, 100));

    return html2canvas(el, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      onclone: (doc) => {
        // Remove selection outlines
        doc.querySelectorAll('[style*="outline"]').forEach(el => {
          (el as HTMLElement).style.outline = 'none';
        });
        // Remove resize handles
        doc.querySelectorAll('.resize-handle').forEach(el => el.remove());
      },
    });
  };

  const exportPng = async () => {
    setExporting(true);
    try {
      const canvas = await getCanvas();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'musical-poster.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast(t(language, 'exportedPng'));
    } catch (e) {
      showToast(t(language, 'exporting'), 'error');
    } finally {
      setExporting(false);
    }
  };

  const exportPdf = async () => {
    setExporting(true);
    try {
      const canvas = await getCanvas();
      if (!canvas) return;
      const { jsPDF } = await import('jspdf');
      const imgData = canvas.toDataURL('image/png');
      const orientation = canvasSize.width > canvasSize.height ? 'l' : 'p';
      const pdf = new jsPDF({ orientation, unit: 'px', format: [canvasSize.width, canvasSize.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvasSize.width, canvasSize.height);
      pdf.save('musical-poster.pdf');
      showToast(t(language, 'exportedPdf'));
    } catch (e) {
      showToast(t(language, 'exporting'), 'error');
    } finally {
      setExporting(false);
    }
  };

  const exportClipboard = async () => {
    setExporting(true);
    try {
      const canvas = await getCanvas();
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast(t(language, 'copiedClipboard'));
      });
    } catch (e) {
      showToast(language === 'ko' ? '클립보드 복사가 지원되지 않습니다' : 'Clipboard not supported', 'error');
    } finally {
      setExporting(false);
    }
  };

  const buttons = [
    { icon: 'download', label: t(language, 'exportPng'), action: exportPng, color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: 'picture_as_pdf', label: t(language, 'exportPdf'), action: exportPdf, color: 'bg-red-500 hover:bg-red-600' },
    { icon: 'content_copy', label: t(language, 'exportClipboard'), action: exportClipboard, color: 'bg-gray-600 hover:bg-gray-700' },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-sm text-gray-500">
        {language === 'ko'
          ? '완성된 포스터를 다운로드하거나 클립보드에 복사하세요.'
          : 'Download or copy your finished poster.'}
      </p>

      <div className="flex flex-col gap-3">
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            disabled={exporting}
            className={`flex items-center gap-3 w-full py-3 px-5 ${btn.color} text-white font-semibold rounded-xl transition-all shadow hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <span className="material-icons">{btn.icon}</span>
            {exporting ? t(language, 'exporting') : btn.label}
          </button>
        ))}
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-2">
          <span className="material-icons text-amber-500" style={{ fontSize: 18 }}>info</span>
          <div className="text-xs text-amber-700">
            {language === 'ko'
              ? '선택 표시 및 핸들은 내보내기에서 자동으로 제외됩니다. 고해상도(2x)로 저장됩니다.'
              : 'Selection indicators are excluded from exports. Saved at 2x resolution.'}
          </div>
        </div>
      </div>
    </div>
  );
}
