import type { ComponentBlockEntity } from './entity'

namespace ComponentBlockHelper {
  export const createEntity = ({
    type,
    properties = {},
    components = [],
  }: {
    type: string
    properties?: Record<string, string>
    components?: ComponentBlockEntity[]
  }): ComponentBlockEntity => {
    return {
      type,
      properties,
      components: components.length > 0 ? components : undefined,
    }
  }
}

export default ComponentBlockHelper
