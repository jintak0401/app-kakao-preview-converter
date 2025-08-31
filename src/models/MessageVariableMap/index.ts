import type { MessageVariableMapEntity } from './entity'
import MessageVariableMapMethod from './method'
import MessageVariableMapAdapter from './adapter'
import {
  MessageVariableMapRequestDTO,
  MessageVariableMapResponseDTO,
} from './dto'

namespace MessageVariableMap {
  export type Entity = MessageVariableMapEntity
  export type RequestDTO = MessageVariableMapRequestDTO
  export type ResponseDTO = MessageVariableMapResponseDTO

  export const method = MessageVariableMapMethod
  export const adapter = MessageVariableMapAdapter
}

export default MessageVariableMap
