import RecipeCard from './RecipeCard'

export default function RecipeGrid({ meals }) {
  return (
    <div className="recipe-grid">
      {meals.map((meal) => <RecipeCard key={meal.idMeal} meal={meal} />)}
    </div>
  )
}
