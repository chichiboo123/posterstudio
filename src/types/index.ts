export type ElementType = 'text' | 'emoji' | 'image';

export interface Position {
  x: number;
  y: number;
}

export interface ElementStyle {
  fontSize?: number;
  color?: string;
  fontFamily?: string;
  fontWeight?: string;
  fontStyle?: string;
  textShadow?: string;
  direction?: 'horizontal' | 'vertical' | 'diagonal';
  rotation?: number;
}

export interface PosterElement {
  id: string;
  type: ElementType;
  content: string;
  position: Position;
  style: ElementStyle;
  zIndex: number;
}

export interface Background {
  type: 'solid' | 'gradient';
  colors: string[];
  gradientDirection: string;
}

export interface PerformanceInfo {
  date?: string;
  time?: string;
  venue?: string;
  cast?: string;
  crew?: string;
  production?: string;
}

export interface PosterState {
  currentStep: number;
  orientation: 'portrait' | 'landscape';
  elements: PosterElement[];
  background: Background;
  performanceInfo: PerformanceInfo;
  selectedElementId: string | null;
}

export type Language = 'ko' | 'en';
export type { Theme } from '../data/themes';
