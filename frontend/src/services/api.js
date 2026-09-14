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
export async function askKnowledgeQuestion(question) {
  const response = await fetch(
    `${API_BASE_URL}/knowledge/ask`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
      }),
    }
  )

  if (!response.ok) {
    throw new Error("Unable to get an answer")
  }

  return response.json()
}
export async function loginUser(email, password) {
  const formData = new URLSearchParams()

  formData.append("username", email)
  formData.append("password", password)

  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    }
  )

  if (!response.ok) {
    throw new Error("Incorrect email or password")
  }

  return response.json()
}
export async function registerUser(email, password) {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      errorData.detail ||
      "Unable to create account"
    )
  }

  return response.json()
}