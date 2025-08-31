import type {
  MessageVariableResponseDTO,
  MessageVariableRequestDTO,
} from './dto'
import type { MessageVariableEntity } from './entity'
import { type MessageVariableType } from './type'
import MessageVariableAdapter from './adapter'
import MessageVariableMethod from './method'
import MessageVariableHelper from './helper'
import MessageVariableConst from './const'
import MessageVariableGuard from './guard'

namespace MessageVariable {
  export type RequestDTO = MessageVariableRequestDTO
  export type ResponseDTO = MessageVariableResponseDTO
  export type Entity = MessageVariableEntity
  export type Type = MessageVariableType

  export const adapter = MessageVariableAdapter
  export const method = MessageVariableMethod
  export const helper = MessageVariableHelper
  export const constant = MessageVariableConst
  export const guard = MessageVariableGuard
}

export default MessageVariable
