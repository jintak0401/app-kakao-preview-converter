import ComponentBlock from '@/models/ComponentBlock'
import { assert } from '@/utils/Assert'
import { joinPreviewContent } from '@/models/utils'
import EmphasizeGuard from './guard'
import EmphasizeHelper from './helper'
import type { EmphasizeRequestDTO, EmphasizeResponseDTO } from './dto'
import type { EmphasizeEntity } from './entity'
import EmphasizeConst from './const'

namespace EmphasizeAdapter {
  export const fromResponseDTO = (
    dto: EmphasizeResponseDTO
  ): EmphasizeEntity => {
    let result: EmphasizeEntity = EmphasizeHelper.createEntity()

    dto.forEach((component) => {
      if (EmphasizeGuard.isSubTitle(component)) {
        assert(ComponentBlock.guard.hasMessage(component))
        result.subtitle = component.properties.message
        result.type = 'text'
      } else if (EmphasizeGuard.isTitle(component)) {
        assert(ComponentBlock.guard.hasMessage(component))
        result.title = component.properties.message
        result.type = 'text'
      } else if (EmphasizeGuard.isImage(component)) {
        assert(ComponentBlock.guard.withProperties(component, ['imgUrl']))
        result.imageUrl = component.properties.imgUrl || ''
        result.imageName = component.properties.imgName || ''
        result.type = 'image'
      }
    })

    return result
  }

  export const toTextRequestDTO = (
    entity: EmphasizeEntity
  ): EmphasizeRequestDTO => {
    return [
      {
        type: 'boldSubTitle',
        properties: {
          message: entity.subtitle,
        },
      },
      {
        type: 'boldTitle',
        properties: {
          message: entity.title,
        },
      },
    ]
  }

  export const toImageRequestDTO = (
    entity: EmphasizeEntity
  ): EmphasizeRequestDTO => {
    return [
      {
        type: 'image',
        properties: {
          imgUrl: entity.imageUrl,
          imgName: entity.imageName,
        },
      },
    ]
  }

  export const TO_REQUEST_DTO_MAP = {
    text: toTextRequestDTO,
    image: toImageRequestDTO,
    none: () => [],
  } as const

  export const toCustomPayload = (
    entity: EmphasizeEntity
  ): EmphasizeRequestDTO => {
    return TO_REQUEST_DTO_MAP[entity.type](entity)
  }

  export const toPreviewContent = (entity: EmphasizeEntity) => {
    if (entity.type === 'text') {
      return joinPreviewContent(entity.subtitle, entity.title)
    }

    return ''
  }

  export const typeToDTO = (entity: EmphasizeEntity): string => {
    return EmphasizeConst.ENTITY_TYPE_TO_DTO_MAP[entity.type]
  }
}

export default EmphasizeAdapter
