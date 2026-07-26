/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from 'react'

export const ReaderContext = createContext()

export function ReaderProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('reader-settings')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        // ignore parse errors
      }
    }
    return {
      theme: 'light', // light, dark, sepia
      fontFamily: 'sans-serif', // sans-serif, serif
      fontSize: 18,
      lineHeight: 1.6
    }
  })

  useEffect(() => {
    localStorage.setItem('reader-settings', JSON.stringify(settings))
  }, [settings])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <ReaderContext.Provider value={{ settings, updateSetting }}>
      {children}
    </ReaderContext.Provider>
  )
}
