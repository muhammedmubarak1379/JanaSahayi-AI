import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

function ProtectedRoute({ children }) {
  const { user, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <p className="profile-message">
        Checking your account...
      </p>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute