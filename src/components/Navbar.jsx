import { Heart, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'
import { useTheme } from '../hooks/useTheme'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { favorites } = useFavorites()
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'light' ? 'dark' : 'light'
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link className="brand" to="/" onClick={closeMenu}>
          <img className="brand-mark" src="/android-chrome-192x192.png" alt="" aria-hidden="true" />
          <span>gather<span className="brand-amp">&</span>thyme</span>
        </Link>
        <button className="mobile-menu-toggle" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
          {menuOpen ? <X /> : <Menu />}
        </button>
        <div className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
          <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
          <NavLink to="/explore" onClick={closeMenu}>Explore</NavLink>
          <a href="/#categories" onClick={closeMenu}>Categories</a>
          <NavLink to="/favorites" onClick={closeMenu} className="nav-favorites">
            <Heart size={16} /> Favorites{favorites.length > 0 && <span className="favorite-count">{favorites.length}</span>}
          </NavLink>
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={`Switch to ${nextTheme} mode`} aria-pressed={theme === 'dark'}>
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
          </button>
          <Link className="nav-mobile-search" to="/explore" onClick={closeMenu}><Search size={16} /> Search recipes</Link>
        </div>
      </nav>
    </header>
  )
}
