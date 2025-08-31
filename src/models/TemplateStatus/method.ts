import type { TemplateStatusType } from '@/types/Template'
import type { TemplateStatusEntity } from './entity'
import TemplateStatusConst from './const'

namespace TemplateStatusMethod {
  const EDITABLE_STATUSES: TemplateStatusType[] = [
    'pending',
    'rejected',
    'deleted',
  ]

  export const isEditable = (entity: TemplateStatusEntity) => {
    return EDITABLE_STATUSES.includes(entity)
  }

  const MESSAGE_FILTER_SET = new Set(TemplateStatusConst.MESSAGE_FILTER_LIST)
  export const isDisplayableAtTemplateSelect = (
    entity: TemplateStatusEntity
  ) => {
    return MESSAGE_FILTER_SET.has(entity)
  }

  export const hasErrorAtTemplateSelect = (entity: TemplateStatusEntity) => {
    return isDisplayableAtTemplateSelect(entity) && entity !== 'approved'
  }

  export const shouldShowBadgeAtTemplateSelect = hasErrorAtTemplateSelect
}

export default TemplateStatusMethod
