# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite e-commerce application using Tailwind CSS for styling. The project uses modern React 19.1 with TypeScript 5.8 and is configured with SWC for fast refresh.

## Development Commands

- **Start development server**: `pnpm dev`
- **Build for production**: `pnpm build` (runs TypeScript compilation then Vite build)
- **Lint code**: `pnpm lint` (uses ESLint with TypeScript rules)
- **Preview production build**: `pnpm preview`

## Technology Stack

- **Framework**: React 19.1 with TypeScript
- **Build Tool**: Vite 7.1 with SWC plugin for fast refresh
- **Styling**: Tailwind CSS 4.1 with Vite plugin
- **Linting**: ESLint 9.35 with TypeScript, React Hooks, and React Refresh plugins
- **Package Manager**: Project uses pnpm (indicated by pnpm-lock.yaml)

## Project Structure

```
src/
├── App.tsx          # Main application component
├── App.css          # Component-specific styles
├── main.tsx         # Application entry point
├── index.css        # Global styles (includes Tailwind)
├── assets/          # Static assets
└── vite-env.d.ts    # Vite type definitions
```

## Configuration Files

- `vite.config.ts` - Vite configuration with React SWC and Tailwind plugins
- `eslint.config.js` - ESLint configuration with TypeScript and React rules
- `tsconfig.json` / `tsconfig.app.json` / `tsconfig.node.json` - TypeScript configurations
- `.nvmrc` - Node version specification

## Deployment

### GitHub Pages Integration

The project is configured for automatic deployment to GitHub Pages:

- **Manual deployment**: `pnpm run deploy` (builds and deploys to gh-pages branch)
- **Automatic deployment**: GitHub Actions workflow triggers on pushes to main branch
- **Build output**: Located in `dist/` directory
- **Base path**: Configured for `/inca-app/` repository path

### GitHub Actions Workflow

- Located at `.github/workflows/deploy.yml`
- Uses pnpm for package management
- Runs linting and builds before deployment
- Deploys only from main branch

### Prerequisites for Deployment

1. Repository must be pushed to GitHub
2. GitHub Pages must be enabled in repository settings
3. Pages source should be set to "GitHub Actions"

## Development Notes

- Uses React 19 with modern features and StrictMode enabled
- ESLint configured with recommended TypeScript and React rules
- Tailwind CSS configured as a Vite plugin for optimal performance
- No testing framework currently configured
- Project uses pnpm package manager with lockfile
