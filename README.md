# 사용법

## 0. config 설정

`upload-config.json` 파일에 다음 정보를 설정합니다:

- `token`: API 접근을 위한 인증 토큰
- `channelId`: 대상 채널 ID

## 1. 템플릿 넣기

`/templates` 폴더에 CustomPayload 형식에 맞게 템플릿들을 넣습니다.

## 2. Screenshot 스크립트 실행

### 2-1. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 포트 번호를 확인합니다 (일반적으로 5173).

### 2-2. Screenshot 스크립트 실행

```bash
npm run screenshot -- --batch --input-dir templates --port {{포트번호}}
```

**예시:**

```bash
npm run screenshot -- --batch --input-dir templates --port 5173
```

### 2-3. 결과 확인

- `results/` 폴더에서 생성된 스크린샷 결과를 확인할 수 있습니다
- 실패한 파일들의 상세 정보는 `result.json` 파일에서 확인할 수 있습니다
