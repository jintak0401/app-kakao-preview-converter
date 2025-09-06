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

## 3. 실시간 API 사용 (새로운 기능)

### 3-1. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 실행되면 포트 번호를 확인합니다 (일반적으로 5173).

### 3-2. 실시간 API 호출

**API 엔드포인트:** `POST http://localhost:5173/api/screenshot`

**요청 예시:**

```bash
curl -X POST http://localhost:5173/api/screenshot \
  -H "Content-Type: application/json" \
  -d @templates/template1.json
```

**또는 JSON 직접 전송:**

```bash
curl -X POST http://localhost:5173/api/screenshot \
  -H "Content-Type: application/json" \
  -d '{
    "senderName": "실시간 테스트",
    "channelId": "your-channel-id",
    "data": {
      "messageType": "alimTalk",
      "templateCode": "TEST_001",
      "templateName": "실시간 테스트 템플릿",
      "component": {
        "type": "composite",
        "components": [
          {
            "type": "mainBody",
            "properties": {
              "message": "실시간으로 생성된 스크린샷입니다!"
            }
          }
        ]
      }
    },
    "paramMapper": {}
  }'
```

**응답 예시:**

```json
{
  "success": true,
  "fileName": "screenshot_1703123456789.png",
  "timestamp": "2023-12-20T15:30:56.789Z",
  "image": {
    "bucket": "...",
    "key": "...",
    "url": "https://..."
  },
  "content": "실시간으로 생성된 스크린샷입니다!"
}
```

### 3-3. 장점

- **실시간 처리**: 파일을 생성하지 않고 바로 API 호출
- **간편한 통합**: 웹/앱에서 직접 호출 가능
- **동일한 서버**: 기존 개발 서버에 API가 통합됨
