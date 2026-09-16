import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import "./AdminDocumentsPage.css"
import {
  deactivateSchemeDocument,
  getSchemeById,
  getSchemeDocuments,
} from "../services/api"

function AdminDocumentsPage() {
  const { schemeId } = useParams()
  const [scheme, setScheme] = useState(null)
  const [documents, setDocuments] = useState([])
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [deactivatingDocumentId, setDeactivatingDocumentId] =
    useState(null)

  async function handleDeactivate(document) {
    const confirmed = window.confirm(
      `Deactivate "${document.title}"? The AI assistant will stop using this document.`
    )

    if (!confirmed) {
      return
    }

    setError("")
    setSuccessMessage("")
    setDeactivatingDocumentId(document.id)

    try {
      await deactivateSchemeDocument(schemeId, document.id)

      setDocuments((currentDocuments) =>
        currentDocuments.map((currentDocument) =>
          currentDocument.id === document.id
            ? { ...currentDocument, is_active: false }
            : currentDocument
        )
      )

      setSuccessMessage("Document deactivated.")
    } catch (caughtError) {
      setError(caughtError.message)
    } finally {
      setDeactivatingDocumentId(null)
    }
  }

  useEffect(() => {
    async function loadDocuments() {
      try {
        const schemeData = await getSchemeById(schemeId)

        if (!schemeData) {
          setError("Scheme not found.")
          return
        }

        const documentData = await getSchemeDocuments(schemeId)

        setScheme(schemeData)
        setDocuments(documentData)
      } catch {
        setError("Unable to load scheme documents.")
      } finally {
        setIsLoading(false)
      }
    }

    loadDocuments()
  }, [schemeId])

  return (
   <main className="admin-documents-page">

      {isLoading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}
      {successMessage && (
        <p role="status">{successMessage}</p>
      )}

      {!isLoading && scheme && (
        <>
          <h2>{scheme.name}</h2>

          <Link
            to={`/admin/schemes/${schemeId}/documents/new`}
          >
            Add a document
          </Link>

          {documents.length === 0 && (
            <p>No documents have been added yet.</p>
          )}

          {documents.map((document) => (
            <article key={document.id}>
              <h3>{document.title}</h3>
              <p>
                Document #{document.id} ·{" "}
                {document.is_active ? "Active" : "Inactive"} ·{" "}
                {document.chunk_count} searchable chunk(s)
              </p>

              {document.source_url ? (
                <a
                  href={document.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View source URL
                </a>
              ) : (
                <p>No source URL provided.</p>
              )}

              {document.is_active && (
                <button
                  type="button"
                  onClick={() => handleDeactivate(document)}
                  disabled={
                    deactivatingDocumentId === document.id
                  }
                >
                  {deactivatingDocumentId === document.id
                    ? "Deactivating..."
                    : "Deactivate document"}
                </button>
              )}
            </article>
          ))}
        </>
      )}
    </main>
  )
}

export default AdminDocumentsPage