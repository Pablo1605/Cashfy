import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './auth/authContext'
import { AppRouter } from './routes/AppRouter'
import { ThemeProvider } from './theme/ThemeContext'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>        
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
)
