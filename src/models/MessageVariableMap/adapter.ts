import MessageVariable from '@/models/MessageVariable'
import type {
  MessageVariableMapRequestDTO,
  MessageVariableMapResponseDTO,
} from './dto'
import { MessageVariableMapEntity } from './entity'

namespace MessageVariableMapAdapter {
  export const fromResponseDTO = (
    dto: MessageVariableMapResponseDTO
  ): MessageVariableMapEntity => {
    return Object.entries(dto).reduce((acc, [key, value]) => {
      acc[key] = MessageVariable.adapter.fromResponseDTO(value)
      return acc
    }, {} as MessageVariableMapEntity)
  }

  export const fromVariableStrings = (
    variables: Iterable<string>
  ): MessageVariableMapEntity => {
    return Object.fromEntries(
      Array.from(variables).map((variable) => [
        variable,
        MessageVariable.helper.createEntity(),
      ])
    )
  }

  export const toRequestDTO = (
    entity: MessageVariableMapEntity
  ): MessageVariableMapRequestDTO => {
    return Object.entries(entity).reduce((acc, [key, value]) => {
      acc[key] = MessageVariable.adapter.toRequestDTO(value)
      return acc
    }, {} as MessageVariableMapRequestDTO)
  }

  export const toRequestDTOByVariableStrings = (
    variables: Iterable<string>
  ): MessageVariableMapRequestDTO => {
    return Object.fromEntries(
      Array.from(variables).map((variable) => [variable, ''])
    )
  }
}

export default MessageVariableMapAdapter
