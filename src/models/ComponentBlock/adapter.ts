import type { ComponentBlockEntity } from './entity'
import type { ComponentBlockRequestDTO, ComponentBlockResponseDTO } from './dto'

namespace ComponentBlockAdapter {
  export const toRequestDTO = (
    entity: ComponentBlockEntity
  ): ComponentBlockRequestDTO => {
    return {
      type: entity.type,
      properties: entity.properties,
      components: entity.components?.map(toRequestDTO),
    }
  }

  export const fromResponseDTO = (
    dto: ComponentBlockResponseDTO
  ): ComponentBlockEntity => {
    return {
      type: dto.type,
      properties: dto.properties,
      components: dto.components?.map(fromResponseDTO),
    }
  }
}

export default ComponentBlockAdapter
