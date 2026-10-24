import { Search } from 'lucide-react'
import { useState } from 'react'

export default function SearchBar({ initialValue = '', onSearch, compact = false }) {
  const [value, setValue] = useState(initialValue)

  function submit(event) {
    event.preventDefault()
    onSearch(value.trim())
  }

  return (
    <form className={`search-form${compact ? ' search-form-compact' : ''}`} onSubmit={submit} role="search">
      <Search size={19} aria-hidden="true" />
      <label className="sr-only" htmlFor={compact ? 'compact-search' : 'recipe-search'}>Search recipes</label>
      <input
        id={compact ? 'compact-search' : 'recipe-search'}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Try “chicken”, “pasta”…"
        type="search"
      />
      {value && <button className="clear-search" type="button" onClick={() => setValue('')} aria-label="Clear search">×</button>}
      <button className="button button-primary search-submit" type="submit">Search</button>
    </form>
  )
}
