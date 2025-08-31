import { TemplateButtonEntity } from './entity'
import { TemplateButtonType, TemplateButtonUrlSection } from '@/types/Template'

namespace TemplateButtonConst {
  export const NAME_MAX_LENGTH = 14
  export const URL_MAX_LENGTH = 500

  export const SECTION_MAP: Record<
    TemplateButtonType,
    TemplateButtonUrlSection[]
  > = {
    web: ['android', 'ios', 'mobile', 'pc'],
    app: ['android', 'ios'],
    delivery: [],
    channel: [],
  } as const

  export const BUTTON_TYPE_DTO = ['WL', 'AL', 'DS', 'AC'] as const

  export type ButtonTypeDTO = (typeof BUTTON_TYPE_DTO)[number]

  export const BUTTON_TYPE_FROM_DTO_MAP: Record<
    ButtonTypeDTO,
    TemplateButtonType
  > = {
    WL: 'web',
    AL: 'app',
    DS: 'delivery',
    AC: 'channel',
  }

  export const BUTTON_TYPE_TO_DTO_MAP: Record<
    TemplateButtonType,
    ButtonTypeDTO
  > = {
    web: 'WL',
    app: 'AL',
    delivery: 'DS',
    channel: 'AC',
  }

  export const ABLE_TO_HAS_VARIABLES: (keyof TemplateButtonEntity)[] = [
    'android',
    'ios',
    'mobile',
    'pc',
  ] as const
}

export default TemplateButtonConst
