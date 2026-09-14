import { Link } from "react-router"
import "./Navbar.css"

function Navbar() {
  return (
    <header className="navbar">
      <Link className="brand" to="/">
        <span className="brand-mark">J</span>
        <span>JanaSahayi AI</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <a href="/#schemes">Schemes</a>
        <a href="/#assistant">AI Assistant</a>
        <a href="/#applications">My Applications</a>
      </nav>

      <div className="nav-actions">
        <Link className="login-button" to="/login">
          Log in
        </Link>

        <Link className="account-button" to="/register">
          Create account
        </Link>
      </div>
    </header>
  )
}

export default Navbar