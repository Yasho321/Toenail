

import { SignIn, useUser } from '@clerk/clerk-react'
import { Navigate } from 'react-router-dom'

export default function SignInPage() {
  const { isSignedIn } = useUser()

  if (!isSignedIn) {
    return <div className='min-h-screen flex items-center justify-center'>
      <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b0707 100%)",
          }}
        />

        {/* Clerk SignUp Form */}
        <div className="relative z-10">
      <SignIn signUpUrl="/signup" appearance={{
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
    }} /></div></div>
  }else{
    return <Navigate to="/" />
  }

  
}