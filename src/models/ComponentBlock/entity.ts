export type ComponentBlockEntity = {
  type: string
  properties?: Record<string, string>
  components?: ComponentBlockEntity[]
}
