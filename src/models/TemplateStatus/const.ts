import type {
  TemplateActionType,
  TemplateStatusBannerType,
  TemplateStatusType,
} from '@/types/Template'

namespace TemplateStatusConst {
  export const ACTIONS_MAP: Record<TemplateStatusType, TemplateActionType[]> = {
    pending: ['more', 'divider', 'guide', 'save', 'requestReview'],
    reviewing: ['guide', 'requestCancel'],
    rejected: ['history', 'more', 'divider', 'guide', 'save', 'requestReview'],
    approved: ['history', 'more', 'divider', 'duplicate', 'stop'],
    stopped: ['history', 'more', 'divider', 'duplicate', 'start'],
    blocked: ['history', 'more', 'divider', 'duplicate'],
    sleep: ['history', 'more', 'divider', 'duplicate', 'wakeup'],
    deleted: ['history', 'more', 'divider', 'guide', 'save', 'requestReview'],
  } as const

  export const BANNER_MAP: Partial<
    Record<TemplateStatusType, TemplateStatusBannerType>
  > = {
    blocked: 'abusing',
    sleep: 'rest',
    deleted: 'request',
  } as const

  export const DTO_TO_ENTITY_MAP: Record<string, TemplateStatusType> = {
    draft: 'pending',
    confirmed: 'approved',
    blocked: 'blocked',
    dormant: 'sleep',
    rejected: 'rejected',
    inspection: 'reviewing',
    stopped: 'stopped',
    deleted: 'deleted',
  } as const

  export const MESSAGE_FILTER_LIST: TemplateStatusType[] = [
    'approved',
    'stopped',
    'sleep',
    'blocked',
    'deleted',
  ] as const
}

export default TemplateStatusConst
