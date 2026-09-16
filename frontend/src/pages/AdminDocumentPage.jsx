import { useEffect, useState } from "react"
import { useParams } from "react-router"
import "./AdminDocumentPage.css"
import {
  createSchemeDocument,
  getSchemeById,
} from "../services/api"

const emptyForm = {
  title: "",
  source_url: "",
  content: "",
}

function AdminDocumentPage() {
  const { schemeId } = useParams()
  const [scheme, setScheme] = useState(null)
  const [formData, setFormData] = useState(emptyForm)
  const [createdDocument, setCreatedDocument] =
    useState(null)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmitDocument(event) {
    event.preventDefault()
    setError("")
    setCreatedDocument(null)

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content cannot be empty.")
      return
    }

    setIsSubmitting(true)

    try {
      const documentData = {
        title: formData.title.trim(),
        source_url: formData.source_url.trim() || null,
        content: formData.content.trim(),
      }

      const savedDocument = await createSchemeDocument(
        schemeId,
        documentData
      )

      setCreatedDocument(savedDocument)
      setFormData(emptyForm)
    } catch (caughtError) {
      setError(caughtError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    async function loadScheme() {
      try {
        const schemeData = await getSchemeById(schemeId)

        if (!schemeData) {
          setError("Scheme not found.")
          return
        }

        setScheme(schemeData)
      } catch {
        setError("Unable to load scheme.")
      }
    }

    loadScheme()
  }, [schemeId])

  return (
    <main className="admin-document-page">

      {error && <p role="alert">{error}</p>}

      {scheme && (
        <>
          <h2>{scheme.name}</h2>
          <p>
            Add text that the AI assistant may use to
            answer questions about this scheme.
          </p>
          <p>
            Label fictional demo content clearly.
            Do not present a demo URL as an official source.
          </p>

          <form onSubmit={handleSubmitDocument}>
            <label htmlFor="document-title">Title</label>
            <input
              id="document-title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="document-url">
              Source URL (optional)
            </label>
            <input
              id="document-url"
              name="source_url"
              type="url"
              value={formData.source_url}
              onChange={handleInputChange}
            />

            <label htmlFor="document-content">
              Document content
            </label>
            <textarea
              id="document-content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Processing document..."
                : "Add document"}
            </button>
          </form>

          {createdDocument && (
            <p role="status">
              Document #{createdDocument.id} added with{" "}
              {createdDocument.chunk_count} searchable
              chunk(s).
            </p>
          )}
        </>
      )}
    </main>
  )
}

export default AdminDocumentPage