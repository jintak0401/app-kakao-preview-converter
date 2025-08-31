import MessageVariableConst from './const'
import type { MessageVariableEntity } from './entity'

namespace MessageVariableMethod {
  export const toVariableEntry = ({
    type,
    value,
    fallback,
  }: MessageVariableEntity) => {
    const key =
      type === 'notSelected' ? `#{${fallback}}` : `#{${value}|${fallback}}`
    const _value =
      type === 'notSelected' ? fallback : `\${${value}|${fallback}}`

    return {
      key,
      value: _value,
    }
  }

  export const getValidVariable = (
    entity: MessageVariableEntity,
    { isUrlVariable }: { isUrlVariable: boolean }
  ) => {
    const { value: originalValue, ...rest } = entity

    const value = isUrlVariable
      ? originalValue.replace(MessageVariableConst.URL_VARIABLE_PATTERN, '')
      : originalValue

    return { ...rest, value }
  }
}

export default MessageVariableMethod
