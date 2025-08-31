import { use as i18nUse } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import BezierAppProvider from './common/BezierAppProvider'
import { translations } from './assets/translations'

import '@channel.io/bezier-react/styles.css'

async function prepare() {
  i18nUse(initReactI18next).init({
    resources: translations,
    lng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  })
}

prepare().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BezierAppProvider>
        <App />
      </BezierAppProvider>
    </StrictMode>
  )
})
