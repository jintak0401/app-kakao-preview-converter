import type {
  TemplateButtonListResponseDTO,
  TemplateButtonListRequestDTO,
} from './dto'
import type { TemplateButtonListEntity } from './entity'
import TemplateButtonListAdapter from './adapter'
import TemplateButtonListMethod from './method'
import TemplateButtonListHelper from './helper'

namespace TemplateButtonList {
  export type RequestDTO = TemplateButtonListRequestDTO
  export type ResponseDTO = TemplateButtonListResponseDTO
  export type Entity = TemplateButtonListEntity

  export const adapter = TemplateButtonListAdapter
  export const method = TemplateButtonListMethod
  export const helper = TemplateButtonListHelper
}

export default TemplateButtonList
