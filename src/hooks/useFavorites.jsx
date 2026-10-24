import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { deleteSavedRecipe, getSavedRecipes, saveRecipe } from '../services/favoriteStorage'
import { getMeal } from '../services/mealDb'

const LEGACY_STORAGE_KEY = 'gather-thyme-favorites'
const FavoritesContext = createContext(null)

function readLegacyFavorites() {
  try {
    const stored = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) throw new Error('Saved favorites have an invalid format.')
    return parsed.filter((meal) => meal?.idMeal)
  } catch (error) {
    console.error('Could not read previously saved favorites.', error)
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true
    async function loadFavorites() {
      try {
        let saved = await getSavedRecipes()
        if (saved.length === 0) {
          const legacyFavorites = readLegacyFavorites()
          if (legacyFavorites.length > 0) {
            await Promise.all(legacyFavorites.map(saveRecipe))
            localStorage.removeItem(LEGACY_STORAGE_KEY)
            saved = await getSavedRecipes()
          }
        }
        if (active) setFavorites(saved)
      } catch (error) {
        console.error('Could not load saved recipes for offline use.', error)
      } finally {
        if (active) setReady(true)
      }
    }
    loadFavorites()
    return () => { active = false }
  }, [])

  async function toggleFavorite(meal) {
    if (!meal?.idMeal) throw new Error('This recipe cannot be saved because it has no recipe ID.')

    if (favorites.some((saved) => saved.idMeal === meal.idMeal)) {
      await deleteSavedRecipe(meal.idMeal)
      setFavorites((current) => current.filter((saved) => saved.idMeal !== meal.idMeal))
      return
    }

    const fullRecipe = typeof meal.strInstructions === 'string' ? meal : await getMeal(meal.idMeal)
    if (!fullRecipe) throw new Error('The complete recipe could not be loaded, so it was not saved.')

    await saveRecipe(fullRecipe)
    setFavorites((current) => current.some((saved) => saved.idMeal === fullRecipe.idMeal)
      ? current
      : [fullRecipe, ...current])

    if (fullRecipe.strMealThumb && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration()
        .then((registration) => registration?.active?.postMessage({
          type: 'CACHE_FAVORITE_IMAGE',
          url: fullRecipe.strMealThumb,
        }))
        .catch((error) => console.error('Could not prepare the favorite image for offline use.', error))
    }
  }

  const value = useMemo(() => ({
    favorites,
    ready,
    isFavorite: (id) => favorites.some((meal) => meal.idMeal === id),
    toggleFavorite,
  }), [favorites, ready])

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider.')
  return context
}
