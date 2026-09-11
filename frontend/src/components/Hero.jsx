import "./Hero.css"

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-label">
          People · Support · Brighter Tomorrows
        </p>

        <h1>
          Find the right support,
          <span> without the confusion.</span>
        </h1>


        <p className="hero-description">
          Discover support schemes, check possible eligibility,
          and ask questions using trusted scheme information.
        </p>

        <div className="hero-actions">
          <a className="primary-action" href="#schemes">
            Explore schemes
          </a>

          <a className="secondary-action" href="#assistant">
            Ask JanaSahayi
          </a>
        </div>

        <div className="trust-points">
          <span>✓ Trusted information</span>
          <span>✓ Simple to use</span>
          <span>✓ Support for every citizen</span>
        </div>
      </div>

      <div className="hero-visual">
        <div className="support-card">
          <p>JanaSahayi helps you</p>

          <ul>
            <li>Discover schemes</li>
            <li>Check possible eligibility</li>
            <li>Get clear answers</li>
            <li>Track applications</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

export default Hero