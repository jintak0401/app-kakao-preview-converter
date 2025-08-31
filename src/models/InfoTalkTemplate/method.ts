import { t } from 'i18next'
import TemplateStatus from '@/models/TemplateStatus'
import { filter } from '@/utils/StringUtils'
import type {
  TemplateActionType,
  TemplateStatusBannerType,
} from '@/types/Template'
import type { AlimtalkPreviewProps } from '@channel-io/shared-components'
import Content from '@/models/Content'
import Emphasize from '@/models/Emphasize'
import TemplateButtonList from '@/models/TemplateButtonList'
import MessageVariableMap from '@/models/MessageVariableMap'
import MessageVariable from '@/models/MessageVariable'
import type { InfoTalkTemplateEntity } from './entity'

namespace InfoTalkTemplateMethod {
  export const getStatusActions = (
    entity: InfoTalkTemplateEntity
  ): TemplateActionType[] => {
    return TemplateStatus.constant.ACTIONS_MAP[entity.status]
  }

  export const isEditableStatus = (entity: InfoTalkTemplateEntity): boolean => {
    return TemplateStatus.method.isEditable(entity.status)
  }

  export const getStatusBannerType = (
    entity: InfoTalkTemplateEntity
  ): TemplateStatusBannerType | undefined => {
    return TemplateStatus.constant.BANNER_MAP[entity.status]
  }

  export const isMatchedText = (
    entity: InfoTalkTemplateEntity,
    searchText: string
  ): boolean => {
    const targetText = `${entity.templateCode} ${entity.templateName}`
    return (
      filter({
        list: [targetText],
        searchText,
      }).length > 0
    )
  }

  const isMatchedStatus = (
    entity: InfoTalkTemplateEntity,
    statusSet: Set<TemplateStatus.Entity>
  ): boolean => {
    if (statusSet.size === 0) {
      return true
    }

    return statusSet.has(entity.status)
  }

  const isMatchedProfileId = (
    entity: InfoTalkTemplateEntity,
    profileIdSet: Set<string>
  ): boolean => {
    if (profileIdSet.size === 0) {
      return true
    }

    return profileIdSet.has(entity.profileId)
  }

  export const isMatched = (
    entity: InfoTalkTemplateEntity,
    options: {
      text?: string
      statusSet?: Set<TemplateStatus.Entity>
      profileIdSet?: Set<string>
    }
  ): boolean => {
    return (
      isMatchedText(entity, options.text || '') &&
      isMatchedStatus(entity, options.statusSet || new Set()) &&
      isMatchedProfileId(entity, options.profileIdSet || new Set())
    )
  }

  export const toAlimtalkPreviewProps = (
    entity: Pick<
      InfoTalkTemplateEntity,
      'emphasize' | 'content' | 'buttonList'
    >,
    {
      profileName,
      profileImageUrl = '',
      variablesMap = {},
      getSchemaValue,
    }: {
      profileName: string
      profileImageUrl?: string
      variablesMap?: MessageVariableMap.Entity
      getSchemaValue?: (variable: MessageVariable.Entity) => string | undefined
    }
  ): AlimtalkPreviewProps => {
    const { emphasize, content, buttonList } = entity

    const replaceVariables = (text: string): string => {
      return MessageVariableMap.method.replaceVariables(variablesMap, {
        text,
        getSchemaValue,
      })
    }

    return {
      avatarInfo: {
        name: profileName,
        avatarUrl: profileImageUrl,
      },
      alimtalkHeader: t('wam.kakao.models.alimtalk_preview.header'),
      ...Content.method.toAlimtalkPreviewProps(content, { replaceVariables }),
      ...Emphasize.method.toAlimtalkPreviewProps(emphasize, {
        replaceVariables,
      }),
      ...TemplateButtonList.method.toAlimtalkPreviewProps(buttonList),
    }
  }
}

export default InfoTalkTemplateMethod
