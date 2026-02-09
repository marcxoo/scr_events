# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Event display application for "Coordinación de Emprendimiento" (likely UNEMI). Shows upcoming events on a rotating display screen with an admin panel for CRUD operations. Built with React 19 + Vite + Tailwind CSS v4, backed by Supabase.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture

### Data Flow
Events are managed through `EventContext` which:
1. Fetches from Supabase `events` table on mount
2. Falls back to static data in `src/data/events.js` if Supabase fails
3. Provides CRUD operations (`addEvent`, `updateEvent`, `deleteEvent`) to consumers

### Supabase Schema
The `events` table uses these columns:
- `id`, `event_date` (DATE), `type`, `title`, `logistica`, `comunicacion`, `time`, `description`

Date handling note: When creating `dateObj`, append `T12:00:00` to avoid timezone shifting (see `EventContext.jsx:34`).

### Pages
- `/` - **HomePage**: Auto-rotating display (60s interval) between event list and featured event cards. Features the next 1-2 events if they're within 1 day of each other.
- `/admin` - **AdminPage**: Table view with create/edit/delete modals for event management.

### Key Components
- `Layout` - Page wrapper with brand shapes and footer stripe
- `EventList` - Grid of all events with special styling for upcoming events (color-coded by day: 18=green, 19=yellow, 24=red)
- `NextEvent` - Featured single event view with mascot
- `Mascot` - Animated tiger mascot image

### Styling
Tailwind v4 with custom theme in `src/index.css`:
- `brand-blue`: #0c2e44
- `brand-orange`: #ff6900
- Font: Poppins

## Environment Variables

Required in `.env.local`:
```
VITE_SUPABASE_URL=<supabase_project_url>
VITE_SUPABASE_ANON_KEY=<supabase_anon_key>
```

## Deployment

Deployed to Vercel. The `vercel.json` rewrites all routes to `/` for SPA client-side routing.
