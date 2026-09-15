import { useEffect, useState } from "react"
import { Link, useParams } from "react-router"
import { useAuth } from "../context/AuthContext"
import {
  applyForScheme,
  checkMyEligibility,
  getEligibilityRule,
  getSchemeById,
} from "../services/api"
import "./SchemeDetailsPage.css"

function SchemeDetailsPage() {
  const { schemeId } = useParams()
  const { user } = useAuth()

  const [scheme, setScheme] = useState(null)
  const [rule, setRule] = useState(null)
  const [eligibilityResult, setEligibilityResult] =
    useState(null)

  const [application, setApplication] = useState(null)

  const [isLoading, setIsLoading] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState("")
  const [checkError, setCheckError] = useState("")
  const [applicationError, setApplicationError] =
    useState("")

  useEffect(() => {
    async function loadSchemeDetails() {
      try {
        const schemeData = await getSchemeById(schemeId)

        if (!schemeData) {
          setNotFound(true)
          return
        }

        setScheme(schemeData)

        const ruleData = await getEligibilityRule(schemeId)
        setRule(ruleData)
      } catch {
        setError("Unable to load scheme details")
      } finally {
        setIsLoading(false)
      }
    }

    loadSchemeDetails()
  }, [schemeId])

  async function handleEligibilityCheck() {
    setIsChecking(true)
    setCheckError("")
    setEligibilityResult(null)

    try {
      const result = await checkMyEligibility(schemeId)
      setEligibilityResult(result)
    } catch (requestError) {
      setCheckError(requestError.message)
    } finally {
      setIsChecking(false)
    }
  }

  async function handleApply() {
    setIsApplying(true)
    setApplicationError("")

    try {
      const applicationData = await applyForScheme(schemeId)
      setApplication(applicationData)
    } catch (requestError) {
      setApplicationError(requestError.message)
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoading) {
    return (
      <main className="scheme-details-page">
        <p className="details-message">
          Loading scheme details...
        </p>
      </main>
    )
  }

  if (notFound) {
    return (
      <main className="scheme-details-page">
        <p className="details-message">
          Scheme not found.
        </p>

        <Link className="back-link" to="/">
          Return to schemes
        </Link>
      </main>
    )
  }

  if (error) {
    return (
      <main className="scheme-details-page">
        <p className="details-message details-error">
          {error}
        </p>
      </main>
    )
  }

  return (
    <main className="scheme-details-page">
      <Link className="back-link" to="/#schemes">
        ← Back to schemes
      </Link>

      <section className="scheme-overview">
        <p className="details-department">
          {scheme.department}
        </p>

        <h1>{scheme.name}</h1>

        <p className="details-description">
          {scheme.description}
        </p>

        {scheme.eligibility && (
          <div className="eligibility-summary">
            <h2>Eligibility information</h2>
            <p>{scheme.eligibility}</p>
          </div>
        )}
      </section>

      <section className="eligibility-rules">
        <h2>Detailed eligibility rules</h2>

        {!rule && (
          <p>
            Detailed eligibility rules are not available for this
            scheme.
          </p>
        )}

        {rule && (
          <div className="rule-grid">
            <div>
              <span>Minimum age</span>
              <strong>
                {rule.minimum_age ?? "No minimum"}
              </strong>
            </div>

            <div>
              <span>Maximum age</span>
              <strong>
                {rule.maximum_age ?? "No maximum"}
              </strong>
            </div>

            <div>
              <span>Maximum annual income</span>
              <strong>
                {rule.maximum_annual_income
                  ? `₹${rule.maximum_annual_income}`
                  : "No income limit"}
              </strong>
            </div>

            <div>
              <span>Required district</span>
              <strong>
                {rule.required_district ?? "Any district"}
              </strong>
            </div>

            <div>
              <span>Required occupation</span>
              <strong>
                {rule.required_occupation ?? "Any occupation"}
              </strong>
            </div>
          </div>
        )}
      </section>

      {rule && (
        <section className="eligibility-check">
          <h2>Check your possible eligibility</h2>

          {!user && (
            <p>
              <Link to="/login">Log in</Link> to check your
              eligibility using your citizen profile.
            </p>
          )}

          {user?.role === "citizen" && (
            <button
              type="button"
              onClick={handleEligibilityCheck}
              disabled={isChecking}
            >
              {isChecking
                ? "Checking eligibility..."
                : "Check my eligibility"}
            </button>
          )}

          {user && user.role !== "citizen" && (
            <p>
              Eligibility checking is available for citizen
              accounts.
            </p>
          )}

          {checkError && (
            <p className="eligibility-check-error">
              {checkError}
            </p>
          )}

          {eligibilityResult && (
            <div
              className={
                eligibilityResult.possible_match
                  ? "eligibility-result eligible"
                  : "eligibility-result not-eligible"
              }
            >
              <h3>
                {eligibilityResult.possible_match
                  ? "You may be eligible"
                  : "You may not be eligible"}
              </h3>

              {eligibilityResult.failed_reasons.length > 0 && (
                <ul>
                  {eligibilityResult.failed_reasons.map(
                    (reason) => (
                      <li key={reason}>{reason}</li>
                    )
                  )}
                </ul>
              )}

              <p>
                This is only a possible match. The responsible
                department makes the final decision.
              </p>
            </div>
          )}

          {user?.role === "citizen" && (
            <div className="application-action">
              <h3>Ready to apply?</h3>

              <p>
                Submit your application to the responsible
                department.
              </p>

              <button
                type="button"
                onClick={handleApply}
                disabled={isApplying || application}
              >
                {isApplying
                  ? "Submitting application..."
                  : application
                    ? "Application submitted"
                    : "Apply for this scheme"}
              </button>

              {application && (
                <p className="application-success">
                  Application submitted successfully. Current
                  status:{" "}
                  <strong>{application.status}</strong>
                </p>
              )}

              {applicationError && (
                <p className="application-error">
                  {applicationError}
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </main>
  )
}

export default SchemeDetailsPage