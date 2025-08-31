import { MESSAGE_VARIABLE_TYPE, MessageVariableType } from './type'

namespace MessageVariableGuard {
  export const isVariableType = (
    type: string | undefined
  ): type is MessageVariableType => {
    return (
      type !== undefined &&
      MESSAGE_VARIABLE_TYPE.includes(type as MessageVariableType)
    )
  }

  export const isSelectedInfoType = (
    type: string | undefined
  ): type is Exclude<MessageVariableType, 'notSelected'> => {
    return type !== undefined && type !== 'notSelected'
  }
}

export default MessageVariableGuard
