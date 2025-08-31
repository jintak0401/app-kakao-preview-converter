import { AlimtalkButtonVariant } from '@channel-io/shared-components'
import MessageVariable from '@/models/MessageVariable'
import type { TemplateButtonEntity } from './entity'
import TemplateButtonConst from './const'

namespace TemplateButtonMethod {
  export const toAlimtalkPreviewProps = (
    entity: TemplateButtonEntity,
    { id }: { id: string }
  ) => {
    return {
      $id: id,
      name: entity.name,
      styleVariant:
        entity.type === 'channel'
          ? AlimtalkButtonVariant.Kakao
          : AlimtalkButtonVariant.Default,
    }
  }

  export const getUrlVariables = (
    entity: TemplateButtonEntity
  ): Set<string> => {
    return new Set(
      TemplateButtonConst.ABLE_TO_HAS_VARIABLES.map(
        (section) => entity[section]
      )
        .map(MessageVariable.helper.extractVariableMatches)
        .flat()
        .map(([variable]) => variable)
    )
  }
}

export default TemplateButtonMethod
