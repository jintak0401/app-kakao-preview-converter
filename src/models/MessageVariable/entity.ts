import type { MessageVariableType } from './type'

export type MessageVariableEntity = {
  type?: MessageVariableType
  value: string
  fallback: string
}
