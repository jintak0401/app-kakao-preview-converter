export const isProduction = () => {
  return import.meta.env.PROD
}

export const isMobile = () => {
  const userAgent = window.parent.navigator.userAgent
  return userAgent.includes('Mobi')
}
