import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import { getCurrentUser } from "../services/api"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    async function restoreUser() {
      const token = sessionStorage.getItem("access_token")

      if (!token) {
        setIsAuthLoading(false)
        return
      }

      try {
        const userData = await getCurrentUser(token)
        setUser(userData)
      } catch {
        sessionStorage.removeItem("access_token")
      } finally {
        setIsAuthLoading(false)
      }
    }

    restoreUser()
  }, [])

  async function signIn(token) {
    sessionStorage.setItem("access_token", token)

    const userData = await getCurrentUser(token)
    setUser(userData)
  }

  function signOut() {
    sessionStorage.removeItem("access_token")
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}