import { t } from 'i18next'
import type { ContentEntity } from './entity'
import { ContentResponseDTO } from './dto'
import { ContentType } from '@/types/Template'
import ContentConst from './const'
import ContentGuard from './guard'
import { assert } from '@/utils/Assert'

namespace ContentHelper {
  export const createEntity = (): ContentEntity => {
    return {
      mainContent: '',
      subContent: '',
      notice: t(
        'wam.kakao.info_talk.templates.form.advertisement_content.value'
      ),
      type: 'basic',
    }
  }

  export const getType = (dto: ContentResponseDTO): ContentType => {
    if (dto.length === ContentConst.SECTION_MAP.basic.length) {
      return 'basic'
    } else if (dto.length === ContentConst.SECTION_MAP.composite.length) {
      return 'composite'
    } else if (dto.some(ContentGuard.isSubContent)) {
      return 'info'
    } else if (dto.some(ContentGuard.isNotice)) {
      return 'channel'
    }

    assert(false, 'Invalid content type')
  }
}

export default ContentHelper
