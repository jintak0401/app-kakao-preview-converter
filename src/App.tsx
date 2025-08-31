import { AlimtalkPreview } from '@channel-io/shared-components'
import { useState, useEffect } from 'react'

interface AlimtalkProps {
  avatarInfo: {
    name: string
    avatarUrl: string
  }
  alimtalkHeader: string
  alimtalkTemplateContent: string
  alimtalkTemplateContentPlaceholder: string
  extraDescriptor: {
    text: string
    placeholder: string
  }
  advertisementDescriptor: {
    text: string
  }
  titleDescriptor: {
    text: string
    placeholder: string
  }
  subtitleDescriptor: {
    text: string
    placeholder: string
  }
  imageDescriptor: {
    mediaUrl: string
  }
  buttonPlaceholder: string
  buttons: any[]
}

const defaultProps: AlimtalkProps = {
  avatarInfo: {
    name: '발신 프로필',
    avatarUrl: '',
  },
  alimtalkHeader: '알림톡 도착',
  alimtalkTemplateContent:
    '안녕하세요 이것은 본문입니다. #{본문변수}. 안녕히 가십시오',
  alimtalkTemplateContentPlaceholder: '고객에게 보여질 메시지를 적어주세요',
  extraDescriptor: {
    text: '이것은 부가정보입니다.',
    placeholder: '부가정보를 적어주세요',
  },
  advertisementDescriptor: {
    text: '채널 추가하고 이 채널의 마케팅 메시지 등을 카카오톡으로 받기',
  },
  titleDescriptor: {
    text: '',
    placeholder: '제목',
  },
  subtitleDescriptor: {
    text: '',
    placeholder: '부제목',
  },
  imageDescriptor: {
    mediaUrl: '{img_url}',
  },
  buttonPlaceholder: '버튼 이름을 작성해주세요',
  buttons: [],
}

function App() {
  const [props, setProps] = useState<AlimtalkProps>(defaultProps)
  const [isLoading, setIsLoading] = useState(true)
  const [propsLoadSuccess, setPropsLoadSuccess] = useState(false)

  useEffect(function loadProps() {
    const loadPropsData = async () => {
      try {
        console.log('🔍 props.json 파일을 로드 시도합니다...')
        // props.json 파일이 존재하는지 확인
        const response = await fetch('/props.json')
        console.log('📡 fetch 응답:', response.status, response.statusText)

        if (response.ok) {
          const data = await response.json()
          console.log('✅ props.json 데이터를 성공적으로 로드했습니다:', data)
          setProps(data)
          setPropsLoadSuccess(true)
        } else {
          console.warn(
            '⚠️ props.json 파일을 찾을 수 없습니다. 기본 props를 사용합니다.'
          )
          setPropsLoadSuccess(false)
        }
      } catch (error) {
        console.warn(
          '❌ props.json을 불러올 수 없어 기본 props를 사용합니다:',
          error
        )
        setPropsLoadSuccess(false)
      } finally {
        setIsLoading(false)
      }
    }

    loadPropsData()
  }, [])

  if (isLoading) {
    return (
      <div
        id="target"
        style={{
          width: 'fit-content',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
        }}
      >
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <div
      id="target"
      style={{ width: 'fit-content' }}
      data-props-loaded="true"
      data-props-success={propsLoadSuccess ? 'true' : 'false'}
    >
      <AlimtalkPreview {...props} />
    </div>
  )
}

export default App
