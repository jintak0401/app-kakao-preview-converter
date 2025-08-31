export const joinPreviewContent = (...contents: string[]) => {
  return contents.filter(Boolean).join('\n\n')
}
