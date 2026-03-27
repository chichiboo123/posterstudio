export type Theme = 'blue' | 'green' | 'yellow' | 'pink';

export interface ThemeColors {
  accent: string;
  accentHover: string;
  accentLight: string;
  accentBorder: string;
  accentText: string;
  gradient: string;
  heroBg: string;
  label: string;
  labelEn: string;
  swatch: string;
}

export const THEMES: Record<Theme, ThemeColors> = {
  blue: {
    accent:      '#60A5FA',
    accentHover: '#3B82F6',
    accentLight: '#EFF6FF',
    accentBorder:'#93C5FD',
    accentText:  '#1E40AF',
    gradient:    'linear-gradient(135deg, #BFDBFE, #60A5FA)',
    heroBg:      'linear-gradient(135deg, #EFF6FF, #DBEAFE, #EFF6FF)',
    label: '파스텔 블루',
    labelEn: 'Pastel Blue',
    swatch: '#93C5FD',
  },
  green: {
    accent:      '#4ADE80',
    accentHover: '#22C55E',
    accentLight: '#F0FDF4',
    accentBorder:'#86EFAC',
    accentText:  '#166534',
    gradient:    'linear-gradient(135deg, #BBF7D0, #4ADE80)',
    heroBg:      'linear-gradient(135deg, #F0FDF4, #DCFCE7, #F0FDF4)',
    label: '파스텔 그린',
    labelEn: 'Pastel Green',
    swatch: '#86EFAC',
  },
  yellow: {
    accent:      '#FBBF24',
    accentHover: '#F59E0B',
    accentLight: '#FFFBEB',
    accentBorder:'#FDE68A',
    accentText:  '#92400E',
    gradient:    'linear-gradient(135deg, #FDE68A, #FBBF24)',
    heroBg:      'linear-gradient(135deg, #FFFBEB, #FEF3C7, #FFFBEB)',
    label: '파스텔 옐로',
    labelEn: 'Pastel Yellow',
    swatch: '#FDE047',
  },
  pink: {
    accent:      '#F472B6',
    accentHover: '#EC4899',
    accentLight: '#FDF2F8',
    accentBorder:'#FBCFE8',
    accentText:  '#9D174D',
    gradient:    'linear-gradient(135deg, #FBCFE8, #F472B6)',
    heroBg:      'linear-gradient(135deg, #FDF2F8, #FCE7F3, #FDF2F8)',
    label: '파스텔 핑크',
    labelEn: 'Pastel Pink',
    swatch: '#F9A8D4',
  },
};
