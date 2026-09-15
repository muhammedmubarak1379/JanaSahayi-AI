import { Navigate } from "react-router"
import { useAuth } from "../context/AuthContext"

function AdminRoute({ children }) {
  const { user, isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return <p>Checking administrator access...</p>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute