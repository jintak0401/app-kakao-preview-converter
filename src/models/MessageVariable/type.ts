export const MESSAGE_VARIABLE_TYPE = [
  'customerInfo',
  'eventInfo',
  'chatInfo',
  'notSelected',
] as const

export type MessageVariableType = (typeof MESSAGE_VARIABLE_TYPE)[number]
