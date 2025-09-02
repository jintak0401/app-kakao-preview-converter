import ComponentBlock from '@/models/ComponentBlock'

namespace EmphasizeGuard {
  export const isSubTitle = (
    dto: unknown
  ): dto is ComponentBlock.Entity & { type: 'boldSubTitle' } => {
    return ComponentBlock.guard.isOfType(dto, 'boldSubTitle')
  }

  export const isTitle = (
    dto: unknown
  ): dto is ComponentBlock.Entity & { type: 'boldTitle' } => {
    return ComponentBlock.guard.isOfType(dto, 'boldTitle')
  }

  export const isImage = (
    dto: unknown
  ): dto is ComponentBlock.Entity & { type: 'templateImage' } => {
    return ComponentBlock.guard.isOfType(dto, 'templateImage')
  }

  export const isEmphasize = (
    dto: unknown
  ): dto is ComponentBlock.Entity & {
    type: 'boldSubTitle' | 'boldTitle' | 'image'
  } => {
    return isSubTitle(dto) || isTitle(dto) || isImage(dto)
  }
}

export default EmphasizeGuard
