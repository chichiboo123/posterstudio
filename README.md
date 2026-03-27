# 🎭 뮤지컬 포스터 스튜디오

나만의 뮤지컬 포스터를 온라인에서 직관적으로 만드는 웹 애플리케이션입니다.

**라이브 데모**: https://chichiboo123.github.io/posterstudio/

---

## ✨ 주요 기능

| 기능 | 설명 |
|------|------|
| 🖼️ 방향 선택 | 세로형(400×566) / 가로형(600×424) |
| 🎨 배경 설정 | 단색(20가지 파스텔) + 그라데이션(15가지 프리셋, 8방향) |
| ✏️ 텍스트 편집 | 12가지 한글 폰트, 크기/색상/방향/굵게/기울임/그림자 |
| 😊 이모지 | 12카테고리 300+ 이모지, 한글 키워드 검색 |
| 🖼️ 이미지 업로드 | JPG, PNG, GIF 지원 |
| 📋 공연정보 | 일시·장소·출연진·창작진·제작사 삽입 |
| 💾 내보내기 | PNG / PDF / 클립보드 (고해상도 2x) |
| 🌐 한/영 전환 | 전체 UI 언어 전환 |

## 🛠️ 기술 스택

- **React 18** + **TypeScript** + **Vite**
- **Tailwind CSS** (스타일링)
- **Pretendard** 폰트 + **Google Material Icons**
- **html2canvas** + **jsPDF** (내보내기)
- **GitHub Actions** + **GitHub Pages** (배포)

## 🚀 로컬 실행

```bash
npm install
npm run dev
```

## 📦 빌드 & 배포

```bash
npm run build   # dist/ 폴더에 빌드
```

`main` 브랜치에 push하면 GitHub Actions가 자동으로 GitHub Pages에 배포합니다.

## 📁 프로젝트 구조

```
src/
├── components/
│   ├── canvas/       # 포스터 캔버스, 요소 드래그/리사이즈
│   ├── panels/       # 각 단계별 패널 (Step1~Step6)
│   ├── sidebar/      # 툴 사이드바, 레이어 패널
│   └── common/       # Toast, ContextMenu
├── data/             # 폰트 목록, 이모지 데이터
├── i18n/             # 한/영 번역
├── store/            # React Context 전역 상태
└── types/            # TypeScript 인터페이스
```
