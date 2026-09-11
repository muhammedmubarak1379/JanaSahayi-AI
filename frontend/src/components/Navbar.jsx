import "./Navbar.css"

function Navbar() {
  return (
    <header className="navbar">
      <a className="brand" href="/">
        <span className="brand-mark">J</span>
        <span>JanaSahayi AI</span>
      </a>

      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="#schemes">Schemes</a>
        <a href="#assistant">AI Assistant</a>
        <a href="#applications">My Applications</a>
      </nav>

      <div className="nav-actions">
        <button className="login-button">Log in</button>
        <button className="account-button">Create account</button>
      </div>
    </header>
  )
}

export default Navbar
