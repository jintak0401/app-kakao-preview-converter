import type { EmphasizeResponseDTO, EmphasizeRequestDTO } from './dto'
import type { EmphasizeEntity } from './entity'
import EmphasizeAdapter from './adapter'
import EmphasizeMethod from './method'
import EmphasizeConst from './const'
import EmphasizeHelper from './helper'
import EmphasizeGuard from './guard'

namespace Emphasize {
  export type RequestDTO = EmphasizeRequestDTO
  export type ResponseDTO = EmphasizeResponseDTO
  export type Entity = EmphasizeEntity

  export const adapter = EmphasizeAdapter
  export const method = EmphasizeMethod
  export const constant = EmphasizeConst
  export const helper = EmphasizeHelper
  export const guard = EmphasizeGuard
}

export default Emphasize
