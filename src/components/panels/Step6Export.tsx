import React, { useState } from 'react';
import { usePoster, useTheme, buildShareUrl } from '../../store/posterStore';
import { t } from '../../i18n';

export default function Step6Export() {
  const { state, dispatch, showToast, canvasSize } = usePoster();
  const tc = useTheme();
  const { language } = state;
  const [busy, setBusy] = useState<string | null>(null); // track which button is active

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const { default: html2canvas } = await import('html2canvas');
    const el = document.getElementById('poster-canvas');
    if (!el) return null;

    dispatch({ type: 'SELECT_ELEMENT', id: null });
    await new Promise(r => setTimeout(r, 80));

    return html2canvas(el, {
      useCORS: true,
      scale: 2,
      backgroundColor: null,
      onclone: (doc) => {
        doc.querySelectorAll('[style*="outline"]').forEach(e => (e as HTMLElement).style.outline = 'none');
        doc.querySelectorAll('.resize-handle').forEach(e => e.remove());
      },
    });
  };

  // ── Export handlers ────────────────────────────────────────────────────────
  const exportJpg = async () => {
    setBusy('jpg');
    try {
      const canvas = await getCanvas();
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = 'musical-poster.jpg';
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
      showToast(language === 'ko' ? 'JPG로 저장되었습니다' : 'Saved as JPG');
    } catch {
      showToast(t(language, 'exporting'), 'error');
    } finally {
      setBusy(null);
    }
  };

  const exportPdf = async () => {
    setBusy('pdf');
    try {
      const canvas = await getCanvas();
      if (!canvas) return;
      const { jsPDF } = await import('jspdf');
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const orientation = canvasSize.width > canvasSize.height ? 'l' : 'p';
      const pdf = new jsPDF({ orientation, unit: 'px', format: [canvasSize.width, canvasSize.height] });
      pdf.addImage(imgData, 'JPEG', 0, 0, canvasSize.width, canvasSize.height);
      pdf.save('musical-poster.pdf');
      showToast(t(language, 'exportedPdf'));
    } catch {
      showToast(t(language, 'exporting'), 'error');
    } finally {
      setBusy(null);
    }
  };

  const shareLink = async () => {
    setBusy('link');
    try {
      const url = buildShareUrl(state.poster);
      // Warn if URL is very large (contains images)
      if (url.length > 60000) {
        showToast(t(language, 'linkTooLarge'), 'info');
      }
      await navigator.clipboard.writeText(url);
      showToast(t(language, 'linkCopied'));
    } catch {
      // Fallback: show in prompt
      const url = buildShareUrl(state.poster);
      window.prompt(language === 'ko' ? '링크를 복사하세요:' : 'Copy this link:', url);
    } finally {
      setBusy(null);
    }
  };

  const exportClipboard = async () => {
    setBusy('clip');
    try {
      const canvas = await getCanvas();
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        showToast(t(language, 'copiedClipboard'));
      });
    } catch {
      showToast(language === 'ko' ? '클립보드 복사가 지원되지 않습니다' : 'Clipboard not supported', 'error');
    } finally {
      setBusy(null);
    }
  };

  // ── Button config: JPG → PDF → Link → Clipboard ────────────────────────────
  const buttons = [
    {
      id: 'jpg',
      icon: 'image',
      label: t(language, 'exportJpg'),
      action: exportJpg,
      bg: '#2563EB',
    },
    {
      id: 'pdf',
      icon: 'picture_as_pdf',
      label: t(language, 'exportPdf').replace('Save ', '').replace('저장', ''),
      action: exportPdf,
      bg: '#DC2626',
    },
    {
      id: 'link',
      icon: 'link',
      label: t(language, 'exportLink'),
      action: shareLink,
      bg: tc.accent,
    },
    {
      id: 'clip',
      icon: 'content_copy',
      label: language === 'ko' ? '복사' : 'Copy',
      action: exportClipboard,
      bg: '#4B5563',
    },
  ];

  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-xs text-gray-500">
        {language === 'ko'
          ? '완성된 포스터를 저장하거나 공유하세요.'
          : 'Save or share your finished poster.'}
      </p>

      {/* 4 compact icon buttons in one row */}
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn) => {
          const isActive = busy === btn.id;
          return (
            <button
              key={btn.id}
              onClick={btn.action}
              disabled={busy !== null}
              className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-white transition-all shadow-sm hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: btn.bg }}
              title={btn.label}
            >
              <span className="material-icons" style={{ fontSize: 22 }}>
                {isActive ? 'hourglass_top' : btn.icon}
              </span>
              <span className="text-xs font-medium leading-none">{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Link share info box */}
      <div className="p-3 rounded-xl border text-xs" style={{ background: tc.accentLight, borderColor: tc.accentBorder }}>
        <div className="flex items-start gap-1.5">
          <span className="material-icons flex-shrink-0" style={{ fontSize: 14, color: tc.accentText }}>link</span>
          <span style={{ color: tc.accentText }}>
            {language === 'ko'
              ? '링크 공유: 현재 포스터 상태 전체가 URL에 담겨 전달됩니다. 받는 사람이 링크를 열면 같은 포스터를 이어서 편집하거나 저장할 수 있습니다.'
              : 'Share Link: The full poster state is encoded in the URL. Recipients can open the link to view and continue editing the same poster.'}
          </span>
        </div>
      </div>

      <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-500 flex items-start gap-1.5">
        <span className="material-icons flex-shrink-0" style={{ fontSize: 14 }}>info</span>
        <span>
          {language === 'ko'
            ? '선택 표시 및 핸들은 내보내기에서 자동으로 제외됩니다. JPG/PDF는 고해상도(2×)로 저장됩니다.'
            : 'Selection handles are excluded from exports. JPG/PDF are saved at 2× resolution.'}
        </span>
      </div>
    </div>
  );
}
