import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TextTranslation from './pages/TextTranslation';
import Projects from './pages/Projects';
import Teams from './pages/Teams';
import Settings from './pages/Settings';
import TranslationMemory from './pages/TranslationMemory';
import Glossary from './pages/Glossary';
import LanguageSettings from './pages/LanguageSettings';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import { AuthProvider, useAuth } from './context/AuthContext';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/login\" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/text-translation" element={<TextTranslation />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/teams" element={<Teams />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/translation-memory" element={<TranslationMemory />} />
                      <Route path="/glossary" element={<Glossary />} />
                      <Route path="/language-settings" element={<LanguageSettings />} />
                    </Routes>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;