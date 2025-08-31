import type { EmphasizeEntity } from './entity'

namespace EmphasizeHelper {
  export const createEntity = (): EmphasizeEntity => {
    return {
      title: '',
      subtitle: '',
      imageUrl: '',
      imageName: '',
      type: 'none',
    }
  }
}

export default EmphasizeHelper
