export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (err) {
    console.error(`Failed to save ${key} to localStorage:`, err)
  }
}

export function getFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (err) {
    console.error(`Failed to get ${key} from localStorage:`, err)
    return defaultValue
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.error(`Failed to remove ${key} from localStorage:`, err)
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.clear()
  } catch (err) {
    console.error('Failed to clear localStorage:', err)
  }
}
