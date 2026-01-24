# EO Guides

## Overview

EO Guides is a community resource website for the game "Endless Online: Recharged". It provides comprehensive guides organized by category including quests, travel routes, class builds, and game commands. The application follows a modern full-stack architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with CSS variables for theming (dark gaming-themed design)
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Animations**: Framer Motion for page transitions and micro-interactions
- **Build Tool**: Vite with hot module replacement

The frontend uses path aliases (`@/` for client source, `@shared/` for shared code) configured in both TypeScript and Vite.

### Backend Architecture
- **Framework**: Express 5 with TypeScript
- **Runtime**: Node.js with tsx for TypeScript execution
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation schemas
- **Database Access**: Drizzle ORM with type-safe query building

The server handles both API routes and serves the static frontend build in production. Development mode uses Vite's middleware for HMR.

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with schema defined in `shared/schema.ts`
- **Schema Validation**: drizzle-zod for generating Zod schemas from Drizzle table definitions
- **Migrations**: Drizzle Kit with `db:push` command for schema synchronization

### Shared Code Pattern
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts`: Database table definitions and TypeScript types
- `routes.ts`: API route definitions with Zod input/output schemas

This enables type-safe API contracts across the stack.

### Key Design Decisions

1. **Single Database Table**: The application uses a simple `guides` table with category filtering rather than separate tables per guide type. This simplifies queries and allows flexible categorization.

2. **Slug-based URLs**: Guides use URL-friendly slugs for SEO-friendly permalinks instead of numeric IDs in public routes.

3. **Server-side Filtering**: Search and category filtering happen on the backend using Drizzle's query builder with `ilike` for case-insensitive search.

4. **Static Build Serving**: Production builds bundle the frontend into `dist/public` and are served by Express, eliminating the need for a separate static file server.

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session storage (available but not currently in use)

### UI/Styling
- **Radix UI**: Accessible primitive components (dialogs, dropdowns, tooltips, etc.)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant styling

### Data Handling
- **Zod**: Runtime type validation for API inputs/outputs
- **date-fns**: Date formatting utilities
- **react-markdown**: Rendering markdown content in guides

### Build & Development
- **Vite**: Frontend build tool with React plugin
- **esbuild**: Server bundling for production
- **Drizzle Kit**: Database migration tooling