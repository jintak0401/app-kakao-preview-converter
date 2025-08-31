import type { TemplateStatusResponseDTO } from './dto'
import type { TemplateStatusEntity } from './entity'
import TemplateStatusAdapter from './adapter'
import TemplateStatusMethod from './method'
import TemplateStatusConst from './const'

namespace TemplateStatus {
  export type ResponseDTO = TemplateStatusResponseDTO
  export type Entity = TemplateStatusEntity

  export const adapter = TemplateStatusAdapter
  export const method = TemplateStatusMethod
  export const constant = TemplateStatusConst
}

export default TemplateStatus
