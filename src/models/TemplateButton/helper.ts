import { t } from 'i18next'
import type { TemplateButtonEntity } from './entity'

namespace TemplateButtonHelper {
  export const createEntity = (): TemplateButtonEntity => {
    return {
      type: 'web',
      name: '',
      android: '',
      ios: '',
      mobile: '',
      pc: '',
    }
  }

  export const isNeedShippingGuide = (type: TemplateButtonEntity['type']) => {
    return type === 'delivery'
  }

  export const isEditableName = (type: TemplateButtonEntity['type']) => {
    return type !== 'channel'
  }

  export const getDefaultName = (type: TemplateButtonEntity['type']) => {
    return type === 'channel'
      ? t('wam.kakao.info_talk.templates.form.button_type.add_channel')
      : ''
  }
}

export default TemplateButtonHelper
