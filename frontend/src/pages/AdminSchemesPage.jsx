import { useEffect, useState } from "react"
import { Link } from "react-router"
import {
  createScheme,
  deactivateScheme,
  getAdminSchemes,
  updateScheme,
} from "../services/api"
import "./AdminSchemesPage.css"

const emptyForm = {
  name: "",
  department: "",
  description: "",
  eligibility: "",
}

function AdminSchemesPage() {
  const [schemes, setSchemes] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingSchemeId, setEditingSchemeId] = useState(null)
  const [deactivatingSchemeId, setDeactivatingSchemeId] =
    useState(null)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  function handleStartEditing(scheme) {
    setEditingSchemeId(scheme.id)
    setFormData({
      name: scheme.name,
      department: scheme.department,
      description: scheme.description,
      eligibility: scheme.eligibility ?? "",
    })
    setError("")
    setSuccessMessage("")
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  function handleCancelEditing() {
    setEditingSchemeId(null)
    setFormData(emptyForm)
    setError("")
  }

  async function handleSubmitScheme(event) {
    event.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsSubmitting(true)

    try {
      if (editingSchemeId !== null) {
        const updatedScheme = await updateScheme(
          editingSchemeId,
          formData
        )

        setSchemes((currentSchemes) =>
          currentSchemes.map((scheme) =>
            scheme.id === updatedScheme.id
              ? updatedScheme
              : scheme
          )
        )
        setSuccessMessage("Scheme updated successfully.")
      } else {
        const newScheme = await createScheme(formData)

        setSchemes((currentSchemes) => [
          ...currentSchemes,
          newScheme,
        ])
        setSuccessMessage("Scheme created successfully.")
      }

      setEditingSchemeId(null)
      setFormData(emptyForm)
    } catch (caughtError) {
      setError(caughtError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDeactivateScheme(scheme) {
    const confirmed = window.confirm(
      `Deactivate "${scheme.name}"? Citizens will no longer see or apply for this scheme.`
    )

    if (!confirmed) {
      return
    }

    setError("")
    setSuccessMessage("")
    setDeactivatingSchemeId(scheme.id)

    try {
      await deactivateScheme(scheme.id)

      setSchemes((currentSchemes) =>
        currentSchemes.filter(
          (currentScheme) => currentScheme.id !== scheme.id
        )
      )

      if (editingSchemeId === scheme.id) {
        setEditingSchemeId(null)
        setFormData(emptyForm)
      }

      setSuccessMessage("Scheme deactivated.")
    } catch (caughtError) {
      setError(caughtError.message)
    } finally {
      setDeactivatingSchemeId(null)
    }
  }

  useEffect(() => {
    async function loadSchemes() {
      try {
        const data = await getAdminSchemes()
        setSchemes(data.items)
      } catch {
        setError("Unable to load schemes.")
      }
    }

    loadSchemes()
  }, [])

  return (
    <main className="admin-schemes-page">
      <h1>Manage schemes</h1>
      <p>Create a scheme or review existing schemes.</p>

      <section className="admin-scheme-form">
        <h2>
          {editingSchemeId !== null
            ? `Edit scheme #${editingSchemeId}`
            : "Create a scheme"}
        </h2>

        <form onSubmit={handleSubmitScheme}>
          <label htmlFor="scheme-name">Scheme name</label>
          <input
            id="scheme-name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="scheme-department">
            Department
          </label>
          <input
            id="scheme-department"
            name="department"
            value={formData.department}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="scheme-description">
            Description
          </label>
          <textarea
            id="scheme-description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />

          <label htmlFor="scheme-eligibility">
            Eligibility information
          </label>
          <textarea
            id="scheme-eligibility"
            name="eligibility"
            value={formData.eligibility}
            onChange={handleInputChange}
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : editingSchemeId !== null
                ? "Save changes"
                : "Create scheme"}
          </button>

          {editingSchemeId !== null && (
            <button
              type="button"
              onClick={handleCancelEditing}
              disabled={isSubmitting}
            >
              Cancel editing
            </button>
          )}
        </form>
      </section>

      {error && <p role="alert">{error}</p>}
      {successMessage && (
        <p role="status">{successMessage}</p>
      )}

      {schemes.map((scheme) => (
        <div key={scheme.id}>
          <h2>{scheme.name}</h2>
          <p>{scheme.department}</p>

          <Link
            to={`/admin/schemes/${scheme.id}/eligibility`}
          >
            Manage eligibility rule
          </Link>

          <Link to={`/admin/schemes/${scheme.id}/documents`}>
            Manage documents
          </Link>

          <button
            type="button"
            onClick={() => handleStartEditing(scheme)}
          >
            Edit scheme
          </button>

          <button
            className="deactivate-button"
            type="button"
            onClick={() => handleDeactivateScheme(scheme)}
            disabled={deactivatingSchemeId === scheme.id}
          >
            {deactivatingSchemeId === scheme.id
              ? "Deactivating..."
              : "Deactivate scheme"}
          </button>
        </div>
      ))}
    </main>
  )
}

export default AdminSchemesPage