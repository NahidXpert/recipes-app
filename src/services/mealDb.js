const API_BASE = 'https://www.themealdb.com/api/json/v1/1'

async function request(endpoint, params = {}) {
  const url = new URL(`${API_BASE}/${endpoint}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }

  let response
  try {
    response = await fetch(url)
  } catch (error) {
    throw new Error('Unable to connect. Check your internet connection and try again.', { cause: error })
  }

  if (!response.ok) {
    throw new Error(`Recipe service responded with ${response.status}. Please try again.`)
  }

  try {
    return await response.json()
  } catch (error) {
    throw new Error('The recipe service returned an invalid response.', { cause: error })
  }
}

function getMeals(data) {
  if (!data || typeof data !== 'object') {
    throw new Error('The recipe service returned an unexpected response.')
  }
  if (data.meals === null) return []
  if (!Array.isArray(data.meals)) {
    throw new Error('The recipe service returned an unexpected response.')
  }
  return data.meals
}

export async function searchMeals(name) {
  return getMeals(await request('search.php', { s: name.trim() }))
}

export async function getMeal(id) {
  return (await getMeals(await request('lookup.php', { i: id })))[0] ?? null
}

export async function getRandomMeal() {
  return (await getMeals(await request('random.php')))[0] ?? null
}

export async function getCategories() {
  const data = await request('categories.php')
  if (!data || !Array.isArray(data.categories)) {
    throw new Error('The recipe service returned an unexpected category list.')
  }
  return data.categories
}

export async function getAreas() {
  const data = await request('list.php', { a: 'list' })
  if (!Array.isArray(data.meals)) {
    throw new Error('The recipe service returned an unexpected cuisine list.')
  }
  return [...new Set(data.meals.map(({ strArea }) => strArea).filter(Boolean))]
}

export async function getIngredients() {
  const data = await request('list.php', { i: 'list' })
  if (!Array.isArray(data.meals)) {
    throw new Error('The recipe service returned an unexpected ingredient list.')
  }
  return [...new Set(data.meals.map(({ strIngredient }) => strIngredient).filter(Boolean))]
}

export async function filterMeals(filterType, value) {
  const supportedFilters = ['c', 'a', 'i']
  if (!supportedFilters.includes(filterType)) {
    throw new Error('Unsupported recipe filter.')
  }
  return getMeals(await request('filter.php', { [filterType]: value }))
}
