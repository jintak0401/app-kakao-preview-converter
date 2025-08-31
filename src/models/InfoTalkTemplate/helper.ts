import { TEMPLATE_STATUS_TYPE } from '@/types/Template'
import Content from '@/models/Content'
import Emphasize from '@/models/Emphasize'
import TemplateButtonList from '@/models/TemplateButtonList'
import { InfoTalkTemplateEntity } from './entity'

namespace InfoTalkTemplateHelper {
  export const createEntity = (
    partial: Partial<InfoTalkTemplateEntity> = {}
  ): InfoTalkTemplateEntity => {
    return {
      id: partial.id ?? '',
      profileId: partial.profileId ?? '',
      templateName: partial.templateName ?? '',
      templateCode: partial.templateCode ?? '',
      variables: partial.variables ?? {},
      emphasize: partial.emphasize ?? Emphasize.helper.createEntity(),
      content: partial.content ?? Content.helper.createEntity(),
      buttonList:
        partial.buttonList ?? TemplateButtonList.helper.createEntity(),
      status: partial.status ?? TEMPLATE_STATUS_TYPE[0],
      updatedAt: partial.updatedAt ?? new Date().getTime(),
      createdAt: partial.createdAt ?? new Date().getTime(),
      templateImage: partial.templateImage,
    }
  }

  export const getVariables = ({
    buttonList,
    emphasize,
    content,
  }: Pick<
    InfoTalkTemplateEntity,
    'buttonList' | 'emphasize' | 'content'
  >): Set<string> => {
    return new Set([
      ...Emphasize.method.getVariables(emphasize),
      ...Content.method.getVariables(content),
      ...TemplateButtonList.method.getVariables(buttonList),
    ])
  }
}

export default InfoTalkTemplateHelper
