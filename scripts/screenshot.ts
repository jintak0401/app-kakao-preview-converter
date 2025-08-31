import puppeteer, { type Browser } from 'puppeteer'
import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import InfoTalkTemplate from '../src/models/InfoTalkTemplate'

// 미디어 엔드포인트는 항상 동일
const MEDIA_END_POINT = 'https://media.exp.channel.io/cht/v1'

interface UploadConfig {
  token: string
  channelId: string
}

interface ScreenshotOptions {
  output?: string
  port?: number
  width?: number
  height?: number
  waitTime?: number
  input?: string
  batch?: boolean
  inputDir?: string
}

interface BatchJob {
  inputPath: string
  outputPath: string
  inputData: any
}

interface BatchResult {
  total: number
  success: number
  failed: number
  failedFiles: Array<{ fileName: string; errorMessage: string }>
  timestamp: string
}

interface ApiUploadResult {
  success: boolean
  response?: any
  error?: string
}

class ScreenshotCLI {
  private viteProcess: ChildProcess | null = null

  private generateContent(inputData: any): string {
    try {
      // InfoTalkTemplate adapter를 사용해서 content 생성
      const entity = InfoTalkTemplate.adapter.fromCustomPayloadDTO(inputData)
      return InfoTalkTemplate.adapter.toPreviewContent(entity)
    } catch (error) {
      console.warn(`⚠️ content 생성 실패:`, error)

      // fallback: 간단한 content 생성
      try {
        if (inputData?.data?.component?.components) {
          const components = inputData.data.component.components
          const mainBodyComponent = components.find(
            (c: any) => c.type === 'mainBody'
          )
          if (mainBodyComponent?.properties?.message) {
            return mainBodyComponent.properties.message
          }
        }
      } catch (fallbackError) {
        console.warn('⚠️ fallback content 생성도 실패:', fallbackError)
      }

      return '' // 실패 시 빈 문자열 반환
    }
  }

  private async loadUploadConfig({
    configPath,
  }: {
    configPath: string
  }): Promise<UploadConfig> {
    try {
      const absoluteConfigPath = path.resolve(process.cwd(), configPath)
      console.log(`📄 업로드 설정 파일을 로드합니다: ${configPath}`)

      const configData = await fs.readFile(absoluteConfigPath, 'utf-8')
      const config = JSON.parse(configData) as UploadConfig

      // 필수 필드 검증
      if (!config.token || !config.channelId) {
        throw new Error('config 파일에 token과 channelId가 모두 필요합니다')
      }

      console.log(`✅ 업로드 설정 로드 완료 (channelId: ${config.channelId})`)
      return config
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('ENOENT')) {
          throw new Error(`config 파일을 찾을 수 없습니다: ${configPath}`)
        } else if (error.name === 'SyntaxError') {
          throw new Error(
            `config 파일의 JSON 형식이 잘못되었습니다: ${configPath}`
          )
        }
      }
      throw error
    }
  }

  private async uploadImageToAPI({
    imageBuffer,
    fileName,
    token,
    channelId,
  }: {
    imageBuffer: Buffer
    fileName: string
    token: string
    channelId: string
  }): Promise<ApiUploadResult> {
    try {
      console.log(`📤 ${fileName}을 API로 업로드 중...`)

      // Buffer를 File 객체로 변환
      const file = new File([imageBuffer], fileName, {
        type: 'image/png',
      })

      const url = `${MEDIA_END_POINT}/app/channels/${channelId}/shared/app-prebuilt-snapshot/file/${encodeURIComponent(file.name)}`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
        body: file as any, // File 객체를 body로 전송
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(
          `API 요청 실패: ${response.status} ${response.statusText} - ${errorText}`
        )
      }

      const responseData = await response.json()

      // bucket 필드가 있을 때만 성공으로 취급
      if (!responseData.bucket) {
        throw new Error(
          `API 응답에 bucket 필드가 없습니다: ${JSON.stringify(responseData)}`
        )
      }

      console.log(`✅ ${fileName} 업로드 성공`)

      return {
        success: true,
        response: responseData,
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : '알 수 없는 오류'
      console.error(`❌ ${fileName} 업로드 실패: ${errorMsg}`)

      return {
        success: false,
        error: errorMsg,
      }
    }
  }

  private async findJsonFiles({
    inputDir,
  }: {
    inputDir: string
  }): Promise<string[]> {
    try {
      const absoluteInputDir = path.resolve(process.cwd(), inputDir)
      const files = await fs.readdir(absoluteInputDir)

      const jsonFiles = files
        .filter((file) => file.endsWith('.json'))
        .map((file) => path.join(absoluteInputDir, file))

      if (jsonFiles.length === 0) {
        throw new Error(`${inputDir} 폴더에서 JSON 파일을 찾을 수 없습니다`)
      }

      console.log(`📁 ${jsonFiles.length}개의 JSON 파일을 찾았습니다:`)
      jsonFiles.forEach((file) => console.log(`  - ${path.basename(file)}`))

      return jsonFiles
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        throw new Error(`폴더를 찾을 수 없습니다: ${inputDir}`)
      }
      throw error
    }
  }

  private async prepareBatchJobs({
    jsonFiles,
    outputDir = 'screenshots',
  }: {
    jsonFiles: string[]
    outputDir?: string
  }): Promise<{
    jobs: BatchJob[]
    invalidFiles: Array<{ fileName: string; errorMessage: string }>
  }> {
    const jobs: BatchJob[] = []
    const invalidFiles: Array<{ fileName: string; errorMessage: string }> = []
    const absoluteOutputDir = path.resolve(process.cwd(), outputDir)

    // 출력 디렉토리 생성
    try {
      await fs.mkdir(absoluteOutputDir, { recursive: true })
    } catch (error) {
      console.warn(`출력 디렉토리 생성 실패: ${error}`)
    }

    for (const inputPath of jsonFiles) {
      try {
        const inputData = await fs.readFile(inputPath, 'utf-8')
        JSON.parse(inputData) // 유효성 검사

        const baseName = path.basename(inputPath, '.json')
        const outputPath = path.join(absoluteOutputDir, `${baseName}.json`)

        jobs.push({
          inputPath,
          outputPath,
          inputData: JSON.parse(inputData),
        })
      } catch (error) {
        const fileName = path.basename(inputPath)
        const errorMessage =
          error instanceof Error ? error.message : '알 수 없는 오류'

        console.warn(`⚠️  ${fileName} 파일을 건너뜁니다: ${errorMessage}`)

        invalidFiles.push({
          fileName,
          errorMessage,
        })
      }
    }

    if (jobs.length === 0) {
      throw new Error('처리할 수 있는 유효한 JSON 파일이 없습니다')
    }

    return { jobs, invalidFiles }
  }

  private async copyInputToPublic({
    inputPath,
  }: {
    inputPath: string
  }): Promise<void> {
    try {
      const absoluteInputPath = path.resolve(process.cwd(), inputPath)
      const publicPath = path.resolve(process.cwd(), 'public', 'props.json')

      // input 파일이 존재하는지 확인
      await fs.access(absoluteInputPath)

      console.log(`📄 ${inputPath}를 public/props.json으로 복사합니다...`)

      // input 파일을 읽어서 public/props.json으로 복사
      const inputData = await fs.readFile(absoluteInputPath, 'utf-8')

      // JSON 유효성 검사
      JSON.parse(inputData)

      await fs.writeFile(publicPath, inputData, 'utf-8')

      console.log(`✅ props 파일이 준비되었습니다`)
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('ENOENT')) {
          throw new Error(`input 파일을 찾을 수 없습니다: ${inputPath}`)
        } else if (error.name === 'SyntaxError') {
          throw new Error(
            `input 파일의 JSON 형식이 잘못되었습니다: ${inputPath}`
          )
        }
      }
      throw error
    }
  }

  private async waitForServer({ port }: { port: number }): Promise<void> {
    const maxAttempts = 30
    let attempts = 0

    while (attempts < maxAttempts) {
      try {
        const response = await fetch(`http://localhost:${port}`)
        if (response.ok || response.status === 404) {
          console.log(
            `✅ 개발 서버가 http://localhost:${port}에서 준비되었습니다`
          )
          return
        }
      } catch (error) {
        // 서버가 아직 시작되지 않음
      }

      attempts++
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log(`🔄 서버 시작을 기다리는 중... (${attempts}/${maxAttempts})`)
    }

    throw new Error(`서버가 ${maxAttempts}초 내에 시작되지 않았습니다`)
  }

  private async startViteServer({ port }: { port: number }): Promise<void> {
    return new Promise((resolve, reject) => {
      console.log(`🚀 Vite 개발 서버를 포트 ${port}에서 시작합니다...`)

      this.viteProcess = spawn(
        'npm',
        ['run', 'dev', '--', '--port', port.toString()],
        {
          stdio: ['ignore', 'pipe', 'pipe'],
          detached: false,
        }
      )

      this.viteProcess.stdout?.on('data', (data) => {
        const output = data.toString()
        if (output.includes('Local:') || output.includes('ready')) {
          resolve()
        }
      })

      this.viteProcess.stderr?.on('data', (data) => {
        console.log(`Vite: ${data}`)
      })

      this.viteProcess.on('error', (error) => {
        reject(error)
      })

      // 5초 후에도 시작되지 않으면 다음 단계로
      setTimeout(() => resolve(), 5000)
    })
  }

  private async stopViteServer(): Promise<void> {
    if (this.viteProcess) {
      console.log('🛑 Vite 서버를 종료합니다...')
      this.viteProcess.kill('SIGTERM')
      this.viteProcess = null
    }
  }

  private async takeScreenshotWithBrowser({
    browser,
    port,
    jobName = 'screenshot',
  }: {
    browser: Browser
    port: number
    jobName?: string
  }): Promise<Buffer> {
    const page = await browser.newPage()

    try {
      console.log(`⏳ [${jobName}] 페이지 로드 중...`)

      await page.setViewport({
        deviceScaleFactor: 2,
        width: 0,
        height: 0,
      })

      await page.goto(`http://localhost:${port}`, {
        waitUntil: 'networkidle0',
      })

      console.log(`⏳ [${jobName}] props 로드를 기다리는 중...`)

      // props가 로드될 때까지 기다림 (최대 10초)
      try {
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

        console.log(`✅ [${jobName}] props 로드 완료`)
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : '알 수 없는 오류'
        console.warn(`⚠️ [${jobName}] props 로드 실패: ${errorMsg}`)
        throw error
      }

      const targetElement = await page.$('#target')
      if (!targetElement) {
        throw new Error('#target 엘리먼트를 찾을 수 없습니다')
      }

      console.log(`📸 [${jobName}] #target 엘리먼트 스크린샷을 찍습니다...`)
      const screenshotBuffer = (await targetElement.screenshot({
        type: 'png',
      })) as Buffer

      console.log(`✅ [${jobName}] 스크린샷 생성 완료`)

      return screenshotBuffer
    } finally {
      await page.close()
    }
  }

  private async takeScreenshot({
    port,
    output = 'result.json',
    uploadConfig,
    fileName = 'screenshot.png',
    inputData = null,
  }: {
    port: number
    output: string
    uploadConfig: UploadConfig
    fileName?: string
    inputData?: any
    width?: number
    height?: number
    waitTime?: number
  }): Promise<void> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    try {
      const screenshotBuffer = await this.takeScreenshotWithBrowser({
        browser,
        port,
      })

      // API로 업로드
      const uploadResult = await this.uploadImageToAPI({
        imageBuffer: screenshotBuffer,
        fileName,
        token: uploadConfig.token,
        channelId: uploadConfig.channelId,
      })

      // content 생성
      const content = inputData ? this.generateContent(inputData) : ''

      // 결과를 JSON으로 저장
      const resultData = {
        success: uploadResult.success,
        fileName,
        timestamp: new Date().toISOString(),
        ...(uploadResult.success
          ? { image: uploadResult.response }
          : { error: uploadResult.error }),
        content,
      }

      await fs.writeFile(output, JSON.stringify(resultData, null, 2), 'utf-8')
      console.log(`📄 API 응답을 ${output}에 저장했습니다`)
    } finally {
      await browser.close()
    }
  }

  private async processBatchJobs({
    jobs,
    port,
    initialFailedFiles = [],
    uploadConfig,
  }: {
    jobs: BatchJob[]
    port: number
    initialFailedFiles?: Array<{ fileName: string; errorMessage: string }>
    uploadConfig: UploadConfig
  }): Promise<BatchResult> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const result: BatchResult = {
      total: jobs.length + initialFailedFiles.length,
      success: 0,
      failed: initialFailedFiles.length,
      failedFiles: [...initialFailedFiles],
      timestamp: new Date().toISOString(),
    }

    try {
      console.log(`🚀 ${jobs.length}개 작업을 순차적으로 처리합니다...`)

      // 작업을 순차적으로 처리
      for (let i = 0; i < jobs.length; i++) {
        const job = jobs[i]
        const jobName = path.basename(job.inputPath, '.json')

        console.log(`\n📦 [${i + 1}/${jobs.length}] ${jobName} 처리 중...`)

        try {
          // props.json에 해당 작업의 데이터 설정
          const publicPath = path.resolve(process.cwd(), 'public', 'props.json')
          await fs.writeFile(
            publicPath,
            JSON.stringify(job.inputData, null, 2),
            'utf-8'
          )
          console.log(`📄 [${jobName}] props.json 업데이트 완료`)

          // 파일 시스템 반영 대기
          await new Promise((resolve) => setTimeout(resolve, 300))

          // 스크린샷 촬영
          const screenshotBuffer = await this.takeScreenshotWithBrowser({
            browser,
            port,
            jobName,
          })

          // API로 업로드
          const fileName = `${jobName}.png`
          const uploadResult = await this.uploadImageToAPI({
            imageBuffer: screenshotBuffer,
            fileName,
            token: uploadConfig.token,
            channelId: uploadConfig.channelId,
          })

          // content 생성
          const content = this.generateContent(job.inputData)

          // 결과를 JSON으로 저장
          const resultData = {
            success: uploadResult.success,
            fileName,
            inputFile: `${jobName}.json`,
            timestamp: new Date().toISOString(),
            ...(uploadResult.success
              ? { image: uploadResult.response }
              : { error: uploadResult.error }),
            content,
          }

          await fs.writeFile(
            job.outputPath,
            JSON.stringify(resultData, null, 2),
            'utf-8'
          )
          console.log(`📄 [${jobName}] API 응답을 저장했습니다`)

          result.success++
          console.log(`✅ [${jobName}] 처리 완료`)
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : '알 수 없는 오류'
          console.error(`❌ [${jobName}] 실패: ${errorMsg}`)

          result.failed++
          result.failedFiles.push({
            fileName: jobName + '.json',
            errorMessage: errorMsg,
          })
        }
      }

      console.log(`\n🎉 모든 배치 작업이 완료되었습니다!`)
      console.log(`📊 결과: 성공 ${result.success}개, 실패 ${result.failed}개`)

      // result.json 생성
      const resultPath = path.resolve(process.cwd(), 'result.json')
      await fs.writeFile(resultPath, JSON.stringify(result, null, 2), 'utf-8')
      console.log(`📄 결과를 result.json에 저장했습니다`)

      if (result.failed > 0) {
        const failedFileNames = result.failedFiles
          .map((f) => f.fileName)
          .join(', ')
        console.log(`⚠️  실패한 파일들: ${failedFileNames}`)
      }
    } finally {
      await browser.close()
    }

    return result
  }

  async run({
    output = 'result.json',
    port = 5173,
    input,
    batch = false,
    inputDir = '.',
  }: ScreenshotOptions = {}): Promise<void> {
    try {
      // 업로드 설정 로드 (항상 upload-config.json 사용)
      const uploadConfig = await this.loadUploadConfig({
        configPath: 'upload-config.json',
      })

      // 서버가 이미 실행 중인지 확인
      try {
        await fetch(`http://localhost:${port}`)
        console.log('🎯 이미 실행 중인 개발 서버를 사용합니다')
      } catch {
        // 서버가 실행 중이 아니므로 시작
        await this.startViteServer({ port })
        await this.waitForServer({ port })
      }

      if (batch) {
        // 배치 모드: 폴더 내 모든 JSON 파일 처리
        console.log(
          `📁 배치 모드: ${inputDir} 폴더에서 JSON 파일들을 찾습니다...`
        )

        const jsonFiles = await this.findJsonFiles({ inputDir })
        const { jobs, invalidFiles } = await this.prepareBatchJobs({
          jsonFiles,
        })

        const batchResult = await this.processBatchJobs({
          jobs,
          port,
          initialFailedFiles: invalidFiles,
          uploadConfig,
        })

        if (batchResult.failed > 0) {
          console.log(
            `\n⚠️  일부 작업이 실패했습니다. result.json을 확인해주세요.`
          )
        }
      } else {
        // 단일 모드
        const outputPath = path.resolve(process.cwd(), output)

        let inputData = null
        if (input) {
          await this.copyInputToPublic({ inputPath: input })
          // inputData도 읽어서 전달
          const inputContent = await fs.readFile(input, 'utf-8')
          inputData = JSON.parse(inputContent)
        }

        await this.takeScreenshot({
          port,
          output: outputPath,
          uploadConfig,
          inputData,
        })
      }
    } catch (error) {
      console.error('❌ 에러:', error instanceof Error ? error.message : error)
      process.exit(1)
    } finally {
      // 우리가 서버를 시작했다면 종료
      if (this.viteProcess) {
        await this.stopViteServer()
      }
    }
  }
}

// CLI 실행 부분
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  const options: ScreenshotOptions = {}

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    const nextArg = args[i + 1]

    switch (arg) {
      case '--output':
      case '-o':
        if (nextArg) {
          options.output = nextArg
          i++
        }
        break
      case '--port':
      case '-p':
        if (nextArg) {
          options.port = parseInt(nextArg, 10)
          i++
        }
        break
      case '--width':
      case '-w':
        if (nextArg) {
          options.width = parseInt(nextArg, 10)
          i++
        }
        break
      case '--height':
      case '-h':
        if (nextArg) {
          options.height = parseInt(nextArg, 10)
          i++
        }
        break
      case '--wait':
        if (nextArg) {
          options.waitTime = parseInt(nextArg, 10)
          i++
        }
        break
      case '--input':
      case '-i':
        if (nextArg) {
          options.input = nextArg
          i++
        }
        break
      case '--batch':
      case '-b':
        options.batch = true
        break
      case '--input-dir':
      case '-d':
        if (nextArg) {
          options.inputDir = nextArg
          i++
        }
        break

      case '--help':
        console.log(`
사용법: npm run screenshot [옵션]

기본 옵션:
  --output, -o <파일명>    출력 파일명 (기본값: result.json)
  --input, -i <파일명>     입력 JSON 파일 (AlimtalkPreview props)
  --port, -p <포트>        개발 서버 포트 (기본값: 5173)
  --width, -w <너비>       화면 너비 (기본값: 375)
  --height, -h <높이>      화면 높이 (기본값: 812)
  --wait <시간>            페이지 로드 후 대기 시간(ms) (기본값: 2000)

배치 처리 옵션:
  --batch, -b              배치 모드: 폴더 내 모든 JSON 파일을 순차 처리
  --input-dir, -d <폴더>   입력 폴더 (기본값: 현재 폴더)

기타:
  --help                   도움말 표시

단일 처리 예제:
  npm run screenshot
  npm run screenshot -- --input input.json --output result.json

배치 처리 예제:
  npm run screenshot -- --batch --input-dir ./templates

💡 항상 upload-config.json 파일에서 설정을 읽어 API로 업로드합니다.
💡 모든 결과는 JSON 파일로 저장됩니다.
💡 upload-config.json 파일에는 token과 channelId를 설정해야 합니다.

upload-config.json 예제:
{
  "token": "your-access-token-here",
  "channelId": "your-channel-id-here"
}
        `)
        process.exit(0)
    }
  }

  const cli = new ScreenshotCLI()
  await cli.run(options)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('❌ 치명적 오류:', error)
    process.exit(1)
  })
}

export { ScreenshotCLI }
