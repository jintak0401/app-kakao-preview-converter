import type { PropsWithChildren } from 'react'
import { useState } from 'react'
import type { ThemeName } from '@channel.io/bezier-react'
import { AppProvider } from '@channel.io/bezier-react'

interface BezierProviderProps extends PropsWithChildren {}

export default function BezierAppProvider({ children }: BezierProviderProps) {
  const [theme] = useState(() => 'light' as ThemeName)

  return <AppProvider themeName={theme}>{children}</AppProvider>
}
