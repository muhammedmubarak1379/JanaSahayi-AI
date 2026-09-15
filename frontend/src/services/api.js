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
export async function getCurrentUser(token) {
  const response = await fetch(
    `${API_BASE_URL}/auth/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Unable to load current user")
  }

  return response.json()
}
export async function getMyProfile() {
  const token = sessionStorage.getItem("access_token")

  const response = await fetch(
    `${API_BASE_URL}/profile/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error("Unable to load profile")
  }

  return response.json()
}

export async function createMyProfile(profileData) {
  const token = sessionStorage.getItem("access_token")

  const response = await fetch(
    `${API_BASE_URL}/profile/me`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      errorData.detail ||
      "Unable to create profile"
    )
  }

  return response.json()
}

export async function updateMyProfile(profileData) {
  const token = sessionStorage.getItem("access_token")

  const response = await fetch(
    `${API_BASE_URL}/profile/me`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      errorData.detail ||
      "Unable to update profile"
    )
  }

  return response.json()
}

export async function getSchemeById(schemeId) {
  const response = await fetch(
    `${API_BASE_URL}/schemes/${schemeId}`
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error("Unable to load scheme")
  }

  return response.json()
}

export async function getEligibilityRule(schemeId) {
  const response = await fetch(
    `${API_BASE_URL}/schemes/${schemeId}/eligibility-rule`
  )

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error("Unable to load eligibility rules")
  }

  return response.json()
}

export async function checkMyEligibility(schemeId) {
  const token = sessionStorage.getItem("access_token")

  const response = await fetch(
    `${API_BASE_URL}/matching/schemes/${schemeId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      errorData.detail ||
      "Unable to check eligibility"
    )
  }

  return response.json()
}

export async function applyForScheme(schemeId) {
  const token = sessionStorage.getItem("access_token")

  const response = await fetch(
    `${API_BASE_URL}/applications/schemes/${schemeId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      errorData.detail ||
      "Unable to submit application"
    )
  }

  return response.json()
}

export async function getMyApplications() {
  const token = sessionStorage.getItem("access_token")

  const response = await fetch(
    `${API_BASE_URL}/applications/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Unable to load your applications")
  }

  return response.json()
}
export async function getMyApplicationsWithSchemes() {
  const applications = await getMyApplications()

  return Promise.all(
    applications.map(async (application) => {
      const scheme = await getSchemeById(application.scheme_id)

      return {
        ...application,
        scheme_name: scheme?.name ?? `Scheme #${application.scheme_id}`,
      }
    })
  )
}
export async function getSchemeCatalog({
  q = "",
  limit = 10,
  offset = 0,
} = {}) {
  const parameters = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  })

  if (q.trim()) {
    parameters.set("q", q.trim())
  }

  const response = await fetch(
    `${API_BASE_URL}/schemes?${parameters.toString()}`
  )

  if (!response.ok) {
    throw new Error("Unable to load schemes")
  }

  return response.json()
}
export async function getMySchemeMatches() {
  const token = sessionStorage.getItem("access_token")

  const response = await fetch(
    `${API_BASE_URL}/matching/schemes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      typeof errorData.detail === "string"
        ? errorData.detail
        : "Unable to load scheme matches"
    )
  }

  return response.json()
}
export async function getAllApplications() {
  const token = sessionStorage.getItem("access_token")

  const response = await fetch(
    `${API_BASE_URL}/applications`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    throw new Error("Unable to load applications")
  }

  return response.json()
}
export async function updateApplicationStatus(
  applicationId,
  newStatus
) {
  const token = sessionStorage.getItem("access_token")

  const response = await fetch(
    `${API_BASE_URL}/applications/${applicationId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      typeof errorData.detail === "string"
        ? errorData.detail
        : "Unable to update application status"
    )
  }

  return response.json()
}