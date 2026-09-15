import { Route, Routes } from "react-router"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import SchemeDetailsPage from "./pages/SchemeDetailsPage"
import SchemesPage from "./pages/SchemesPage"
import ApplicationsPage from "./pages/ApplicationsPage"
import MatchesPage from "./pages/MatchesPage"
import AdminApplicationsPage from "./pages/AdminApplicationsPage"

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
          path="/matches"
          element={
            <ProtectedRoute>
              <MatchesPage />
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

        <Route
          path="/admin/applications"
          element={
            <AdminRoute>
              <AdminApplicationsPage />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App