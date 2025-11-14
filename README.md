# MEDIBOT Clinic Helper

AI-powered medical assistant frontend built with React, TypeScript, Vite, Tailwind CSS, and shadcn/ui. It integrates with n8n Chat for conversational consultations, offers voice input via the Web Speech API, and includes smart doctor listing and appointment booking UI.

## Features

- AI chat powered by `@n8n/chat` with development proxy to a local n8n instance
- Voice input using the browser’s Speech Recognition (requires HTTPS or localhost)
- Doctor directory with specialization, ratings, and availability
- Appointment booking flow with confirmation and toast notifications
- Theming with light/dark mode and polished UI components (shadcn/ui + Radix)
- React Router setup with `Index` and `NotFound` pages

## Tech Stack

- React 18 + TypeScript
- Vite 5 (React SWC)
- Tailwind CSS + `tailwindcss-animate`
- shadcn/ui components built on Radix UI
- React Router DOM
- TanStack Query for data management
- Lucide icons

## Prerequisites

- Node.js 18+ and npm
- Optional: a running n8n instance for chat integration
  - Development expects n8n at `http://localhost:5678` (proxied via Vite)
  - You need an n8n workflow exposing a chat webhook

## Quick Start

1. Navigate to the app directory:
   - `cd medibot-clinic-helper`
2. Install dependencies:
   - `npm install`
3. Start the development server:
   - `npm run dev`
   - Dev server runs on `http://localhost:8080` and proxies `/n8n/*` to `http://localhost:5678/*`
4. Open `http://localhost:8080` in your browser.

## Available Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build for production
- `npm run build:dev` — build using development mode
- `npm run preview` — locally preview the production build
- `npm run lint` — run ESLint

## Configuration

- `vite.config.ts`
  - Dev server listens on port `8080`
  - Proxies requests from `/n8n/...` to `http://localhost:5678/...`
  - Path alias `@` resolves to `./src`
- `tailwind.config.ts`
  - Scans `./src/**/*.{ts,tsx}` and related folders
  - Custom animations (`fade-in`, `pulse-glow`, `accordion`) and CSS variables-based theme

## n8n Chat Integration

- The chat UI is initialized in `src/components/ChatInterface.tsx`.
- Webhook URL selection:
  - Development: `webhookUrl = "/n8n/webhook/4091fa09-fb9a-4039-9411-7104d213f601/chat"`
  - Production: `webhookUrl = "http://localhost:5678/webhook/4091fa09-fb9a-4039-9411-7104d213f601/chat"`
- Update these URLs to point to your n8n deployment in production (prefer HTTPS).
- `createChat` is configured with `mode: "fullscreen"` and loads previous sessions.
  
    <img width="688" height="695" alt="image" src="https://github.com/user-attachments/assets/b8c7f7f5-6cbe-4611-ae53-deaf7dd21f24" />


## Voice Input

- Implemented via the Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`).
- Requirements:
  - Secure context (HTTPS) or running on `localhost`
  - Microphone permission granted by the browser
- UX:
  - Start/stop recording with the mic button in the chat header
  - Transcribed text is injected into the n8n chat input and sent automatically
- Error handling includes permissions, device availability, and network issues with toasts.

## Project Structure

```
medibot-clinic-helper/
├── public/
├── src/
│  ├── components/
│  │  ├── ChatInterface.tsx         # n8n chat + voice input
│  │  ├── DoctorsList.tsx           # doctor cards and selection
│  │  ├── AppointmentBooking.tsx    # booking form and confirmation
│  │  └── ui/                       # shadcn/ui primitives
│  ├── pages/
│  │  ├── Index.tsx                 # landing page and modals
│  │  └── NotFound.tsx
│  ├── App.tsx                      # providers and routing
│  └── main.tsx                     # bootstrapping
├── package.json
├── vite.config.ts
└── tailwind.config.ts
```

## Customization

- Replace the demo doctor data in `DoctorsList.tsx` with API-backed data.
- Wire `AppointmentBooking.tsx` to your backend to persist appointments.
- Change branding (logo, name, gradients) in `src/pages/Index.tsx` and global styles.
- Update the n8n webhook URL and settings in `ChatInterface.tsx` to match your environment.

## Deployment

1. Build the app: `npm run build`
2. Serve `dist/` with your preferred static host.
3. Ensure your production n8n chat webhook is reachable over HTTPS.
4. If hosting behind a reverse proxy, update the webhook base URL in `ChatInterface.tsx`.

## Troubleshooting

- Voice input does not start
  - Ensure you are on HTTPS or `localhost`
  - Grant microphone permission and verify a microphone is connected
- Chat does not respond
  - Verify n8n is reachable and the webhook ID/path is correct
  - In development, confirm Vite proxy is active at `/n8n/*` and n8n runs on `:5678`
- CORS or mixed content errors
  - Use HTTPS consistently for both the app and n8n endpoints in production
