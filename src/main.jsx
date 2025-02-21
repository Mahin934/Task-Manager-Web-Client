import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import route from './routes/route'
import DarkModeProvider from './providers/DarkModeProvider'
import AuthProvider from './providers/AuthProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DarkModeProvider>
        <RouterProvider router={route} />
      </DarkModeProvider>
    </AuthProvider>
  </StrictMode>,
)
