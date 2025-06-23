import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import PartnerPage from './pages/PartnerPage';
import AdminPage from './pages/AdminPage';
import VerifyPage from './pages/VerifyPage';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/partner" element={<PartnerPage />} />
        <Route path="/admin" element={<AdminPage />} />
     
        {/* Default routes */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  )
}

export default App
