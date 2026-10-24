import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'gather-thyme-favorites'
const FavoritesContext = createContext(null)

function readFavorites() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed.filter((meal) => meal?.idMeal) : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readFavorites)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch (error) {
      console.error('Could not save favorites to local storage.', error)
    }
  }, [favorites])

  const value = useMemo(() => ({
    favorites,
    isFavorite: (id) => favorites.some((meal) => meal.idMeal === id),
    toggleFavorite: (meal) => {
      if (!meal?.idMeal) return
      setFavorites((current) => current.some((item) => item.idMeal === meal.idMeal)
        ? current.filter((item) => item.idMeal !== meal.idMeal)
        : [meal, ...current])
    },
  }), [favorites])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider.')
  return context
}
