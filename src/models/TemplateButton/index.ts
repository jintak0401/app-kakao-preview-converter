import type { TemplateButtonResponseDTO, TemplateButtonRequestDTO } from './dto'
import type { TemplateButtonEntity } from './entity'
import TemplateButtonAdapter from './adapter'
import TemplateButtonMethod from './method'
import TemplateButtonHelper from './helper'
import TemplateButtonConst from './const'

namespace TemplateButton {
  export type RequestDTO = TemplateButtonRequestDTO
  export type ResponseDTO = TemplateButtonResponseDTO
  export type Entity = TemplateButtonEntity

  export const adapter = TemplateButtonAdapter
  export const method = TemplateButtonMethod
  export const helper = TemplateButtonHelper
  export const constant = TemplateButtonConst
}

export default TemplateButton
