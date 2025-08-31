import { groupBy, mapValues } from 'es-toolkit'
import { t } from 'i18next'
import TemplateButton from '@/models/TemplateButton'
import { TemplateButtonType } from '@/types/Template'
import TemplateButtonListConst from './const'
import type { TemplateButtonListEntity } from './entity'

namespace TemplateButtonListMethod {
  export const isAddableNewButton = (entity: TemplateButtonListEntity) => {
    return entity.length < TemplateButtonListConst.BUTTON_LIST_MAX_LENGTH
  }

  export const toAlimtalkPreviewProps = (entity: TemplateButtonListEntity) => {
    return {
      buttonPlaceholder: t(
        'wam.kakao.info_talk.templates.form.button_name.placeholder'
      ),
      buttons: entity.map((button, index) =>
        TemplateButton.method.toAlimtalkPreviewProps(button, {
          id: `${index}`,
        })
      ),
    }
  }

  export const getUrlVariablesWithType = (
    entity: TemplateButtonListEntity
  ): {
    [key in TemplateButtonType]: Set<string>
  } => {
    return mapValues(
      groupBy(entity, (button) => button.type),
      (buttons) =>
        new Set(
          buttons.flatMap((button) =>
            Array.from(TemplateButton.method.getUrlVariables(button))
          )
        )
    )
  }

  export const getVariables = (
    entity: TemplateButtonListEntity
  ): Set<string> => {
    return new Set(
      entity.flatMap((button) =>
        Array.from(TemplateButton.method.getUrlVariables(button))
      )
    )
  }
}

export default TemplateButtonListMethod
