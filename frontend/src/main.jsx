import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import GoogleAuthProvider from "./providers/GoogleAuthProvider.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleAuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleAuthProvider>
  </StrictMode>,
)
