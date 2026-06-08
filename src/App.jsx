// src/App.jsx
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import Navbar from './components/common/Navbar';
import AppRoutes from './routes/AppRoutes';
import InstallBanner from './components/pwa/InstallBanner';

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ThemeProvider>
          <FavoritesProvider>
            <Navbar />
            <AppRoutes />
            <InstallBanner />
          </FavoritesProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}