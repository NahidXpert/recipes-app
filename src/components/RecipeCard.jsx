import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import FavoriteButton from './FavoriteButton'

export default function RecipeCard({ meal }) {
  return (
    <article className="recipe-card">
      <Link className="recipe-image-link" to={`/recipe/${meal.idMeal}`} aria-label={`View ${meal.strMeal} recipe`}>
        <img src={meal.strMealThumb} alt={meal.strMeal} loading="lazy" />
      </Link>
      <FavoriteButton meal={meal} />
      <div className="recipe-card-content">
        <div className="recipe-meta">{meal.strArea || meal.strCategory || 'A recipe to try'}</div>
        <Link className="recipe-title" to={`/recipe/${meal.idMeal}`}>{meal.strMeal}</Link>
        <Link className="recipe-link" to={`/recipe/${meal.idMeal}`}>View recipe <ArrowUpRight size={15} /></Link>
      </div>
    </article>
  )
}
