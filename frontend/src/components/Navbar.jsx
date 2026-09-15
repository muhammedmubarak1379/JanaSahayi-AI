import { Link, useNavigate } from "react-router"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"

function Navbar() {
  const { user, isAuthLoading, signOut } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    signOut()
    navigate("/")
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">J</span>
        <span>JanaSahayi AI</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/schemes">Schemes</Link>
        <a href="/#assistant">AI Assistant</a>

        {user && (
          <Link to="/profile">My Profile</Link>
        )}

        {user?.role === "citizen" && (
          <>
            <Link to="/matches">Possible Matches</Link>
            <Link to="/applications">My Applications</Link>
          </>
        )}

        {user?.role === "admin" && (
          <Link to="/admin/applications">
            Review Applications
          </Link>
        )}
      </nav>

      <div className="nav-actions">
        {isAuthLoading && (
          <span className="auth-status">
            Checking account...
          </span>
        )}

        {!isAuthLoading && !user && (
          <>
            <Link className="login-button" to="/login">
              Log in
            </Link>

            <Link className="account-button" to="/register">
              Create account
            </Link>
          </>
        )}

        {!isAuthLoading && user && (
          <>
            <span className="user-email">{user.email}</span>

            <button
              className="logout-button"
              type="button"
              onClick={handleLogout}
            >
              Log out
            </button>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar