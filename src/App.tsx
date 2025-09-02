import { AlimtalkPreview } from '@channel-io/shared-components'
import { useState, useEffect } from 'react'
import InfoTalkTemplate from './models/InfoTalkTemplate'

function App() {
  const [props, setProps] = useState<InfoTalkTemplate.Entity>(
    InfoTalkTemplate.helper.createEntity()
  )
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
          setProps(InfoTalkTemplate.adapter.fromCustomPayloadDTO(data))
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
      <AlimtalkPreview
        {...InfoTalkTemplate.method.toAlimtalkPreviewProps(props, {
          profileName: '발신 프로필',
          variablesMap: props.variables,
        })}
      />
    </div>
  )
}

export default App
