import TemplateStatusConst from './const'
import { TemplateStatusResponseDTO } from './dto'
import type { TemplateStatusEntity } from './entity'

namespace TemplateStatusAdapter {
  export const fromResponseDTO = (
    dto: TemplateStatusResponseDTO
  ): TemplateStatusEntity => {
    return TemplateStatusConst.DTO_TO_ENTITY_MAP[dto]
  }
}

export default TemplateStatusAdapter
