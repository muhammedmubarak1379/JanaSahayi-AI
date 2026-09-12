const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function getSchemes() {
  const response = await fetch(
    `${API_BASE_URL}/schemes?limit=6&offset=0`
  )

  if (!response.ok) {
    throw new Error("Unable to load schemes")
  }

  return response.json()
}