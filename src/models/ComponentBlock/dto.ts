type ComponentBlockDTO = {
  type: string
  properties?: Record<string, string>
  components?: ComponentBlockDTO[]
}

export type ComponentBlockRequestDTO = ComponentBlockDTO
export type ComponentBlockResponseDTO = ComponentBlockDTO
