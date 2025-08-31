

# Toenail AI

Toenail AI is an AI-powered solution for creating custom thumbnails for YouTube videos, designed to help content creators effortlessly generate visually engaging thumbnails.

## Purpose

The project aims to leverage AI technologies to automate and enhance the creation of YouTube thumbnails, improving user engagement and channel aesthetics through intelligent design.

## Live Demo

Try the live application at: [https://www.toenail.in](https://www.toenail.in)


## Workflow

- Users can **sign up or log in** to access a personalized dashboard.
- On the dashboard, users upload an image and provide a prompt describing their thumbnail needs.
- Users answer a few guided questions to improve the AI's understanding and thumbnail quality.
- The AI then generates **three unique thumbnails** based on inputs.
- Users can download individual thumbnails or download all three thumbnails as a ZIP file for convenience.

## Token-Based SaaS Model
- Toenail AI operates on a token-based system.
- Each new user receives 3 free tokens upon signing up.
- Every thumbnail prompt consumes one token.
- Users need to purchase additional tokens to continue generating thumbnails beyond the free tokens.
- Razorpay is integrated for secure and seamless token purchases via the pricing section.

## Tech Stack

The solution utilizes:

- Backend AI: **Nano Banana AI** using Google 2-5 Flash Image model
- OpenAI SDK for natural language processing and image prompt understanding
- Frontend: React with Vite, TailwindCSS, Radix UI components, React Router, Zustand state management, React Query, and more
- Backend: Node.js with Express, MongoDB, Mongoose, Sharp for image processing, JSZip for archival, and integration with Google GenAI and OpenAI APIs

### Frontend Dependencies (from package.json)

- React, React DOM
- TailwindCSS with Vite integration
- Radix UI for accessibility-focused components
- React Query, Zustand, React Router, Axios
- Various utility libraries such as clsx, lucide-react, and react-hot-toast

### Backend Dependencies (from package.json)

- Express.js, Mongoose for server and database management
- Google GenAI SDK, OpenAI SDK for AI-powered functions
- Sharp for image manipulation
- Multer for file uploads
- JSZip for creating zip archives
- Additional utilities like bcryptjs, jsonwebtoken, cookie-parser, dotenv, cors

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Yasho321/Toenail.git
```

Follow the setup instructions in the respective frontend and backend folders to install dependencies and configure environment variables.


