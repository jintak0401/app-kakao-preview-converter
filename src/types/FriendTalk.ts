export const FRIEND_TALK_TYPE = [
  'base',
  'wideImage',
  'wideList',
  'carouselFeed',
  'commerce',
  'carouselCommerce',
] as const
export type FriendTalkType = (typeof FRIEND_TALK_TYPE)[number]

export const FRIEND_TALK_SECTION = [
  'image',
  'content',
  'divider',
  'button',
] as const
export type FriendTalkSection = (typeof FRIEND_TALK_SECTION)[number]
