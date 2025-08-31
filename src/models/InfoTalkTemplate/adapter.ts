import TemplateButtonList from '@/models/TemplateButtonList'
import Content from '@/models/Content'
import Emphasize from '@/models/Emphasize'
import MessageVariableMap from '@/models/MessageVariableMap'
import ComponentBlock from '@/models/ComponentBlock'
import TemplateStatus from '@/models/TemplateStatus'
import type { InfoTalkTemplateEntity } from './entity'
import InfoTalkTemplateHelper from './helper'
import {
  InfoTalkTemplateCustomPayloadDTO,
  InfoTalkTemplateResponseDTO,
} from './dto'
import { joinPreviewContent } from '../utils'

namespace InfoTalkTemplateAdapter {
  const getComponentEntities = (components: ComponentBlock.ResponseDTO[]) => {
    const _components = components.map(ComponentBlock.adapter.fromResponseDTO)

    const emphasizeComponents = _components.filter(Emphasize.guard.isEmphasize)
    const emphasize = Emphasize.adapter.fromResponseDTO(emphasizeComponents)

    const buttonListComponent = _components.find(
      ComponentBlock.guard.isButtonList
    )
    const buttonList = buttonListComponent
      ? TemplateButtonList.adapter.fromResponseDTO(buttonListComponent)
      : []

    const contentComponents = _components.filter(Content.guard.isContent)
    const content = Content.adapter.fromResponseDTO(contentComponents)

    return { emphasize, buttonList, content }
  }

  export const fromResponseDTO = (
    dto: InfoTalkTemplateResponseDTO
  ): InfoTalkTemplateEntity => {
    const {
      id,
      templateName,
      templateCode,
      appKakaoId,
      templateImage,
      state,
      component: { components },
    } = dto

    const { emphasize, buttonList, content } = getComponentEntities(components)

    const variables = MessageVariableMap.adapter.fromVariableStrings(
      InfoTalkTemplateHelper.getVariables({
        emphasize,
        buttonList,
        content,
      })
    )

    return InfoTalkTemplateHelper.createEntity({
      id,
      templateName,
      templateCode,
      templateImage,
      emphasize,
      buttonList,
      content,
      status: TemplateStatus.adapter.fromResponseDTO(state),
      profileId: appKakaoId,
      variables,
    })
  }

  export const fromCustomPayloadDTO = (
    dto: InfoTalkTemplateCustomPayloadDTO
  ): InfoTalkTemplateEntity => {
    const {
      data: {
        templateCode,
        templateName,
        component: { components },
      },
      paramMapper,
    } = dto

    const { emphasize, buttonList, content } = getComponentEntities(components)

    const variables = MessageVariableMap.adapter.fromResponseDTO(paramMapper)

    return InfoTalkTemplateHelper.createEntity({
      templateCode,
      templateName,
      emphasize,
      buttonList,
      content,
      variables,
    })
  }

  export const toPreviewContent = (entity: InfoTalkTemplateEntity) => {
    const previewContent = joinPreviewContent(
      Emphasize.adapter.toPreviewContent(entity.emphasize),
      Content.adapter.toPreviewContent(entity.content),
      TemplateButtonList.adapter.toPreviewContent(entity.buttonList)
    )

    const replaceVariables = (text: string): string => {
      return MessageVariableMap.method.replaceVariables(entity.variables, {
        text,
      })
    }

    return replaceVariables(previewContent)
  }
}

export default InfoTalkTemplateAdapter
