import type {
  InfoTalkMessageDTO,
  InfoTalkTemplateCustomPayloadDTO,
  InfoTalkTemplateResponseDTO,
} from './dto'
import type { InfoTalkTemplateEntity } from './entity'
import InfoTalkTemplateAdapter from './adapter'
import InfoTalkTemplateMethod from './method'
import type { SortField as _SortField, SortOrder as _SortOrder } from './type'
import InfoTalkTemplateHelper from './helper'
import InfoTalkTemplateGuard from './guard'

namespace InfoTalkTemplate {
  export type ResponseDTO = InfoTalkTemplateResponseDTO
  export type MessageDTO = InfoTalkMessageDTO
  export type CustomPayloadDTO = InfoTalkTemplateCustomPayloadDTO
  export type Entity = InfoTalkTemplateEntity
  export type SortField = _SortField
  export type SortOrder = _SortOrder

  export const adapter = InfoTalkTemplateAdapter
  export const method = InfoTalkTemplateMethod
  export const helper = InfoTalkTemplateHelper
  export const guard = InfoTalkTemplateGuard
}

export default InfoTalkTemplate
