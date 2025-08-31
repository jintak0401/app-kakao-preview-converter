import type { PreviewFileRequestDTO, PreviewFileResponseDTO } from './dto'
import type { PreviewFileEntity } from './entity'

namespace PreviewFileAdapter {
  export function fromResponseDTO(
    dto: PreviewFileResponseDTO
  ): PreviewFileEntity {
    return dto
  }

  export function toRequestDTO(
    entity: PreviewFileEntity
  ): PreviewFileRequestDTO {
    return {
      ...entity,
    }
  }
}

export default PreviewFileAdapter
