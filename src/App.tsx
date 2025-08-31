import { AlimtalkPreview } from '@channel-io/shared-components'
import { useState } from 'react'

const props = {
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
} as const

function App() {
  return <AlimtalkPreview {...props} />
}

export default App
