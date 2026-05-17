# LogoCraft AI

An AI-powered logo designer that generates and animates unique, dynamic logos based on your company's identity. LogoCraft AI leverages the reasoning capabilities of the Google Gemini API to synthesize clean, scalable SVG graphics, select precise brand palettes, and craft custom entry animations for your logo.

## Features

- **Generative AI Logos**: Input your company name, industry, and preferred color palette to instantly generate a suitable, minimalist vector logo.
- **Dynamic Animations**: The AI decides the appropriate entry or idle animation state (spin, float, pulse, or draw) ensuring the logo feels alive.
- **Brand Analysis**: Get a generated brief explaining the design rationale and a breakdown of the hex color palette utilized in your logo.
- **Scalable SVG**: Generates inline SVG output, allowing high-performance and crisp resolution across all devices.

## Tech Stack

- **Frontend**: Vue 3 (Composition API), Vite, Tailwind CSS v4, Motion (for animations), and Lucide Vue Next (icons).
- **Backend**: Express.js serving as the API Gateway/Backend-for-Frontend (BFF).
- **AI Model**: Google Gemini API (`gemini-2.5-flash`) orchestrated via the `@google/genai` official SDK.

## Prerequisites

- Node.js (v18 or higher)
- A valid Google Gemini API Key. You can obtain one from [Google AI Studio](https://aistudio.google.com/).

## Environment Setup

1. Rename the `.env.example` file to `.env` (or configure your environment variables in your deployment platform / AI Studio Settings):
2. Add your Gemini API Key to the file:

```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

## Running the Application

### Development Mode

To run both the Vue frontend and the Express backend concurrently in development mode (using Vite middleware):

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build

To compile the Vue frontend and safely bundle the Express server for production:

```bash
# Build the project
npm run build

# Start the production server
npm start
```

## Usage
1. Open the application in your browser.
2. Enter your "Company Name" (e.g., *Lumina Tech*).
3. Optionally add your "Industry" (e.g., *Sustainable Energy*) and "Preferred Colors" (e.g., *Midnight Blue, Silver*).
4. Click **Construct Logo**.
5. Wait for the neural synthesis process to complete, and your animated brand identity will be displayed instantly!
