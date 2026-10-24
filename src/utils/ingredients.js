export function getIngredients(meal) {
  return Array.from({ length: 20 }, (_, index) => {
    const number = index + 1
    const name = meal[`strIngredient${number}`]?.trim()
    const measure = meal[`strMeasure${number}`]?.trim()
    return name ? { name, measure } : null
  }).filter(Boolean)
}

export function getInstructions(meal) {
  return (meal.strInstructions ?? '')
    .split(/\r?\n/)
    .map((instruction) => instruction.trim())
    .filter(Boolean)
}
