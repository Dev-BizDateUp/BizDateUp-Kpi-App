import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from "react-router";
import { AppProvider } from './Components/Context/Context.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppProvider>
      <GoogleOAuthProvider clientId="1083245785128-v36gvmccmi53l5bijss9t7r5cv6oeaeo.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </AppProvider>
  </BrowserRouter>
)
