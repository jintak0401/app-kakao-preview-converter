import type { ContentSection, ContentType } from '@/types/Template'
import { ContentTypeDTO } from './type'
import { ContentEntity } from './entity'

namespace ContentConst {
  export const SECTION_MAP: Record<ContentType, ContentSection[]> = {
    basic: ['mainContent'],
    info: ['mainContent', 'subContent'],
    channel: ['mainContent', 'notice'],
    composite: ['mainContent', 'subContent', 'notice'],
  }

  export const MAIN_CONTENT_MAX_LENGTH = 1_000
  export const SUB_CONTENT_MAX_LENGTH = 500

  export const CONTENT_TYPE_TO_DTO_MAP: Record<ContentSection, ContentTypeDTO> =
    {
      mainContent: 'mainBody',
      subContent: 'extra',
      notice: 'announcement',
    }

  export const ABLE_TO_HAS_VARIABLES: (keyof ContentEntity)[] = [
    'mainContent',
    'subContent',
  ] as const

  export const ENTITY_TYPE_TO_DTO_MAP: Record<ContentType, string> = {
    basic: 'BA',
    info: 'EX',
    channel: 'AD',
    composite: 'MI',
  }
}

export default ContentConst
