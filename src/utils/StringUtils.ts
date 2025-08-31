import { disassemble } from 'es-hangul'

export const randomString = (length: number): string => {
  if (length > 10) {
    return `${randomString(10)}${randomString(length - 10)}`
  }

  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}

export const filter = <T>({
  list,
  searchText,
  getSearchText = (item: T) => String(item),
}: {
  list: T[]
  searchText: string
  getSearchText?: (item: T) => string
}): T[] => {
  if (!searchText.trim()) {
    return list
  }

  const disassembledSearchText = disassemble(searchText)

  return list.filter((item) => {
    const targetText = getSearchText(item)
    const disassembledTargetText = disassemble(targetText)
    return disassembledTargetText.includes(disassembledSearchText)
  })
}
