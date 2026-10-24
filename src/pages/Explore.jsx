import { Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ErrorMessage, Loading, EmptyState } from '../components/Feedback'
import RecipeGrid from '../components/RecipeGrid'
import SearchBar from '../components/SearchBar'
import { filterMeals, getAreas, getCategories, getIngredients, searchMeals } from '../services/mealDb'

export default function Explore() {
  const [params, setParams] = useSearchParams()
  const searchParam = params.get('search') ?? ''
  const categoryParam = params.get('category') ?? ''
  const areaParam = params.get('area') ?? ''
  const ingredientParam = params.get('ingredient') ?? ''
  const [categories, setCategories] = useState([])
  const [areas, setAreas] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtersLoading, setFiltersLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getCategories(), getAreas(), getIngredients()])
      .then(([categoryList, areaList, ingredientList]) => {
        if (!active) return
        setCategories(categoryList)
        setAreas(areaList)
        setIngredients(ingredientList)
      })
      .catch((requestError) => { if (active) setError(requestError.message) })
      .finally(() => { if (active) setFiltersLoading(false) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    async function loadMeals() {
      setLoading(true)
      setError('')
      try {
        let result = []
        if (searchParam) result = await searchMeals(searchParam)
        else if (categoryParam) result = await filterMeals('c', categoryParam)
        else if (areaParam) result = await filterMeals('a', areaParam)
        else if (ingredientParam) result = await filterMeals('i', ingredientParam)
        if (active) setMeals(result)
      } catch (requestError) {
        if (active) setError(requestError.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    loadMeals()
    return () => { active = false }
  }, [searchParam, categoryParam, areaParam, ingredientParam])

  function setFilter(key, value) {
    const next = new URLSearchParams()
    if (value) next.set(key, value)
    setParams(next)
  }

  const hasFilter = Boolean(searchParam || categoryParam || areaParam || ingredientParam)
  const title = searchParam ? `Results for “${searchParam}”` : categoryParam || areaParam || ingredientParam || 'Explore recipes'

  return (
    <main className="page-main">
      <section className="page-hero container">
        <span className="eyebrow">FIND YOUR NEXT FAVORITE</span>
        <h1>Explore recipes</h1>
        <p>Follow a craving, a cuisine, or whatever’s already in your kitchen.</p>
        <SearchBar initialValue={searchParam} onSearch={(query) => setFilter('search', query)} />
      </section>
      <section className="container explore-layout">
        <aside className="filter-panel" aria-label="Recipe filters">
          <h2><SlidersHorizontal size={17} /> Browse by</h2>
          <label htmlFor="category-filter">Category</label>
          <select id="category-filter" value={categoryParam} disabled={filtersLoading} onChange={(event) => setFilter('category', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item.idCategory} value={item.strCategory}>{item.strCategory}</option>)}
          </select>
          <label htmlFor="area-filter">Cuisine</label>
          <select id="area-filter" value={areaParam} disabled={filtersLoading} onChange={(event) => setFilter('area', event.target.value)}>
            <option value="">All cuisines</option>
            {areas.map((area) => <option key={area} value={area}>{area}</option>)}
          </select>
          <label htmlFor="ingredient-filter">Main ingredient</label>
          <select id="ingredient-filter" value={ingredientParam} disabled={filtersLoading} onChange={(event) => setFilter('ingredient', event.target.value)}>
            <option value="">Any ingredient</option>
            {ingredients.map((ingredient) => <option key={ingredient} value={ingredient}>{ingredient}</option>)}
          </select>
          {hasFilter && <button className="text-button clear-filters" type="button" onClick={() => setParams({})}>Clear filters</button>}
        </aside>
        <div className="results-area">
          <div className="results-heading"><h2>{title}</h2>{!loading && <span>{meals.length} {meals.length === 1 ? 'recipe' : 'recipes'}</span>}</div>
          {error && <ErrorMessage message={error} />}
          {loading && <Loading label="Looking for recipes…" />}
          {!loading && !error && meals.length > 0 && <RecipeGrid meals={meals} />}
          {!loading && !error && meals.length === 0 && (
            <EmptyState
              title={hasFilter ? 'No recipes found' : 'Start with a craving'}
              description={hasFilter ? 'Try another search or choose a different filter.' : 'Search a dish or choose a category, cuisine, or ingredient to get started.'}
            >
              {!hasFilter && <span className="empty-hint"><Search size={15} /> Try a search above</span>}
            </EmptyState>
          )}
        </div>
      </section>
    </main>
  )
}
