import { useEffect, useState } from "react"
import { Link } from "react-router"
import { getSchemes } from "../services/api"
import "./SchemesSection.css"

function SchemesSection() {
  const [schemes, setSchemes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadSchemes() {
      try {
        const data = await getSchemes()
        setSchemes(data.items)
      } catch {
        setError("Unable to load schemes")
      } finally {
        setIsLoading(false)
      }
    }

    loadSchemes()
  }, [])

  return (
    <section className="schemes-section" id="schemes">
      <div className="section-heading">
        <div>
          <p className="section-label">
            Opportunities for you
          </p>

          <h2>Support schemes</h2>
        </div>

        <button className="view-all-button">
          View all schemes →
        </button>
      </div>

      {isLoading && (
        <p className="section-message">
          Loading schemes...
        </p>
      )}

      {error && (
        <p className="section-message error-message">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className="scheme-grid">
          {schemes.map((scheme) => (
            <article
              className="scheme-card"
              key={scheme.id}
            >
              <p className="department">
                {scheme.department}
              </p>

              <h3>{scheme.name}</h3>

              <p className="scheme-description">
                {scheme.description}
              </p>

              <Link
                className="learn-more-button"
                to={`/schemes/${scheme.id}`}
              >
                Learn more →
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default SchemesSection