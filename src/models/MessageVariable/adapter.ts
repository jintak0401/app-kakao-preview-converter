import type {
  MessageVariableResponseDTO,
  MessageVariableRequestDTO,
} from './dto'
import type { MessageVariableEntity } from './entity'
import MessageVariableMethod from './method'
import MessageVariableHelper from './helper'

namespace MessageVariableAdapter {
  export const fromResponseDTO = (
    dto: MessageVariableResponseDTO = ''
  ): MessageVariableEntity => {
    const variable = MessageVariableHelper.parseVariable(dto)
    return variable
  }

  export const toRequestDTO = (
    entity: MessageVariableEntity
  ): MessageVariableRequestDTO => {
    const { value } = MessageVariableMethod.toVariableEntry(entity)
    return value
  }
}

export default MessageVariableAdapter
