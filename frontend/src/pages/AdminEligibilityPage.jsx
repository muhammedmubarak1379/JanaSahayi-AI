import { useEffect, useState } from "react"
import { useParams } from "react-router"
import {
  createEligibilityRule,
  getEligibilityRule,
  getSchemeById,
  updateEligibilityRule,
} from "../services/api"
import "./AdminEligibilityPage.css"

const emptyRuleForm = {
  minimum_age: "",
  maximum_age: "",
  maximum_annual_income: "",
  required_district: "",
  required_occupation: "",
}

function AdminEligibilityPage() {
  const { schemeId } = useParams()
  const [scheme, setScheme] = useState(null)
  const [rule, setRule] = useState(null)
  const [formData, setFormData] = useState(emptyRuleForm)
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSaveRule(event) {
    event.preventDefault()
    setError("")
    setSuccessMessage("")

    const minimumAge =
      formData.minimum_age === ""
        ? null
        : Number(formData.minimum_age)

    const maximumAge =
      formData.maximum_age === ""
        ? null
        : Number(formData.maximum_age)

    if (
      minimumAge !== null &&
      maximumAge !== null &&
      minimumAge > maximumAge
    ) {
      setError(
        "Minimum age cannot be greater than maximum age."
      )
      return
    }

    const ruleData = {
      minimum_age: minimumAge,
      maximum_age: maximumAge,
      maximum_annual_income:
        formData.maximum_annual_income === ""
          ? null
          : formData.maximum_annual_income,
      required_district:
        formData.required_district.trim() || null,
      required_occupation:
        formData.required_occupation.trim() || null,
    }

    setIsSaving(true)

    try {
      const savedRule = rule
        ? await updateEligibilityRule(schemeId, ruleData)
        : await createEligibilityRule(schemeId, ruleData)

      setRule(savedRule)
      setSuccessMessage(
        rule
          ? "Eligibility rule updated."
          : "Eligibility rule created."
      )
    } catch (caughtError) {
      setError(caughtError.message)
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    async function loadSchemeAndRule() {
      try {
        const schemeData = await getSchemeById(schemeId)

        if (!schemeData) {
          setError("Scheme not found.")
          return
        }

        const ruleData = await getEligibilityRule(schemeId)

        setScheme(schemeData)
        setRule(ruleData)

        if (ruleData) {
          setFormData({
            minimum_age: String(ruleData.minimum_age ?? ""),
            maximum_age: String(ruleData.maximum_age ?? ""),
            maximum_annual_income: String(
              ruleData.maximum_annual_income ?? ""
            ),
            required_district:
              ruleData.required_district ?? "",
            required_occupation:
              ruleData.required_occupation ?? "",
          })
        }
      } catch {
        setError("Unable to load eligibility information.")
      } finally {
        setIsLoading(false)
      }
    }

    loadSchemeAndRule()
  }, [schemeId])

  return (
    <main className="admin-eligibility-page">
      <h1>Eligibility rule</h1>

      {isLoading && <p>Loading...</p>}
      {error && <p role="alert">{error}</p>}

      {!isLoading && scheme && (
        <>
          <h2>{scheme.name}</h2>
          <p>
            {rule
              ? "Edit this scheme's existing rule."
              : "Add a rule for this scheme."}
          </p>
          <p>
            Leave a field blank if that restriction does
            not apply.
          </p>

          <form onSubmit={handleSaveRule}>
            <label htmlFor="minimum-age">Minimum age</label>
            <input
              id="minimum-age"
              name="minimum_age"
              type="number"
              min="0"
              max="100"
              step="1"
              value={formData.minimum_age}
              onChange={handleInputChange}
            />

            <label htmlFor="maximum-age">Maximum age</label>
            <input
              id="maximum-age"
              name="maximum_age"
              type="number"
              min="0"
              max="100"
              step="1"
              value={formData.maximum_age}
              onChange={handleInputChange}
            />

            <label htmlFor="maximum-income">
              Maximum annual income
            </label>
            <input
              id="maximum-income"
              name="maximum_annual_income"
              type="number"
              min="0"
              step="0.01"
              value={formData.maximum_annual_income}
              onChange={handleInputChange}
            />

            <label htmlFor="required-district">
              Required district
            </label>
            <input
              id="required-district"
              name="required_district"
              value={formData.required_district}
              onChange={handleInputChange}
            />

            <label htmlFor="required-occupation">
              Required occupation
            </label>
            <input
              id="required-occupation"
              name="required_occupation"
              value={formData.required_occupation}
              onChange={handleInputChange}
            />

            <button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : rule
                  ? "Save changes"
                  : "Create rule"}
            </button>
          </form>

          {successMessage && (
            <p role="status">{successMessage}</p>
          )}
        </>
      )}
    </main>
  )
}

export default AdminEligibilityPage