import TemplateButton from '@/models/TemplateButton'
import ComponentBlock from '@/models/ComponentBlock'
import { assert } from '@/utils/Assert'
import type {
  TemplateButtonListResponseDTO,
  TemplateButtonListRequestDTO,
} from './dto'
import type { TemplateButtonListEntity } from './entity'
import TemplateButtonListHelper from './helper'

namespace TemplateButtonListAdapter {
  export const fromResponseDTO = (
    dto: TemplateButtonListResponseDTO
  ): TemplateButtonListEntity => {
    try {
      assert(
        ComponentBlock.guard.isButtonList(dto),
        'Invalid template button list DTO structure'
      )
      return dto.components.map(TemplateButton.adapter.fromResponseDTO)
    } catch {
      return TemplateButtonListHelper.createEntity()
    }
  }

  export const toCustomPayload = (
    entity: TemplateButtonListEntity
  ): TemplateButtonListRequestDTO => {
    if (entity.length === 0) {
      return undefined
    }

    return {
      type: 'list',
      components: entity.map(TemplateButton.adapter.toRequestDTO),
    }
  }

  export const toPreviewContent = (entity: TemplateButtonListEntity) => {
    return entity.map(TemplateButton.adapter.toPreviewContent).join('\n')
  }
}

export default TemplateButtonListAdapter
