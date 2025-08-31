import type { ContentType } from '@/types/Template'

export type ContentEntity = {
  type: ContentType
  mainContent: string
  subContent: string
  notice: string
}
