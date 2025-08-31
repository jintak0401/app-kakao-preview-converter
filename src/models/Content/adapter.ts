import ComponentBlock from '@/models/ComponentBlock'
import { assert } from '@/utils/Assert'
import { joinPreviewContent } from '@/models/utils'
import ContentGuard from './guard'
import ContentHelper from './helper'
import type { ContentRequestDTO, ContentResponseDTO } from './dto'
import type { ContentEntity } from './entity'
import ContentConst from './const'

namespace ContentAdapter {
  export const fromResponseDTO = (dto: ContentResponseDTO): ContentEntity => {
    let result: ContentEntity = ContentHelper.createEntity()
    result.type = ContentHelper.getType(dto)

    dto.forEach((component) => {
      // 본문
      if (ContentGuard.isMainContent(component)) {
        assert(ComponentBlock.guard.hasMessage(component))
        result.mainContent = component.properties.message
      }
      // 부가정보
      else if (ContentGuard.isSubContent(component)) {
        assert(ComponentBlock.guard.hasMessage(component))
        result.subContent = component.properties.message
      }
      // 안내 문구
      else if (ContentGuard.isNotice(component)) {
        assert(ComponentBlock.guard.hasMessage(component))
        result.notice = component.properties.message
      }
    })

    return result
  }

  const toMainContentRequestDTO = (
    entity: ContentEntity
  ): ComponentBlock.Entity => ({
    type: ContentConst.CONTENT_TYPE_TO_DTO_MAP.mainContent,
    properties: {
      message: entity.mainContent,
    },
  })

  const toSubContentRequestDTO = (
    entity: ContentEntity
  ): ComponentBlock.Entity => ({
    type: ContentConst.CONTENT_TYPE_TO_DTO_MAP.subContent,
    properties: {
      message: entity.subContent,
    },
  })

  const toNoticeRequestDTO = (
    entity: ContentEntity
  ): ComponentBlock.Entity => ({
    type: ContentConst.CONTENT_TYPE_TO_DTO_MAP.notice,
    properties: {
      message: entity.notice,
    },
  })

  const TO_REQUEST_DTO_MAP = {
    basic: [toMainContentRequestDTO],
    info: [toMainContentRequestDTO, toSubContentRequestDTO],
    channel: [toMainContentRequestDTO, toNoticeRequestDTO],
    composite: [
      toMainContentRequestDTO,
      toSubContentRequestDTO,
      toNoticeRequestDTO,
    ],
  } as const

  export const toCustomPayload = (entity: ContentEntity): ContentRequestDTO => {
    return TO_REQUEST_DTO_MAP[entity.type].map((toRequestDTO) => {
      return toRequestDTO(entity)
    })
  }

  export const toPreviewContent = (entity: ContentEntity) => {
    const sections = ContentConst.SECTION_MAP[entity.type]
    return joinPreviewContent(...sections.map((section) => entity[section]))
  }

  export const typeToDTO = (entity: ContentEntity): string => {
    return ContentConst.ENTITY_TYPE_TO_DTO_MAP[entity.type]
  }
}

export default ContentAdapter
