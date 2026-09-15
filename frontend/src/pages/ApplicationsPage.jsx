import { useEffect, useState } from "react"
import { Link } from "react-router"
import { getMyApplicationsWithSchemes } from "../services/api"
import "./ApplicationsPage.css"

function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadApplications() {
      try {
        const data = await getMyApplicationsWithSchemes()
        setApplications(data)
      } catch {
        setError("Unable to load your applications")
      } finally {
        setIsLoading(false)
      }
    }

    loadApplications()
  }, [])

  return (
    <main className="applications-page">
      <div className="applications-heading">
        <p>Citizen dashboard</p>
        <h1>My Applications</h1>
        <span>Track the schemes you have applied for.</span>
      </div>

      {isLoading && (
        <p className="applications-message">
          Loading applications...
        </p>
      )}

      {error && (
        <p className="applications-message applications-error">
          {error}
        </p>
      )}

      {!isLoading && !error && applications.length === 0 && (
        <section className="applications-empty">
          <h2>No applications yet</h2>
          <p>Explore schemes to find support that may suit you.</p>
          <Link to="/#schemes">Explore schemes →</Link>
        </section>
      )}

      {!isLoading && !error && applications.length > 0 && (
        <div className="applications-grid">
          {applications.map((application) => (
            <article className="application-card" key={application.id}>
              <div className="application-card-header">
                <span>Application #{application.id}</span>
                <span className={`status-badge ${application.status}`}>
                  {application.status}
                </span>
              </div>

              <h2><h2>{application.scheme_name}</h2></h2>

              <p>
                Submitted on{" "}
                {new Date(
                  application.created_at
                ).toLocaleDateString()}
              </p>

              <Link to={`/schemes/${application.scheme_id}`}>
                View scheme →
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default ApplicationsPage