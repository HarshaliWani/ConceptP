# ConceptPilot

**Last Updated:** October 8, 2025

## Overview
ConceptPilot is an AI educational tutor application that helps users learn and test their knowledge across various subjects. Built with React, TypeScript, Vite, and Tailwind CSS, it provides an interactive learning experience through multiple educational tools.

## Features
- **Interactive Chat Interface**: Ask questions, get AI-powered explanations, and receive examples
- **Quiz System**: Generate quizzes from conversations, take new quizzes, and review completed ones
- **Flashcards**: Create, manage, and study flashcards with different difficulty levels
- **Progress Tracking**: Visualize learning progress with statistics and subject-specific tracking

## Project Structure
```
project/
├── src/
│   ├── components/     # React components
│   │   ├── ChatInterface.tsx
│   │   ├── FlashcardsTab.tsx
│   │   ├── Header.tsx
│   │   ├── ProgressTab.tsx
│   │   ├── QuizSection.tsx
│   │   ├── QuizzesTab.tsx
│   │   └── Sidebar.tsx
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Technical Stack
- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2
- **Styling**: Tailwind CSS 3.4.1
- **Icons**: Lucide React
- **Database**: Supabase (configured but not actively used)

## Development
- **Port**: 5000 (configured for Replit environment)
- **Dev Server**: Vite with hot module replacement
- **Host**: 0.0.0.0 (allows Replit proxy access)

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Replit Configuration
- **Workflow**: Frontend server runs on port 5000
- **Deployment**: Autoscale deployment with Vite preview server
- **Proxy**: Configured to work with Replit's iframe proxy

## Recent Changes
**October 8, 2025**: Initial Replit setup
- Installed Node.js 20 and project dependencies
- Configured Vite for Replit environment (host 0.0.0.0, port 5000, HMR clientPort 443)
- Created .gitignore for Node.js projects
- Set up Frontend workflow for development
- Configured deployment settings for autoscale

## Notes
- The application currently uses mock data for demonstrations
- Supabase integration is included in dependencies but not actively used
- Profile settings section is marked as "Coming soon"
