import { useEffect, useState } from "react"
import {
  createMyProfile,
  getMyProfile,
  updateMyProfile,
} from "../services/api"
import "./ProfilePage.css"

const emptyProfile = {
  full_name: "",
  date_of_birth: "",
  district: "",
  occupation: "",
  annual_income: "",
}

function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [formData, setFormData] = useState(emptyProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [formError, setFormError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const profileData = await getMyProfile()

        if (profileData) {
          setProfile(profileData)

          setFormData({
            full_name: profileData.full_name,
            date_of_birth: profileData.date_of_birth,
            district: profileData.district,
            occupation: profileData.occupation,
            annual_income: profileData.annual_income,
          })
        } else {
          setIsEditing(true)
        }
      } catch {
        setLoadError("Unable to load your profile")
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsSaving(true)
    setFormError("")
    setSuccess("")

    try {
      const savedProfile = profile
        ? await updateMyProfile(formData)
        : await createMyProfile(formData)

      setProfile(savedProfile)
      setIsEditing(false)
      setSuccess("Profile saved successfully")
    } catch (requestError) {
      setFormError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="profile-page">
        <p className="profile-message">
          Loading your profile...
        </p>
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="profile-page">
        <p className="profile-message profile-error">
          {loadError}
        </p>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <div className="profile-heading">
        <p>Citizen profile</p>
        <h1>Your personal information</h1>
        <span>
          JanaSahayi uses this information to check possible
          scheme eligibility.
        </span>
      </div>

      {success && (
        <p className="profile-success">{success}</p>
      )}

      {!isEditing && profile && (
        <>
          <section className="profile-card">
            <div>
              <span>Full name</span>
              <strong>{profile.full_name}</strong>
            </div>

            <div>
              <span>Date of birth</span>
              <strong>{profile.date_of_birth}</strong>
            </div>

            <div>
              <span>District</span>
              <strong>{profile.district}</strong>
            </div>

            <div>
              <span>Occupation</span>
              <strong>{profile.occupation}</strong>
            </div>

            <div>
              <span>Annual income</span>
              <strong>₹{profile.annual_income}</strong>
            </div>
          </section>

          <button
            className="edit-profile-button"
            type="button"
            onClick={() => {
              setIsEditing(true)
              setSuccess("")
            }}
          >
            Edit profile
          </button>
        </>
      )}

      {isEditing && (
        <form
          className="profile-form"
          onSubmit={handleSubmit}
        >
          <div className="form-field">
            <label htmlFor="full-name">Full name</label>
            <input
              id="full-name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="date-of-birth">
              Date of birth
            </label>
            <input
              id="date-of-birth"
              name="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="district">District</label>
            <input
              id="district"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="occupation">Occupation</label>
            <input
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="annual-income">
              Annual income
            </label>
            <input
              id="annual-income"
              name="annual_income"
              type="number"
              min="0"
              step="0.01"
              value={formData.annual_income}
              onChange={handleChange}
              required
            />
          </div>

          {formError && (
            <p className="profile-form-error">
              {formError}
            </p>
          )}

          <div className="profile-form-actions">
            <button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save profile"}
            </button>

            {profile && (
              <button
                className="cancel-button"
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormError("")
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </main>
  )
}

export default ProfilePage