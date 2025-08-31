import type { ContentResponseDTO, ContentRequestDTO } from './dto'
import type { ContentEntity } from './entity'
import ContentAdapter from './adapter'
import ContentMethod from './method'
import ContentConst from './const'
import ContentHelper from './helper'
import ContentGuard from './guard'

namespace Content {
  export type RequestDTO = ContentRequestDTO
  export type ResponseDTO = ContentResponseDTO
  export type Entity = ContentEntity

  export const adapter = ContentAdapter
  export const method = ContentMethod
  export const constant = ContentConst
  export const helper = ContentHelper
  export const guard = ContentGuard
}

export default Content
