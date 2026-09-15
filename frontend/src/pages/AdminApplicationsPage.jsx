import { useEffect, useState } from "react"
import {
  getAllApplications,
  updateApplicationStatus,
} from "../services/api"
import "./AdminApplicationsPage.css"

function AdminApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [error, setError] = useState("")
  const [updateError, setUpdateError] = useState("")

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getAllApplications()
        setApplications(data)
      } catch {
        setError("Unable to load applications")
      } finally {
        setIsLoading(false)
      }
    }

    loadApplications()
  }, [])

  async function handleStatusChange(applicationId, newStatus) {
    const confirmed = window.confirm(
      `Change application #${applicationId} to ${newStatus}?`
    )

    if (!confirmed) {
      return
    }

    setUpdatingId(applicationId)
    setUpdateError("")

    try {
      const updated = await updateApplicationStatus(
        applicationId,
        newStatus
      )

      setApplications((current) =>
        current.map((application) =>
          application.id === updated.id
            ? updated
            : application
        )
      )
    } catch (requestError) {
      setUpdateError(requestError.message)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <main className="admin-applications-page">
      <div className="admin-heading">
        <p>Administrator dashboard</p>
        <h1>Review Applications</h1>
        <span>
          Review submitted scheme applications and update their
          status.
        </span>
      </div>

      {isLoading && (
        <p className="admin-message">
          Loading applications...
        </p>
      )}

      {error && (
        <p className="admin-message admin-error">
          {error}
        </p>
      )}

      {updateError && (
        <p className="admin-message admin-error">
          {updateError}
        </p>
      )}

      {!isLoading && !error && applications.length === 0 && (
        <p className="admin-message">
          No applications to review yet.
        </p>
      )}

      {!isLoading && !error && applications.map((application) => (
        <article
          className="admin-application-card"
          key={application.id}
        >
          <div className="admin-card-heading">
            <h2>Application #{application.id}</h2>

            <span className={`admin-status ${application.status}`}>
              {application.status}
            </span>
          </div>

          <p>Citizen ID: {application.user_id}</p>
          <p>Scheme ID: {application.scheme_id}</p>

          <div className="admin-card-actions">
            <button
              type="button"
              disabled={
                updatingId !== null ||
                application.status === "approved"
              }
              onClick={() =>
                handleStatusChange(application.id, "approved")
              }
            >
              {updatingId === application.id
                ? "Updating..."
                : "Approve"}
            </button>

            <button
              className="reject-button"
              type="button"
              disabled={
                updatingId !== null ||
                application.status === "rejected"
              }
              onClick={() =>
                handleStatusChange(application.id, "rejected")
              }
            >
              Reject
            </button>
          </div>
        </article>
      ))}
    </main>
  )
}

export default AdminApplicationsPage