import type { ComponentBlockEntity } from './entity'
import type { ComponentBlockRequestDTO, ComponentBlockResponseDTO } from './dto'
import ComponentBlockHelper from './helper'
import ComponentBlockAdapter from './adapter'
import ComponentBlockGuard from './guard'

namespace ComponentBlock {
  export type Entity = ComponentBlockEntity
  export type RequestDTO = ComponentBlockRequestDTO
  export type ResponseDTO = ComponentBlockResponseDTO

  export const helper = ComponentBlockHelper
  export const adapter = ComponentBlockAdapter
  export const guard = ComponentBlockGuard
}

export default ComponentBlock
