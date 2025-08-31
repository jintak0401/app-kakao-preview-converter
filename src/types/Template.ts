export const TEMPLATE_FORM_TYPE = ['infoTalk', 'friendTalk'] as const
export type TemplateFormType = (typeof TEMPLATE_FORM_TYPE)[number]

export const EMPHASIZE_TYPE = ['none', 'text', 'image'] as const
export type EmphasizeType = (typeof EMPHASIZE_TYPE)[number]
export const EMPHASIZE_SECTION = ['subtitle', 'title', 'image'] as const
export type EmphasizeSection = (typeof EMPHASIZE_SECTION)[number]

export const CONTENT_TYPE = ['basic', 'info', 'channel', 'composite'] as const
export type ContentType = (typeof CONTENT_TYPE)[number]
export const CONTENT_SECTION = ['mainContent', 'subContent', 'notice'] as const
export type ContentSection = (typeof CONTENT_SECTION)[number]

export const TEMPLATE_BUTTON_TYPE = [
  'web',
  'app',
  'delivery',
  'channel',
] as const
export type TemplateButtonType = (typeof TEMPLATE_BUTTON_TYPE)[number]
export const TEMPLATE_BUTTON_URL_SECTION = [
  'android',
  'ios',
  'mobile',
  'pc',
] as const
export type TemplateButtonUrlSection =
  (typeof TEMPLATE_BUTTON_URL_SECTION)[number]

export const EMPTY_ERROR_KEY = 'empty' as const
export const OVER_MAX_LENGTH_ERROR_KEY = 'overMaxLength' as const

export const ERROR_KEYS = [EMPTY_ERROR_KEY, OVER_MAX_LENGTH_ERROR_KEY] as const
export type ErrorKey = (typeof ERROR_KEYS)[number]

export const TEMPLATE_STATUS_TYPE = [
  'pending',
  'reviewing',
  'rejected',
  'approved',
  'stopped',
  'blocked',
  'sleep',
  'deleted',
] as const

export type TemplateStatusType = (typeof TEMPLATE_STATUS_TYPE)[number]

export const TEMPLATE_STATUS_TRANSLATE_KEY_MAP: Record<
  TemplateStatusType,
  string
> = {
  pending: 'wam.kakao.status.pending',
  reviewing: 'wam.kakao.status.reviewing',
  rejected: 'wam.kakao.status.rejected',
  approved: 'wam.kakao.status.approved',
  stopped: 'wam.kakao.info_talk.templates.stop',
  blocked: 'wam.kakao.status.blocked',
  sleep: 'wam.kakao.status.sleep',
  // TODO(@gambit): 삭제됨으로 수정
  deleted: 'wam.common.delete',
} as const

export const ACTION_TYPE = [
  'history',
  'more',
  'guide',
  'divider',
  'save', // 저장
  'requestReview', // 검수 요청
  'requestCancel', // 검수 요청 취소
  'duplicate', // 복제
  'stop', // 작동 중지
  'start', // 작동 시작
  'wakeup', // 휴면 해제
] as const
export type TemplateActionType = (typeof ACTION_TYPE)[number]

export const TEMPLATE_STATUS_BANNER_TYPE = [
  'abusing',
  'rest',
  'request',
] as const
export type TemplateStatusBannerType =
  (typeof TEMPLATE_STATUS_BANNER_TYPE)[number]

export const TEMPLATE_COMMENT_STATUS_TYPE = [
  'request',
  'approved',
  'rejected',
  'reply',
] as const

export type TemplateCommentStatusType =
  (typeof TEMPLATE_COMMENT_STATUS_TYPE)[number]
