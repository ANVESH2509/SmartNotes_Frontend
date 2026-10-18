import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import { useAuth } from './context/AuthContext.jsx'
import AuthPage from './pages/AuthPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import NoteDetailsPage from './pages/NoteDetailsPage.jsx'
import NotesPage from './pages/NotesPage.jsx'
import UploadPage from './pages/UploadPage.jsx'

function ProtectedRoute({ children }) {
  const { token, sessionExpired } = useAuth()
  const location = useLocation()
  return token ? children : <Navigate to="/login" replace state={{ from: location, sessionExpired }} />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index element={<NotesPage />} />
        <Route path="notes/:id" element={<NoteDetailsPage />} />
        <Route path="upload" element={<UploadPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
