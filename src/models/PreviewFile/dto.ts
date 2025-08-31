type FileDTO = {
  id: string
  key: string
  name: string
  shardDomain: string

  previewKey?: string
  type: string
  contentType?: string
  bucket: string

  entityType?: string
  entityId?: string

  size: number
  width?: number
  height?: number
  orientation?: number
  duration?: number

  channelId?: string
  chatType?: string
  chatId?: string

  animated?: boolean
}

export type PreviewFileResponseDTO = FileDTO
export type PreviewFileRequestDTO = FileDTO
