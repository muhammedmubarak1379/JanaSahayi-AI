import { Route, Routes } from "react-router"
import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import SchemeDetailsPage from "./pages/SchemeDetailsPage"
import ApplicationsPage from "./pages/ApplicationsPage"
import SchemesPage from "./pages/SchemesPage"

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/schemes" element={<SchemesPage />} />
        <Route
          path="/schemes/:schemeId"
          element={<SchemeDetailsPage />}
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <ApplicationsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App