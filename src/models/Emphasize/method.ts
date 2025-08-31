import { t } from 'i18next'
import MessageVariable from '@/models/MessageVariable'
import type { EmphasizeEntity } from './entity'
import EmphasizeConst from './const'

namespace EmphasizeMethod {
  export const toAlimtalkPreviewProps = (
    entity: EmphasizeEntity,
    {
      replaceVariables = (text: string) => text,
    }: {
      replaceVariables?: (text: string) => string
    } = {}
  ) => {
    return {
      titleDescriptor: {
        text: replaceVariables(entity.title),
        placeholder: t('wam.kakao.info_talk.templates.form.title'),
        allows: () => entity.type === 'text',
      },
      subtitleDescriptor: {
        text: replaceVariables(entity.subtitle),
        placeholder: t('wam.kakao.info_talk.templates.form.subtitle'),
        allows: () => entity.type === 'text',
      },
      imageDescriptor: {
        mediaUrl: entity.imageUrl,
        allows: () => entity.type === 'image',
      },
    }
  }

  export const getVariables = (entity: EmphasizeEntity): Set<string> => {
    return new Set(
      EmphasizeConst.ABLE_TO_HAS_VARIABLES.map((section) => entity[section])
        .map(MessageVariable.helper.extractVariableMatches)
        .flat()
        .map(([variable]) => variable)
    )
  }

  export const isImageType = (entity: EmphasizeEntity): boolean => {
    return entity.type === 'image'
  }
}

export default EmphasizeMethod
