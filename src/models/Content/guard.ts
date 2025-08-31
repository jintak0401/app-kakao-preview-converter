import ComponentBlock from '@/models/ComponentBlock'
import ContentConst from './const'
import type { Announcement, Extra, MainBody } from './type'

namespace ContentGuard {
  export const isMainContent = (
    dto: unknown
  ): dto is ComponentBlock.Entity & { type: MainBody } => {
    return ComponentBlock.guard.isOfType(
      dto,
      ContentConst.CONTENT_TYPE_TO_DTO_MAP.mainContent
    )
  }

  export const isSubContent = (
    dto: unknown
  ): dto is ComponentBlock.Entity & { type: Extra } => {
    return ComponentBlock.guard.isOfType(
      dto,
      ContentConst.CONTENT_TYPE_TO_DTO_MAP.subContent
    )
  }

  export const isNotice = (
    dto: unknown
  ): dto is ComponentBlock.Entity & { type: Announcement } => {
    return ComponentBlock.guard.isOfType(
      dto,
      ContentConst.CONTENT_TYPE_TO_DTO_MAP.notice
    )
  }

  export const isContent = (
    dto: unknown
  ): dto is ComponentBlock.Entity & {
    type: 'mainBody' | 'subBody' | 'info'
  } => {
    return isMainContent(dto) || isSubContent(dto) || isNotice(dto)
  }
}

export default ContentGuard
