import { Heart, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'

export default function RecipeCard({ meal }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(meal.idMeal)

  return (
    <article className="recipe-card">
      <Link className="recipe-image-link" to={`/recipe/${meal.idMeal}`} aria-label={`View ${meal.strMeal} recipe`}>
        <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
      </Link>
      <button
        className={`favorite-button${favorite ? ' is-favorite' : ''}`}
        type="button"
        onClick={() => toggleFavorite(meal)}
        aria-label={favorite ? `Remove ${meal.strMeal} from favorites` : `Add ${meal.strMeal} to favorites`}
        aria-pressed={favorite}
      >
        <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
      </button>
      <div className="recipe-card-content">
        <div className="recipe-meta">{meal.strArea || meal.strCategory || 'A recipe to try'}</div>
        <Link className="recipe-title" to={`/recipe/${meal.idMeal}`}>{meal.strMeal}</Link>
        <Link className="recipe-link" to={`/recipe/${meal.idMeal}`}>View recipe <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  )
}
