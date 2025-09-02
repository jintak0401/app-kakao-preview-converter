import { joinPreviewContent } from '@/models/utils'
import EmphasizeGuard from './guard'
import EmphasizeHelper from './helper'
import type { EmphasizeRequestDTO, EmphasizeResponseDTO } from './dto'
import type { EmphasizeEntity } from './entity'
import EmphasizeConst from './const'

namespace EmphasizeAdapter {
  export const fromResponseDTO = (
    dto: EmphasizeResponseDTO,
    { imageName = '' }: { imageName?: string } = {}
  ): EmphasizeEntity => {
    let result: EmphasizeEntity = EmphasizeHelper.createEntity()

    dto.forEach((component) => {
      if (EmphasizeGuard.isSubTitle(component)) {
        result.subtitle = component.properties?.message || ''
        result.type = 'text'
      } else if (EmphasizeGuard.isTitle(component)) {
        result.title = component.properties?.message || ''
        result.type = 'text'
      } else if (EmphasizeGuard.isImage(component)) {
        result.imageUrl = component.properties?.templateImageKakaoUrl || ''
        result.imageName = imageName
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
        type: 'templateImage',
        properties: {
          templateImageKakaoUrl: entity.imageUrl,
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
