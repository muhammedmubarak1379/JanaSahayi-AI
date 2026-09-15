import { useEffect, useState } from "react"
import { Link } from "react-router"
import { getSchemeCatalog } from "../services/api"
import "./SchemesPage.css"

const PAGE_SIZE = 6

function SchemesPage() {
  const [searchInput, setSearchInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [schemes, setSchemes] = useState([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadSchemes() {
      setIsLoading(true)
      setError("")

      try {
        const data = await getSchemeCatalog({
          q: searchQuery,
          limit: PAGE_SIZE,
          offset: (page - 1) * PAGE_SIZE,
        })

        setSchemes(data.items)
        setTotal(data.total)
      } catch {
        setError("Unable to load schemes")
      } finally {
        setIsLoading(false)
      }
    }

    loadSchemes()
  }, [searchQuery, page])

  function handleSearch(event) {
    event.preventDefault()
    setPage(1)
    setSearchQuery(searchInput.trim())
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <main className="schemes-page">
      <h1>Browse support schemes</h1>

      <form onSubmit={handleSearch}>
        <label htmlFor="scheme-search">Search schemes</label>

        <input
          id="scheme-search"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value)
          }}
          placeholder="Try student, housing or employment"
        />

        <button type="submit">Search</button>
      </form>

      {isLoading && <p>Loading schemes...</p>}
      {error && <p>{error}</p>}

      {!isLoading && !error && (
        <>
          <p>{total} scheme(s) found</p>

          {schemes.length === 0 && (
            <p>No schemes matched your search.</p>
          )}

          <div>
            {schemes.map((scheme) => (
              <article key={scheme.id}>
                <p>{scheme.department}</p>
                <h2>{scheme.name}</h2>
                <p>{scheme.description}</p>

                <Link to={`/schemes/${scheme.id}`}>
                  Learn more →
                </Link>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="scheme-pagination" aria-label="Scheme pages">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                ← Previous
              </button>

              <span>
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next →
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  )
}

export default SchemesPage