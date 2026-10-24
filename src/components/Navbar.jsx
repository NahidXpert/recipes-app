import { Heart, Menu, Search, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useFavorites } from '../hooks/useFavorites'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { favorites } = useFavorites()
  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Main navigation">
        <Link className="brand" to="/" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">g.</span>
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
          <Link className="nav-mobile-search" to="/explore" onClick={closeMenu}><Search size={16} /> Search recipes</Link>
        </div>
      </nav>
    </header>
  )
}
