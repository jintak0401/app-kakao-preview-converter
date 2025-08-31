import type { ComponentBlockEntity } from './entity'

namespace ComponentBlockGuard {
  export const isOfType = (
    entity: unknown,
    targetType: string
  ): entity is ComponentBlockEntity => {
    return (
      typeof entity === 'object' &&
      entity !== null &&
      'type' in entity &&
      (entity as ComponentBlockEntity).type === targetType
    )
  }

  export const isButtonList = (
    entity: unknown
  ): entity is ComponentBlockEntity & {
    type: 'list'
    components: Array<ComponentBlockEntity & { type: 'button' }>
  } => {
    if (!isOfType(entity, 'list')) {
      return false
    }

    if (!entity.components || entity.components.length === 0) {
      return false
    }

    return entity.components.every((component) => isOfType(component, 'button'))
  }

  export const hasProperties = <T extends Record<string, any>>(
    entity: unknown
  ): entity is ComponentBlockEntity & { properties: T } => {
    return (
      typeof entity === 'object' &&
      entity !== null &&
      'properties' in entity &&
      typeof (entity as ComponentBlockEntity).properties === 'object' &&
      (entity as ComponentBlockEntity).properties !== null
    )
  }

  export const withProperties = <T extends Record<string, string>>(
    entity: unknown,
    keys: (keyof T)[]
  ): entity is ComponentBlockEntity & { properties: T } => {
    if (!hasProperties(entity)) {
      return false
    }

    const componentEntity = entity as ComponentBlockEntity & {
      properties: Record<string, string>
    }
    return keys.every((key) => key in componentEntity.properties)
  }

  export const hasMessage = (
    entity: unknown
  ): entity is ComponentBlockEntity & {
    properties: Record<string, string> & { message: string }
  } => {
    return withProperties(entity, ['message'])
  }
}

export default ComponentBlockGuard
