# LaunchForge AI

LaunchForge AI is a premium SaaS application designed to help freelancers, solo agencies, and teams streamline their project management and proposal generation process using the power of AI.

## The Problem
Generating project proposals, defining scopes, and managing deliverables can be a time-consuming and tedious process. Agencies often struggle with maintaining consistent quality and speed when pitching to new clients.
                                      
## The Solution
LaunchForge AI solves this by integrating advanced AI models (via Groq and LLaMA 3) to instantly generate comprehensive project briefs, scopes, pricing proposals, and tasks based on a simple client message. It provides a stunning, production-ready workspace to edit, manage, and export these deliverables.


## Features
- **AI-Powered Project Generation**: Instantly generate detailed project scopes and proposals.
- **Interactive Workspace**: Edit deliverables inline with auto-save functionality.
- **Task Management**: Track project progress with interactive task checklists.
- **Export & Share**: Export proposals to PDF or share them via clipboard.
- **Settings & Preferences**: Manage user profiles, notification toggles, and billing plans.
- **Dark Mode Premium UI**: A highly polished, modern design language utilizing custom CSS variables, Framer Motion animations, and TailwindCSS.

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: TailwindCSS, Custom CSS Variables, Lucide Icons
- **Animations**: Framer Motion
- **Database / Auth**: Supabase
- **AI Engine**: Groq API (llama3-70b-8192)

## Setup Steps
1. Clone the repository: `git clone https://github.com/sudhanshuyembadwar8-ctrl/LaunchForge-AI.git`
2. Install dependencies: `npm install`
3. Set up your `.env` file (see `.env.example`).
4. Run the development server: `npm run dev`                                        
5. Open `http://localhost:3000` in your browser.

## Environment Variables
See `.env.example` for the required keys.

## Development Challenges & Solutions

### 1. Missing `.env` Blocking App
**Challenge**: The application initially failed to load due to missing environment variables for Supabase and Groq, leading to silent failures during authentication and AI generation.
**Solution**: Implemented robust error handling and fallback UI states, and documented the required `.env` variables clearly.

### 2. CSS Parsing Errors (`rgba` issue)
**Challenge**: A mass find-and-replace of legacy CSS variables resulted in invalid CSS syntax (e.g., `var(rgba(...))`), which broke the Next.js build and prevented any pages from rendering.
**Solution**: Actively debugged the build logs, identified the malformed `globals.css` entries, and used targeted regex to correct the syntax to valid CSS custom properties and inline values, restoring the build.

### 3. Broken Routes (`404 settings/billing`)
**Challenge**: Navigating to certain settings pages resulted in 404 errors due to missing or incorrectly named Next.js page components.
**Solution**: Audited the file structure, matched the sidebar links to actual files, and created/moved the necessary `page.tsx` files to ensure seamless routing across the dashboard and settings.

### 4. AI JSON Parsing Issues
**Challenge**: The Groq AI response was occasionally returning malformed JSON or including markdown code blocks that broke the frontend parser.
**Solution**: Improved the prompt engineering to enforce strict JSON output and added resilient parsing logic on the client/server boundary to strip markdown and handle partial responses gracefully.
