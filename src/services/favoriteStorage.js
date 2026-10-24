const DATABASE_NAME = 'gather-thyme'
const STORE_NAME = 'favorites'
const DATABASE_VERSION = 1

function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE_NAME, DATABASE_VERSION)

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'idMeal' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error ?? new Error('Could not open the offline recipe store.'))
    request.onblocked = () => reject(new Error('The offline recipe store is blocked by another open tab.'))
  })
}

async function runTransaction(mode, operation) {
  const database = await openDatabase()

  try {
    return await new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode)
      const request = operation(transaction.objectStore(STORE_NAME))
      let result

      request.onsuccess = () => { result = request.result }
      request.onerror = () => reject(request.error ?? new Error('Could not update the offline recipe store.'))
      transaction.oncomplete = () => resolve(result)
      transaction.onerror = () => reject(transaction.error ?? new Error('Could not update the offline recipe store.'))
      transaction.onabort = () => reject(transaction.error ?? new Error('The offline recipe update was cancelled.'))
    })
  } finally {
    database.close()
  }
}

export function getSavedRecipes() {
  return runTransaction('readonly', (store) => store.getAll())
}

export function getSavedRecipe(id) {
  return runTransaction('readonly', (store) => store.get(id))
}

export function saveRecipe(meal) {
  return runTransaction('readwrite', (store) => store.put(meal))
}

export function deleteSavedRecipe(id) {
  return runTransaction('readwrite', (store) => store.delete(id))
}
