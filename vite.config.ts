import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { IncomingMessage, ServerResponse } from 'http'
import fs from 'fs/promises'
import puppeteer from 'puppeteer'
// InfoTalkTemplate import 제거 - 직접 구현

// 미디어 엔드포인트
const MEDIA_END_POINT = 'https://media.exp.channel.io/cht/v1'

// 업로드 설정 로드
async function loadUploadConfig(): Promise<{ token: string; channelId: string }> {
  try {
    const configPath = path.resolve(process.cwd(), 'upload-config.json')
    const configData = await fs.readFile(configPath, 'utf-8')
    const config = JSON.parse(configData)
    
    if (!config.token) {
      throw new Error('config 파일에 token이 필요합니다')
    }
    
    return config
  } catch (error) {
    throw new Error('upload-config.json 파일을 확인해주세요')
  }
}

// API로 이미지 업로드
async function uploadImageToAPI(
  imageBuffer: Buffer,
  fileName: string,
  token: string,
  channelId: string
): Promise<{ success: boolean; response?: any; error?: string }> {
  try {
    console.log(`📤 ${fileName}을 API로 업로드 중...`)

    const file = new File([imageBuffer], fileName, { type: 'image/png' })
    const url = `${MEDIA_END_POINT}/app/channels/${channelId}/shared/app-prebuilt-snapshot/file/${encodeURIComponent(file.name)}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': token,
      },
      body: file as any,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const responseData = await response.json()

    if (!responseData.bucket) {
      throw new Error(`API 응답에 bucket 필드가 없습니다: ${JSON.stringify(responseData)}`)
    }

    console.log(`✅ ${fileName} 업로드 성공`)
    return { success: true, response: responseData }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : '알 수 없는 오류'
    console.error(`❌ ${fileName} 업로드 실패: ${errorMsg}`)
    return { success: false, error: errorMsg }
  }
}

// content 생성 (간소화된 버전)
function generateContent(inputData: any): string {
  try {
    if (inputData?.data?.component?.components) {
      const components = inputData.data.component.components
      const mainBodyComponent = components.find((c: any) => c.type === 'mainBody')
      if (mainBodyComponent?.properties?.message) {
        return mainBodyComponent.properties.message
      }
    }
  } catch (error) {
    console.warn('⚠️ content 생성 실패:', error)
  }
  
  return ''
}

// 스크린샷 촬영
async function takeScreenshot(port: number): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const page = await browser.newPage()

    console.log(`⏳ 페이지 로드 중...`)

    await page.setViewport({
      deviceScaleFactor: 2,
      width: 0,
      height: 0,
    })

    await page.goto(`http://localhost:${port}`, {
      waitUntil: 'networkidle0',
    })

    console.log(`⏳ props 로드를 기다리는 중...`)

    // props가 로드될 때까지 기다림 (최대 10초)
    await page.waitForSelector('#target[data-props-loaded="true"]', {
      timeout: 10000,
    })

    // props 로드 성공 여부 확인
    const propsSuccess = await page.evaluate(() => {
      const target = document.querySelector('#target')
      return target?.getAttribute('data-props-success') === 'true'
    })

    if (!propsSuccess) {
      throw new Error('props.json 로드에 실패했습니다')
    }

    console.log(`✅ props 로드 완료`)

    const targetElement = await page.$('#target')
    if (!targetElement) {
      throw new Error('#target 엘리먼트를 찾을 수 없습니다')
    }

    console.log(`📸 #target 엘리먼트 스크린샷을 찍습니다...`)
    const screenshotBuffer = (await targetElement.screenshot({
      type: 'png',
    })) as Buffer

    console.log(`✅ 스크린샷 생성 완료`)

    return screenshotBuffer
  } finally {
    await browser.close()
  }
}

// Screenshot API 핸들러
async function handleScreenshotAPI(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') {
    res.writeHead(405, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Method not allowed' }))
    return
  }

  try {
    // JSON 데이터 파싱
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })

    req.on('end', async () => {
      try {
        const inputData = JSON.parse(body)
        console.log('📤 API 요청 받음:', { senderName: inputData.senderName })

        // 설정 로드
        const uploadConfig = await loadUploadConfig()

        // props.json에 데이터 저장
        const propsPath = path.resolve(process.cwd(), 'public', 'props.json')
        await fs.writeFile(propsPath, JSON.stringify(inputData, null, 2), 'utf-8')
        console.log('📄 props.json 업데이트 완료')

        // 파일 시스템 반영 대기
        await new Promise(resolve => setTimeout(resolve, 300))

        // 스크린샷 촬영
        const screenshotBuffer = await takeScreenshot(5173)

        // API로 업로드
        const fileName = `screenshot_${Date.now()}.png`
        const uploadResult = await uploadImageToAPI(
          screenshotBuffer,
          fileName,
          uploadConfig.token,
          inputData.channelId || uploadConfig.channelId
        )

        // content 생성
        const content = generateContent(inputData)

        // 결과 구성
        const result = {
          success: uploadResult.success,
          fileName,
          timestamp: new Date().toISOString(),
          ...(uploadResult.success
            ? { file: uploadResult.response }
            : { error: uploadResult.error }),
          content,
        }

        // 응답 전송
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(result, null, 2))

      } catch (error) {
        console.error('❌ API 처리 오류:', error)
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ 
          error: '스크린샷 처리 실패', 
          message: error instanceof Error ? error.message : '알 수 없는 오류'
        }))
      }
    })

  } catch (error) {
    console.error('❌ API 요청 처리 오류:', error)
    res.writeHead(400, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Invalid JSON' }))
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // API 미들웨어 플러그인
    {
      name: 'screenshot-api',
      configureServer(server) {
        server.middlewares.use('/api/screenshot', (req, res, next) => {
          if (req.method === 'POST') {
            handleScreenshotAPI(req, res)
          } else {
            res.statusCode = 405
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Method not allowed' }))
          }
        })
      }
    }
  ],
  base: './',
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(__dirname, 'src'),
      },
    ],
  },
})
