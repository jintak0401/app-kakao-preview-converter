import { EmphasizeEntity } from './entity'
import type { EmphasizeSection, EmphasizeType } from '@/types/Template'

namespace EmphasizeConst {
  export const SECTION_MAP: Record<EmphasizeType, EmphasizeSection[]> = {
    none: [],
    text: ['subtitle', 'title'],
    image: ['image'],
  }

  export const TITLE_MAX_LENGTH = 50
  export const SUBTITLE_MAX_LENGTH = 50

  export const ABLE_TO_HAS_VARIABLES: (keyof EmphasizeEntity)[] = [
    'title',
  ] as const

  export const ENTITY_TYPE_TO_DTO_MAP: Record<EmphasizeType, string> = {
    none: 'NONE',
    text: 'TEXT',
    image: 'IMAGE',
  }
}

export default EmphasizeConst
