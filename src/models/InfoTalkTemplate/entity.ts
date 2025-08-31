import type Emphasize from '@/models/Emphasize'
import type Content from '@/models/Content'
import type TemplateButtonList from '@/models/TemplateButtonList'
import type TemplateStatus from '@/models/TemplateStatus'
import type MessageVariableMap from '@/models/MessageVariableMap'
import type PreviewFile from '@/models/PreviewFile'

export type InfoTalkTemplateEntity = {
  id: string
  profileId: string
  templateCode: string
  templateName: string
  templateImage?: PreviewFile.Entity
  variables: MessageVariableMap.Entity
  emphasize: Emphasize.Entity
  content: Content.Entity
  buttonList: TemplateButtonList.Entity
  status: TemplateStatus.Entity
  updatedAt: number
  createdAt: number
}
