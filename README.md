# 🧠 AI Branding Assistant

**AI Branding Assistant** is a powerful web-based tool designed to help startups, entrepreneurs, and creators build their brand identity with ease using AI. It offers smart logo generation, dynamic color palette selection, typography recommendations, and themed image generation — all in one place.

---

## 🚀 Features

- **AI-Powered Brand Generation**  
  Generate brand assets like logos, color palettes, and typography using prompts and AI.

- **Dynamic Color Palette & Theme Customization**  
  Customize color schemes with instant preview and matching typography.

- **Logo Creation & Preview**  
  Generate modern logos based on business category, name, and aesthetic preferences.

- **Themed Image Generation & Enhancement**  
  Generate and refine brand visuals that align with your identity.

- **Authentication & User Management**  
  Seamless login via Clerk and Firestore-backed user data handling.

- **Responsive UI & Real-time Feedback**  
  Clean, interactive interface with live updates and feedback.

---

## 🛠 Tech Stack

- **Frontend:** React (Vite), Tailwind CSS  
- **Backend:** TypeScript  
- **Authentication:** Clerk  
- **Database:** Firebase Firestore  
- **AI APIs:** Gemini, GitHub (Text/Image models)  
- **Deployment:** Docker, Vercel

---

## 📁 Directory Structure:
└── saikishoremsk-ai-branding-assitant/
    ├── README.md
    ├── components.json
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.ts
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    ├── .env.example
    ├── public/
    └── src/
        ├── App.css
        ├── App.tsx
        ├── env.d.ts
        ├── index.css
        ├── main.tsx
        ├── vite-env.d.ts
        ├── components/
        │   ├── BrandingSuggestions.tsx
        │   ├── ColorPalette.tsx
        │   ├── Header.tsx
        │   ├── ImageThemer.tsx
        │   ├── LogoGenerator.tsx
        │   ├── PromptInput.tsx
        │   ├── ThemePreview.tsx
        │   ├── TokenManager.tsx
        │   └── ui
        ├── hooks/
        │   ├── use-mobile.tsx
        │   ├── use-toast.ts
        │   ├── useColorGeneration.ts
        │   └── useStoreUser.tsx
        ├── lib/
        │   ├── firebase.ts
        │   └── utils.ts
        ├── pages/
        │   ├── Index.tsx
        │   └── NotFound.tsx
        └── services/
            ├── geminiAI.ts
            └── githubAI.ts

-------------------------------------------------------------------------

🧪 How to Run
1.Clone the Repository
    git clone https://github.com/saikishoreMSK/ai-branding-assitant.git
    cd ai-branding-assitant

2.Install Dependencies
    npm i

3.Set Up Environment Variables
  Create a .env file in the root directory and add the following keys:
    VITE_GITHUB_TOKEN=your_github_token_here
    VITE_GEMINI_API_KEY=your_gemini_api_key_here
    VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here

4.Start the Development Server
    npm run dev

5.✅ Ensure Firebase and Clerk are properly configured before proceeding.