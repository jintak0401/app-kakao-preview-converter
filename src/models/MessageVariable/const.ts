namespace MessageVariableConst {
  export const ALL_VARIABLES_PATTERN = /\#\{([^}|]+?)(?:\|([^}]+))?\}/g
  export const VARIABLE_DTO_PATTERN = /^\$\{([^}|]+?)(?:\|([^}]+))?\}$/

  export const URL_VARIABLE_PATTERN = /([a-zA-Z][a-zA-Z0-9+.-]*):\/\//
}

export default MessageVariableConst
