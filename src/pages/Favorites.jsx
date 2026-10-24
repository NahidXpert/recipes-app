import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '../components/Feedback'
import { Loading } from '../components/Feedback'
import RecipeGrid from '../components/RecipeGrid'
import { useFavorites } from '../hooks/useFavorites'

export default function Favorites() {
  const { favorites, ready } = useFavorites()
  return (
    <main className="page-main container favorites-page">
      <section className="page-hero page-hero-simple">
        <span className="eyebrow"><Heart size={14} /> YOUR PERSONAL RECIPE BOX</span>
        <h1>Saved with love.</h1>
        <p>All the good things you want to make, gathered in one place.</p>
      </section>
      {!ready ? <Loading label="Opening your saved recipes…" /> : favorites.length ? <RecipeGrid meals={favorites} /> : (
        <EmptyState title="Nothing saved just yet" description="When a recipe catches your eye, tap the heart and it’ll be here waiting.">
          <Link className="button button-primary" to="/explore">Explore recipes</Link>
        </EmptyState>
      )}
    </main>
  )
}
