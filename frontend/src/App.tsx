import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { hasLoveAccess } from './auth/loveAuth';
import LoginPage from './pages/LoginPage';
import LovePage from './pages/LovePage';

function ProtectedLovePage() {
  return hasLoveAccess()
    ? <LovePage />
    : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/love" element={<ProtectedLovePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
