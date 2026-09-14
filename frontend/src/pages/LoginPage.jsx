import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import { loginUser } from "../services/api"
import "./AuthPage.css"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { signIn } = useAuth()

  async function handleSubmit(event) {
    event.preventDefault()

    setIsLoading(true)
    setError("")

    try {
      const data = await loginUser(
        email.trim().toLowerCase(),
        password
      )

      await signIn(data.access_token)

      navigate("/")
    } catch {
      setError("Incorrect email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-heading">
          <p>Welcome back</p>
          <h1>Log in to JanaSahayi</h1>
          <span>
            Access your profile, scheme matches and applications.
          </span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Email address</label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value)
              }}
              placeholder="citizen@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="login-password">Password</label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
              }}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="auth-error">{error}</p>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account?{" "}
          <Link to="/register">Create account</Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage