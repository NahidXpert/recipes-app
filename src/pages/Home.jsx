import { ArrowRight, LoaderCircle, MoveUpRight, Shuffle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCategories, getRandomMeal, filterMeals } from '../services/mealDb'
import { ErrorMessage, Loading } from '../components/Feedback'
import RecipeGrid from '../components/RecipeGrid'
import SearchBar from '../components/SearchBar'

export default function Home() {
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState(null)
  const [discoverMeals, setDiscoverMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [surpriseLoading, setSurpriseLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  async function loadHome() {
    setLoading(true)
    setError('')
    try {
      const [categoryList, randomMeal] = await Promise.all([getCategories(), getRandomMeal()])
      setCategories(categoryList)
      setFeatured(randomMeal)
      if (categoryList[0]?.strCategory) {
        const data = await filterMeals('c', categoryList[0].strCategory)
        setDiscoverMeals(data.slice(0, 4))
      } else {
        setDiscoverMeals([])
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadHome() }, [])

  async function surpriseMe() {
    setSurpriseLoading(true)
    setError('')
    try {
      const meal = await getRandomMeal()
      if (!meal?.idMeal) throw new Error('No recipe was returned. Please try again.')
      navigate(`/recipe/${meal.idMeal}`)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSurpriseLoading(false)
    }
  }

  return (
    <>
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow"><span className="eyebrow-line" /> GOOD FOOD, GOOD MOOD</span>
              <h1>Find your next<br /><em>favorite</em> meal.</h1>
              <p className="hero-description">A little inspiration for whatever’s in your fridge. Discover recipes worth slowing down for.</p>
              <SearchBar onSearch={(query) => navigate(`/explore?search=${encodeURIComponent(query)}`)} />
              <div className="hero-note">Fresh ideas, made for real life <span aria-hidden="true">↗</span></div>
            </div>
            <div className="hero-visual">
              <div className="hero-image-wrap">
                {featured?.strMealThumb ? <img src={featured.strMealThumb} alt={featured.strMeal} /> : <div className="image-placeholder" />}
              </div>
              <Link className="hero-photo-label" to={featured ? `/recipe/${featured.idMeal}` : '/explore'}><span>ON THE MENU</span><strong>{featured?.strMeal || 'A little something delicious'}</strong></Link>
              <span className="hero-sticker" aria-hidden="true">made<br />with love</span>
            </div>
          </div>
        </section>

        {error && <div className="container"><ErrorMessage message={error} onRetry={loadHome} /></div>}

        <section className="section container" id="categories">
          <div className="section-heading">
            <div><span className="eyebrow">A WORLD OF FLAVOR</span><h2>What sounds good?</h2></div>
            <Link className="arrow-link" to="/explore">Explore all recipes <ArrowRight size={17} /></Link>
          </div>
          {loading && <Loading label="Gathering recipe inspiration…" />}
          {!loading && categories.length > 0 && (
            <div className="category-grid">
              {categories.slice(0, 6).map((category, index) => (
                <Link className={`category-card category-card-${index % 3}`} key={category.idCategory} to={`/explore?category=${encodeURIComponent(category.strCategory)}`}>
                  {category.strCategoryThumb && <img src={category.strCategoryThumb} alt="" loading="lazy" />}
                  <span>{category.strCategory}</span><MoveUpRight size={18} />
                </Link>
              ))}
            </div>
          )}
          {!loading && categories.length === 0 && !error && <p className="muted">Categories aren’t available right now. Try exploring all recipes.</p>}
        </section>

        <section className="featured-band">
          <div className="container featured-band-inner">
            <div><span className="eyebrow eyebrow-light">CAN’T DECIDE?</span><h2>Let dinner surprise you.</h2><p>Meet your new favorite, picked just for you.</p></div>
            <button className="button button-light" type="button" onClick={surpriseMe} disabled={surpriseLoading}>
              {surpriseLoading ? <LoaderCircle className="spinner" size={17} /> : <Shuffle size={17} />}
              {surpriseLoading ? 'Finding a recipe…' : 'Surprise me'}
            </button>
          </div>
        </section>

        <section className="section container discover-section">
          <div className="section-heading">
            <div><span className="eyebrow">A FEW GOOD IDEAS</span><h2>Something to savor</h2></div>
            <Link className="arrow-link" to="/explore">See every recipe <ArrowRight size={17} /></Link>
          </div>
          {loading && <Loading />}
          {!loading && discoverMeals.length > 0 && <RecipeGrid meals={discoverMeals} />}
          {!loading && discoverMeals.length === 0 && !error && <p className="muted">No recipes to show yet. Explore to find your next dish.</p>}
        </section>
      </main>
      <footer className="site-footer">
        <div className="container footer-inner"><Link className="brand" to="/"><span className="brand-mark">g.</span><span>gather<span className="brand-amp">&</span>thyme</span></Link><span>Made for the love of good food.</span><span>Recipes powered by <a href="https://www.themealdb.com/" target="_blank" rel="noreferrer">TheMealDB</a></span></div>
      </footer>
    </>
  )
}
