export interface FontOption {
  id: string;
  name: string;
  family: string;
  labelKo: string;
}

export const fontOptions: FontOption[] = [
  { id: 'do-hyeon', name: 'Do Hyeon', family: "'Do Hyeon', sans-serif", labelKo: '도현체' },
  { id: 'black-han-sans', name: 'Black Han Sans', family: "'Black Han Sans', sans-serif", labelKo: '검은고딕' },
  { id: 'jua', name: 'Jua', family: "'Jua', sans-serif", labelKo: '주아체' },
  { id: 'dongle', name: 'Dongle', family: "'Dongle', sans-serif", labelKo: '동글체' },
  { id: 'gugi', name: 'Gugi', family: "'Gugi', sans-serif", labelKo: '구기체' },
  { id: 'noto-sans-kr', name: 'Noto Sans KR', family: "'Noto Sans KR', sans-serif", labelKo: '노토산스' },
  { id: 'gasoek-one', name: 'Gasoek One', family: "'Gasoek One', sans-serif", labelKo: '가속원' },
  { id: 'yeon-sung', name: 'Yeon Sung', family: "'Yeon Sung', sans-serif", labelKo: '연성체' },
  { id: 'diphylleia', name: 'Diphylleia', family: "'Diphylleia', sans-serif", labelKo: '디필레아' },
  { id: 'kirang-haerang', name: 'Kirang Haerang', family: "'Kirang Haerang', sans-serif", labelKo: '키랑해랑' },
  { id: 'gaegu', name: 'Gaegu', family: "'Gaegu', sans-serif", labelKo: '개구체' },
  { id: 'grandiflora-one', name: 'Grandiflora One', family: "'Grandiflora One', sans-serif", labelKo: '그랜디플로라' },
];

export const pastelColors = [
  '#FFE5E5', '#FFB3BA', '#FFCCBA', '#FFE5B3', '#FFFACD',
  '#E5FFE5', '#B3FFBA', '#E5FFFF', '#B3E5FF', '#E5E5FF',
  '#FFB3E6', '#E6B3FF', '#B3B3FF', '#B3FFE6', '#FFFDE7',
  '#F3E5F5', '#E8EAF6', '#E1F5FE', '#E0F7FA', '#F1F8E9',
];

export const gradientPresets: { colors: [string, string]; direction: string; label: string }[] = [
  { colors: ['#FF6B9D', '#C44569'], direction: 'to-b', label: '핑크→빨강' },
  { colors: ['#6C63FF', '#3498DB'], direction: 'to-br', label: '보라→파랑' },
  { colors: ['#2ECC71', '#A8E6CF'], direction: 'to-t', label: '초록→연초록' },
  { colors: ['#F7971E', '#FFD200'], direction: 'to-r', label: '주황→노랑' },
  { colors: ['#ee9ca7', '#ffdde1'], direction: 'to-b', label: '핑크 그라데이션' },
  { colors: ['#a18cd1', '#fbc2eb'], direction: 'to-br', label: '보라→핑크' },
  { colors: ['#fccb90', '#d57eeb'], direction: 'to-r', label: '황금→보라' },
  { colors: ['#a1c4fd', '#c2e9fb'], direction: 'to-b', label: '하늘 그라데이션' },
  { colors: ['#d4fc79', '#96e6a1'], direction: 'to-b', label: '라임→초록' },
  { colors: ['#30cfd0', '#330867'], direction: 'to-b', label: '터콰이즈→남색' },
  { colors: ['#f6d365', '#fda085'], direction: 'to-r', label: '노랑→코랄' },
  { colors: ['#84fab0', '#8fd3f4'], direction: 'to-br', label: '민트→하늘' },
  { colors: ['#ffecd2', '#fcb69f'], direction: 'to-b', label: '피치 그라데이션' },
  { colors: ['#667eea', '#764ba2'], direction: 'to-b', label: '인디고→보라' },
  { colors: ['#2d3561', '#c94b4b'], direction: 'to-br', label: '남색→빨강' },
];

export const gradientDirections = [
  { id: 'to-t',  label: '↑', cssValue: 'to top' },
  { id: 'to-tr', label: '↗', cssValue: 'to top right' },
  { id: 'to-r',  label: '→', cssValue: 'to right' },
  { id: 'to-br', label: '↘', cssValue: 'to bottom right' },
  { id: 'to-b',  label: '↓', cssValue: 'to bottom' },
  { id: 'to-bl', label: '↙', cssValue: 'to bottom left' },
  { id: 'to-l',  label: '←', cssValue: 'to left' },
  { id: 'to-tl', label: '↖', cssValue: 'to top left' },
];

export const textColorPresets = ['#000000', '#FFFFFF', '#FF6B9D', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6'];
