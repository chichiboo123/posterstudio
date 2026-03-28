import React, { createContext, useContext, useReducer, useCallback, useEffect, type ReactNode } from 'react';
import type { PosterState, PosterElement, Background, PerformanceInfo, Language } from '../types';
import { type Theme, THEMES } from '../data/themes';

// ─── State ───────────────────────────────────────────────────────────────────

interface AppState {
  poster: PosterState;
  language: Language;
  theme: Theme;
  toast: { id: number; message: string; type: 'success' | 'error' | 'info' } | null;
}

const initialPoster: PosterState = {
  currentStep: 1,
  orientation: 'portrait',
  elements: [],
  background: {
    type: 'solid',
    colors: ['#FFFFFF'],
    gradientDirection: 'to-b',
  },
  performanceInfo: {},
  selectedElementId: null,
};

// ─── URL state (link sharing) ─────────────────────────────────────────────────

/** Decode poster state from the URL hash (#state=...) on page load. */
function decodeStateFromUrl(): PosterState | null {
  try {
    if (typeof window === 'undefined') return null;
    const m = window.location.hash.match(/[#&]?state=([A-Za-z0-9_-]+)/);
    if (!m) return null;
    const base64 = m[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(escape(atob(base64)));
    const poster = JSON.parse(json) as PosterState;
    // Recipients should see the canvas, not the orientation picker
    if (poster.currentStep <= 1) poster.currentStep = 2;
    poster.selectedElementId = null;
    return poster;
  } catch {
    return null;
  }
}

/** Encode poster state into a URL-safe base64 string. */
export function encodeStateForUrl(poster: PosterState): string {
  const json = JSON.stringify({ ...poster, selectedElementId: null });
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** Compute the full shareable URL for the current poster. */
export function buildShareUrl(poster: PosterState): string {
  const encoded = encodeStateForUrl(poster);
  return `${window.location.origin}${window.location.pathname}#state=${encoded}`;
}

function getInitialState(): AppState {
  const urlPoster = decodeStateFromUrl();
  return {
    poster: urlPoster ?? initialPoster,
    language: 'ko',
    theme: 'blue',
    toast: null,
  };
}

// ─── Actions ─────────────────────────────────────────────────────────────────

type Action =
  | { type: 'SET_STEP'; step: number }
  | { type: 'SET_ORIENTATION'; orientation: 'portrait' | 'landscape' }
  | { type: 'ADD_ELEMENT'; element: PosterElement }
  | { type: 'UPDATE_ELEMENT'; id: string; updates: Partial<PosterElement> }
  | { type: 'DELETE_ELEMENT'; id: string }
  | { type: 'DUPLICATE_ELEMENT'; id: string }
  | { type: 'SELECT_ELEMENT'; id: string | null }
  | { type: 'SET_BACKGROUND'; background: Background }
  | { type: 'SET_PERFORMANCE_INFO'; info: PerformanceInfo }
  | { type: 'MOVE_TO_FRONT'; id: string }
  | { type: 'MOVE_TO_BACK'; id: string }
  | { type: 'MOVE_FORWARD'; id: string }
  | { type: 'MOVE_BACKWARD'; id: string }
  | { type: 'SET_LANGUAGE'; language: Language }
  | { type: 'SET_THEME'; theme: Theme }
  | { type: 'SHOW_TOAST'; message: string; toastType: 'success' | 'error' | 'info' }
  | { type: 'HIDE_TOAST' }
  | { type: 'RESET' };

// ─── Reducer ─────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  const { poster } = state;

  switch (action.type) {
    case 'SET_STEP':
      return { ...state, poster: { ...poster, currentStep: action.step } };

    case 'SET_ORIENTATION':
      return { ...state, poster: { ...poster, orientation: action.orientation } };

    case 'ADD_ELEMENT':
      return {
        ...state,
        poster: {
          ...poster,
          elements: [...poster.elements, action.element],
          selectedElementId: action.element.id,
        },
      };

    case 'UPDATE_ELEMENT':
      return {
        ...state,
        poster: {
          ...poster,
          elements: poster.elements.map(el =>
            el.id === action.id ? { ...el, ...action.updates } : el
          ),
        },
      };

    case 'DELETE_ELEMENT':
      return {
        ...state,
        poster: {
          ...poster,
          elements: poster.elements.filter(el => el.id !== action.id),
          selectedElementId:
            poster.selectedElementId === action.id ? null : poster.selectedElementId,
        },
      };

    case 'DUPLICATE_ELEMENT': {
      const src = poster.elements.find(el => el.id === action.id);
      if (!src) return state;
      const newEl: PosterElement = {
        ...src,
        id: `el-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        position: { x: src.position.x + 20, y: src.position.y + 20 },
        zIndex: Math.max(...poster.elements.map(e => e.zIndex), 0) + 1,
      };
      return {
        ...state,
        poster: {
          ...poster,
          elements: [...poster.elements, newEl],
          selectedElementId: newEl.id,
        },
      };
    }

    case 'SELECT_ELEMENT':
      return { ...state, poster: { ...poster, selectedElementId: action.id } };

    case 'SET_BACKGROUND':
      return { ...state, poster: { ...poster, background: action.background } };

    case 'SET_PERFORMANCE_INFO':
      return { ...state, poster: { ...poster, performanceInfo: action.info } };

    case 'MOVE_TO_FRONT': {
      const max = Math.max(...poster.elements.map(e => e.zIndex), 0);
      return {
        ...state,
        poster: {
          ...poster,
          elements: poster.elements.map(el =>
            el.id === action.id ? { ...el, zIndex: max + 1 } : el
          ),
        },
      };
    }

    case 'MOVE_TO_BACK': {
      const min = Math.min(...poster.elements.map(e => e.zIndex), 0);
      return {
        ...state,
        poster: {
          ...poster,
          elements: poster.elements.map(el =>
            el.id === action.id ? { ...el, zIndex: min - 1 } : el
          ),
        },
      };
    }

    case 'MOVE_FORWARD': {
      const el = poster.elements.find(e => e.id === action.id);
      if (!el) return state;
      const next = poster.elements
        .filter(e => e.zIndex > el.zIndex)
        .sort((a, b) => a.zIndex - b.zIndex)[0];
      if (!next) return state;
      return {
        ...state,
        poster: {
          ...poster,
          elements: poster.elements.map(e =>
            e.id === action.id
              ? { ...e, zIndex: next.zIndex }
              : e.id === next.id
              ? { ...e, zIndex: el.zIndex }
              : e
          ),
        },
      };
    }

    case 'MOVE_BACKWARD': {
      const el = poster.elements.find(e => e.id === action.id);
      if (!el) return state;
      const prev = poster.elements
        .filter(e => e.zIndex < el.zIndex)
        .sort((a, b) => b.zIndex - a.zIndex)[0];
      if (!prev) return state;
      return {
        ...state,
        poster: {
          ...poster,
          elements: poster.elements.map(e =>
            e.id === action.id
              ? { ...e, zIndex: prev.zIndex }
              : e.id === prev.id
              ? { ...e, zIndex: el.zIndex }
              : e
          ),
        },
      };
    }

    case 'SET_LANGUAGE':
      return { ...state, language: action.language };

    case 'SET_THEME':
      return { ...state, theme: action.theme };

    case 'SHOW_TOAST':
      return { ...state, toast: { id: Date.now(), message: action.message, type: action.toastType } };

    case 'HIDE_TOAST':
      return { ...state, toast: null };

    case 'RESET':
      return { poster: initialPoster, language: state.language, theme: state.theme, toast: null };

    default:
      return state;
  }
}

// ─── Context ─────────────────────────────────────────────────────────────────

interface PosterContextValue {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  canvasSize: { width: number; height: number };
}

const PosterContext = createContext<PosterContextValue | null>(null);

export function PosterProvider({ children }: { children: ReactNode }) {
  // Use lazy initializer so URL hash is read once at mount time
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState);

  // Apply CSS variables whenever theme changes
  useEffect(() => {
    const c = THEMES[state.theme];
    const root = document.documentElement;
    root.style.setProperty('--theme-accent',       c.accent);
    root.style.setProperty('--theme-accent-hover', c.accentHover);
    root.style.setProperty('--theme-accent-light', c.accentLight);
    root.style.setProperty('--theme-accent-border',c.accentBorder);
    root.style.setProperty('--theme-accent-text',  c.accentText);
    root.style.setProperty('--theme-gradient',     c.gradient);
    root.style.setProperty('--theme-hero-bg',      c.heroBg);
  }, [state.theme]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'success') => {
      dispatch({ type: 'SHOW_TOAST', message, toastType: type });
      setTimeout(() => dispatch({ type: 'HIDE_TOAST' }), 3000);
    },
    []
  );

  const canvasSize =
    state.poster.orientation === 'portrait'
      ? { width: 400, height: 566 }
      : { width: 600, height: 424 };

  return (
    <PosterContext.Provider value={{ state, dispatch, showToast, canvasSize }}>
      {children}
    </PosterContext.Provider>
  );
}

export function usePoster() {
  const ctx = useContext(PosterContext);
  if (!ctx) throw new Error('usePoster must be used within PosterProvider');
  return ctx;
}

// Convenience hook for theme colors
export function useTheme() {
  const { state } = usePoster();
  return THEMES[state.theme];
}

export function genId() {
  return `el-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
