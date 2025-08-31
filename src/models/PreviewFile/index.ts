import PreviewFileAdapter from './adapter'
import type { PreviewFileRequestDTO, PreviewFileResponseDTO } from './dto'
import type { PreviewFileEntity } from './entity'

namespace PreviewFile {
  export type Entity = PreviewFileEntity
  export type RequestDTO = PreviewFileRequestDTO
  export type ResponseDTO = PreviewFileResponseDTO

  export const adapter = PreviewFileAdapter
}

export default PreviewFile
