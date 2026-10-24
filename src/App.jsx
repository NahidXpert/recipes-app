import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import ConnectivityNotice from './components/ConnectivityNotice'
import { FavoritesProvider } from './hooks/useFavorites'
import { ThemeProvider } from './hooks/useTheme'
import Explore from './pages/Explore'
import Favorites from './pages/Favorites'
import Home from './pages/Home'
import RecipeDetails from './pages/RecipeDetails'
import './styles.css'

export default function App() {
  return (
    <FavoritesProvider>
      <ThemeProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ConnectivityNotice />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/recipe/:id" element={<RecipeDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<main className="page-main container not-found"><h1>Page not found</h1><p>Let’s find you something good to cook instead.</p><a className="button button-primary" href="/">Go home</a></main>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </FavoritesProvider>
  )
}
