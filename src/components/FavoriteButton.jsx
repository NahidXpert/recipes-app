import { Heart } from 'lucide-react'
import { useState } from 'react'
import { useFavorites } from '../hooks/useFavorites'

export default function FavoriteButton({ meal }) {
  const { isFavorite, toggleFavorite, ready } = useFavorites()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const favorite = isFavorite(meal.idMeal)

  async function handleToggle() {
    setPending(true)
    setError('')
    try {
      await toggleFavorite(meal)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <>
      <button
        className={`favorite-button${favorite ? ' is-favorite' : ''}`}
        type="button"
        onClick={handleToggle}
        disabled={!ready || pending}
        aria-label={favorite ? `Remove ${meal.strMeal} from favorites` : `Add ${meal.strMeal} to favorites`}
        aria-pressed={favorite}
      >
        <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
      </button>
      {error && <span className="favorite-action-error" role="alert">{error}</span>}
    </>
  )
}
