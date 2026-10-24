import { ArrowLeft, ExternalLink, Heart, Youtube } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ErrorMessage, Loading, EmptyState } from '../components/Feedback'
import { useFavorites } from '../hooks/useFavorites'
import { getMeal } from '../services/mealDb'
import { getIngredients, getInstructions } from '../utils/ingredients'

export default function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [meal, setMeal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    getMeal(id)
      .then((result) => {
        if (active) setMeal(result)
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [id, attempt])

  if (loading) return <main className="page-main container"><Loading label="Getting the recipe ready…" /></main>
  if (error) return <main className="page-main container"><ErrorMessage message={error} onRetry={() => setAttempt((current) => current + 1)} /></main>
  if (!meal) return <main className="page-main container"><EmptyState title="Recipe not found" description="This recipe may no longer be available." /><Link className="button button-primary" to="/explore">Explore recipes</Link></main>

  const ingredients = getIngredients(meal)
  const instructions = getInstructions(meal)
  const favorite = isFavorite(meal.idMeal)

  return (
    <main className="page-main recipe-detail container">
      <button className="back-link" type="button" onClick={() => navigate(-1)}><ArrowLeft size={17} /> Back to recipes</button>
      <section className="detail-hero">
        <div className="detail-image"><img src={meal.strMealThumb} alt={meal.strMeal} /></div>
        <div className="detail-intro">
          <span className="eyebrow">{[meal.strArea, meal.strCategory].filter(Boolean).join(' · ') || 'A RECIPE TO LOVE'}</span>
          <h1>{meal.strMeal}</h1>
          <p>Something delicious to make and share. Gather your ingredients, take your time, and enjoy.</p>
          <button className={`button ${favorite ? 'button-saved' : 'button-primary'}`} type="button" onClick={() => toggleFavorite(meal)}>
            <Heart size={17} fill={favorite ? 'currentColor' : 'none'} />{favorite ? 'Saved to favorites' : 'Save this recipe'}
          </button>
          <div className="detail-links">
            {meal.strSource && <a href={meal.strSource} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Original source</a>}
            {meal.strYoutube && <a href={meal.strYoutube} target="_blank" rel="noreferrer"><Youtube size={16} /> Watch on YouTube</a>}
          </div>
        </div>
      </section>
      <div className="detail-content">
        <section className="ingredients-section">
          <span className="eyebrow">WHAT YOU’LL NEED</span><h2>Ingredients</h2>
          {ingredients.length ? <ul className="ingredient-list">{ingredients.map(({ name, measure }, index) => <li key={`${name}-${index}`}><span>{name}</span><span>{measure || '—'}</span></li>)}</ul> : <p className="muted">Ingredient details aren’t available for this recipe.</p>}
        </section>
        <section className="instructions-section">
          <span className="eyebrow">LET’S GET COOKING</span><h2>Instructions</h2>
          {instructions.length ? <ol className="instruction-list">{instructions.map((instruction, index) => <li key={`${index}-${instruction.slice(0, 20)}`}><span className="step-number">{String(index + 1).padStart(2, '0')}</span><p>{instruction}</p></li>)}</ol> : <p className="muted">Cooking instructions aren’t available for this recipe.</p>}
        </section>
      </div>
      <Link className="back-link detail-bottom-link" to="/explore"><ArrowLeft size={17} /> Find another recipe</Link>
    </main>
  )
}
