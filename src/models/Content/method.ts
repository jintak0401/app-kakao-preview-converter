import { t } from 'i18next'
import MessageVariable from '@/models/MessageVariable'
import type { ContentEntity } from './entity'
import ContentConst from './const'

namespace ContentMethod {
  export const toAlimtalkPreviewProps = (
    entity: ContentEntity,
    {
      replaceVariables = (text: string) => text,
    }: {
      replaceVariables?: (text: string) => string
    } = {}
  ) => {
    return {
      alimtalkTemplateContent: replaceVariables(entity.mainContent),
      alimtalkTemplateContentPlaceholder: t(
        'wam.kakao.models.content.main_content_placeholder'
      ),
      extraDescriptor: {
        text: replaceVariables(entity.subContent),
        placeholder: t('wam.kakao.models.content.sub_content_placeholder'),
        allows: () => entity.type === 'info' || entity.type === 'composite',
      },
      advertisementDescriptor: {
        text: entity.notice,
        allows: () => entity.type === 'channel' || entity.type === 'composite',
      },
    }
  }

  export const getVariables = (entity: ContentEntity): Set<string> => {
    return new Set(
      ContentConst.ABLE_TO_HAS_VARIABLES.map((section) => entity[section])
        .map(MessageVariable.helper.extractVariableMatches)
        .flat()
        .map(([variable]) => variable)
    )
  }
}

export default ContentMethod
