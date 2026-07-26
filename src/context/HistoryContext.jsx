/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from 'react'

export const HistoryContext = createContext()

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('reading-history')
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem('reading-history', JSON.stringify(history))
  }, [history])

  const saveProgress = useCallback((bookId, chapterId, scrollPosition) => {
    if (!bookId) return
    setHistory((prev) => ({
      ...prev,
      [bookId]: {
        chapterId,
        scrollPosition,
        updatedAt: new Date().toISOString()
      }
    }))
  }, [])

  const getProgress = useCallback((bookId) => {
    return history[bookId] || null
  }, [history])

  return (
    <HistoryContext.Provider value={{ history, saveProgress, getProgress }}>
      {children}
    </HistoryContext.Provider>
  )
}
