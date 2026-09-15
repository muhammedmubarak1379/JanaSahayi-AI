import { useEffect, useState } from "react"
import { Link } from "react-router"
import { getMySchemeMatches } from "../services/api"
import "./MatchesPage.css"

function MatchesPage() {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadMatches() {
      try {
        const data = await getMySchemeMatches()
        setMatches(data)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadMatches()
  }, [])

  return (
    <main className="matches-page">
      <div className="matches-heading">
        <p>Citizen dashboard</p>
        <h1>My Possible Matches</h1>
        <span>
          Results based on your profile—not an official eligibility
          decision. The responsible department makes the final decision.
        </span>
      </div>

      {isLoading && (
        <p className="matches-message">Checking schemes...</p>
      )}

      {error && (
        <div className="matches-message matches-error">
          <p>{error}</p>
          <Link to="/profile">View my profile →</Link>
        </div>
      )}

      {!isLoading && !error && matches.length === 0 && (
        <p className="matches-message">
          No schemes with matching rules are available yet.
        </p>
      )}

      {!isLoading && !error && matches.length > 0 && (
        <div className="matches-grid">
          {matches.map((match) => (
            <article className="match-card" key={match.scheme_id}>
              <span
                className={
                  match.possible_match
                    ? "match-badge possible"
                    : "match-badge unlikely"
                }
              >
                {match.possible_match
                  ? "Possible match"
                  : "Does not match current rules"}
              </span>

              <h2>{match.scheme_name}</h2>

              {match.failed_reasons.length > 0 && (
                <ul>
                  {match.failed_reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}

              <Link to={`/schemes/${match.scheme_id}`}>
                View scheme →
              </Link>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

export default MatchesPage