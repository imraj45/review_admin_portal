# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Review admin portal built with React 19, TypeScript 5.9, and Vite 8.

## Commands

- **Dev server:** `npm run dev`
- **Build:** `npm run build` (runs `tsc -b && vite build`)
- **Lint:** `npm run lint` (ESLint with TypeScript and React plugins)
- **Preview production build:** `npm run preview`

## Architecture

- **Entry point:** `src/main.tsx` renders `<App />` inside `<StrictMode>`
- **Bundler:** Vite with `@vitejs/plugin-react`
- **TypeScript:** Split config — `tsconfig.app.json` for app code, `tsconfig.node.json` for tooling
- **ESLint:** Flat config (`eslint.config.js`) with `typescript-eslint`, `react-hooks`, and `react-refresh` plugins
