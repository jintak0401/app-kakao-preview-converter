import type PreviewFile from '@/models/PreviewFile'
import type ComponentBlock from '@/models/ComponentBlock'
import type MessageVariableMap from '@/models/MessageVariableMap'

export type InfoTalkTemplateResponseDTO = {
  id: string
  appKakaoId: string
  templateCode: string
  templateName: string
  templateImage?: PreviewFile.ResponseDTO
  component: {
    type: 'composite'
    components: ComponentBlock.ResponseDTO[]
  }
  state: string
  paramMapper?: MessageVariableMap.ResponseDTO
  createdAt: number
  updatedAt: number
}

export type InfoTalkTemplateCustomPayloadDTO = {
  data: {
    messageType: 'alimTalk'
    templateCode: string
    templateName: string
    component: {
      type: 'composite'
      components: ComponentBlock.RequestDTO[]
    }
  }
  paramMapper: MessageVariableMap.ResponseDTO
}

export type InfoTalkMessageDTO = {
  customPayload: InfoTalkTemplateCustomPayloadDTO
  preview: {
    files: PreviewFile.RequestDTO[]
    content: string
  }
}
