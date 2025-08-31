import type { InfoTalkTemplateCustomPayloadDTO } from './dto'

namespace InfoTalkTemplateGuard {
  export const isCustomPayloadDTO = (
    dto: unknown
  ): dto is InfoTalkTemplateCustomPayloadDTO => {
    return (
      typeof dto === 'object' &&
      dto !== null &&
      'data' in dto &&
      typeof dto.data === 'object' &&
      dto.data !== null &&
      'messageType' in dto.data &&
      dto.data.messageType === 'alimTalk'
    )
  }
}

export default InfoTalkTemplateGuard
