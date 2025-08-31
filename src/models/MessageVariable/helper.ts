import MessageVariableConst from './const'
import type { MessageVariableEntity } from './entity'
import type { MessageVariableType } from './type'

namespace MessageVariableHelper {
  export const createEntity = ({
    type,
    value,
    fallback,
  }: {
    type?: MessageVariableType
    value?: string
    fallback?: string
  } = {}): MessageVariableEntity => {
    return {
      type,
      value: value || '',
      fallback: fallback || '',
    }
  }

  export const extractVariableMatches = (str: string): RegExpMatchArray[] => {
    return Array.from(str.matchAll(MessageVariableConst.ALL_VARIABLES_PATTERN))
  }

  export const extractVariables = (str: string): MessageVariableEntity[] => {
    const variables: MessageVariableEntity[] = []

    const allMatches = extractVariableMatches(str)

    allMatches.forEach(([, firstPart, secondPart]) => {
      // #{value|fallback} 형태
      if (secondPart !== undefined) {
        variables.push({
          type: undefined, // 추출된 변수는 타입이 지정되지 않은 상태
          value: firstPart,
          fallback: secondPart,
        })
      }
      // #{fallback} 형태
      else {
        variables.push({
          type: 'notSelected',
          value: '',
          fallback: firstPart,
        })
      }
    })

    return variables
  }

  export const parseVariable = (str: string): MessageVariableEntity => {
    const [, firstPart, secondPart] =
      str.match(MessageVariableConst.VARIABLE_DTO_PATTERN) ?? []

    // ${value|fallback} 형태
    if (firstPart && secondPart) {
      return {
        type: undefined,
        value: firstPart,
        fallback: secondPart,
      }
    }

    // 그 외의 모든 문자열
    return {
      type: 'notSelected',
      value: '',
      fallback: str,
    }
  }
}

export default MessageVariableHelper
