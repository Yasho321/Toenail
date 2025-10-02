import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} appearance={{
        cssLayerName : 'clerk',
        
     variables:{
        colorPrimary: "#e50914", // Netflix-style red (matches buttons & highlights)
  colorDanger: "#ff4d4f",  // Error red
  colorSuccess: "#22c55e", // Green for success
  colorWarning: "#141414", // Amber warning
  colorNeutral: "#e50914", // Neutral dark gray for borders/hover

  // 🖤 Background / Text
  colorBackground: "#0b0b0b", // Black background (matches header/footer)
  colorForeground: "#ffffff", // White text
  colorPrimaryForeground: "#ffffff", // Text on red buttons
  colorMuted: "#141414", // Muted background for cards/inputs
  colorMutedForeground: "#a1a1aa", // Secondary text (gray-400)

  // ✍️ Inputs
  colorInput: "#1f1f1f", // Dark input bg
  colorInputForeground: "#ffffff", // Input text white

  // ✨ Effects
  colorShimmer: "#27272a", 
  colorRing: "#e50914", // Red focus ring
  colorShadow: "rgba(0,0,0,0.6)", 
  colorBorder: "#27272a", // Subtle borders
  colorModalBackdrop: "rgba(0,0,0,0.8)",

  // 🔠 Typography
  fontFamily: "Inter, sans-serif",
  fontFamilyButtons: "Inter, sans-serif",
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // 🟦 Layout
  borderRadius: "0.5rem", // Rounded-md
  spacing: "1rem", // Default spacing
     }
    
      }}>
      <App />
    </ClerkProvider>
  </StrictMode>,
)
