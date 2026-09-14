import { useState } from "react"
import { askKnowledgeQuestion } from "../services/api"
import "./AIAssistant.css"

function AIAssistant() {
  const [question, setQuestion] = useState("")
  const [response, setResponse] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    const cleanQuestion = question.trim()

    if (!cleanQuestion) {
      setError("Please enter a question")
      return
    }

    setIsLoading(true)
    setError("")
    setResponse(null)

    try {
      const data = await askKnowledgeQuestion(cleanQuestion)
      setResponse(data)
    } catch {
      setError(
        "The AI assistant is unavailable. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="assistant-section" id="assistant">
      <div className="assistant-introduction">
        <p className="assistant-label">JanaSahayi AI</p>

        <h2>Ask about support schemes</h2>

        <p>
          Ask a question in simple language and receive an answer
          based on the available scheme documents.
        </p>
      </div>

      <div className="assistant-panel">
        <form onSubmit={handleSubmit}>
          <label htmlFor="citizen-question">
            What would you like to know?
          </label>

          <textarea
            id="citizen-question"
            value={question}
            onChange={(event) => {
              setQuestion(event.target.value)
            }}
            placeholder="For example: What documents are required for student support?"
            rows="5"
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Finding an answer..." : "Ask JanaSahayi"}
          </button>
        </form>

        {error && (
          <p className="assistant-error">{error}</p>
        )}

        {response && (
          <div className="answer-card">
            <p className="answer-label">Answer</p>
            <p className="answer-text">{response.answer}</p>

            {response.sources.length > 0 && (
              <div className="answer-sources">
                <p>Source</p>

                {response.sources.map((source) => (
                  <div
                    className="source-item"
                    key={`${source.scheme_name}-${source.source_url}`}
                  >
                    <span>{source.scheme_name}</span>

                    {source.source_url && (
                      <a
                        href={source.source_url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View source
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default AIAssistant