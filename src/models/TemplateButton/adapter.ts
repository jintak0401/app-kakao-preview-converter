import { assert } from '@/utils/Assert'
import ComponentBlock from '@/models/ComponentBlock'
import TemplateButtonConst from './const'
import type { TemplateButtonRequestDTO, TemplateButtonResponseDTO } from './dto'
import type { TemplateButtonEntity } from './entity'

namespace TemplateButtonAdapter {
  export const fromResponseDTO = (
    dto: TemplateButtonResponseDTO
  ): TemplateButtonEntity => {
    assert(
      ComponentBlock.guard.withProperties(dto, ['type', 'name']),
      'Invalid template button DTO structure'
    )

    const buttonTypeDTO = dto.properties
      .type as TemplateButtonConst.ButtonTypeDTO
    const type = TemplateButtonConst.BUTTON_TYPE_FROM_DTO_MAP[buttonTypeDTO]

    assert(type !== undefined, `Invalid button type: ${buttonTypeDTO}`)

    return {
      type,
      name: dto.properties.name || '',
      android: dto.properties.schemeAndroid || '',
      ios: dto.properties.schemeIos || '',
      mobile: dto.properties.urlMobile || '',
      pc: dto.properties.urlPc || '',
    }
  }

  export const toRequestDTO = (
    entity: TemplateButtonEntity
  ): TemplateButtonRequestDTO => {
    const buttonTypeDTO =
      TemplateButtonConst.BUTTON_TYPE_TO_DTO_MAP[entity.type]

    return {
      type: 'button',
      properties: {
        type: buttonTypeDTO,
        name: entity.name,
        schemeAndroid: entity.android,
        schemeIos: entity.ios,
        urlMobile: entity.mobile,
        urlPc: entity.pc,
      },
    }
  }

  export const toPreviewContent = (entity: TemplateButtonEntity) => {
    return `[${entity.name}]`
  }
}

export default TemplateButtonAdapter
