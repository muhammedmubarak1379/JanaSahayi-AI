import { Route, Routes } from "react-router"

import Navbar from "./components/Navbar"
import ProtectedRoute from "./components/ProtectedRoute"
import AdminRoute from "./components/AdminRoute"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ProfilePage from "./pages/ProfilePage"
import SchemesPage from "./pages/SchemesPage"
import SchemeDetailsPage from "./pages/SchemeDetailsPage"
import ApplicationsPage from "./pages/ApplicationsPage"
import MatchesPage from "./pages/MatchesPage"
import AdminApplicationsPage from "./pages/AdminApplicationsPage"
import AdminSchemesPage from "./pages/AdminSchemesPage"
import AdminEligibilityPage from "./pages/AdminEligibilityPage"
import AdminDocumentPage from "./pages/AdminDocumentPage"
import AdminDocumentsPage from "./pages/AdminDocumentsPage"

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

        <Route
          path="/admin/schemes"
          element={
            <AdminRoute>
              <AdminSchemesPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/schemes/:schemeId/eligibility"
          element={
            <AdminRoute>
              <AdminEligibilityPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/schemes/:schemeId/documents"
          element={
            <AdminRoute>
              <AdminDocumentsPage />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/schemes/:schemeId/documents/new"
          element={
            <AdminRoute>
              <AdminDocumentPage />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App