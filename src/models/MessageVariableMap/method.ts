import MessageVariable from '@/models/MessageVariable'

namespace MessageVariableMapMethod {
  export const replaceVariables = (
    entity: Record<string, MessageVariable.Entity>,
    {
      text,
      getSchemaValue,
    }: {
      text: string
      getSchemaValue?: (variable: MessageVariable.Entity) => string | undefined
    }
  ): string => {
    return text.replace(
      MessageVariable.constant.ALL_VARIABLES_PATTERN,
      (match) => {
        const variable = entity[match]
        if (!variable) {
          return match
        }
        return getSchemaValue?.(variable) || variable.fallback || match
      }
    )
  }
}

export default MessageVariableMapMethod
