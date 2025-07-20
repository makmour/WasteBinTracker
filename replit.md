# Waste Bin Survey Application

## Overview

This is a mobile-first web application designed for municipal waste supervisors and field workers in Glyfada Municipality to collect and export data about street waste bin locations. The application allows users to log waste bins with GPS coordinates, photos, and other details while supporting offline functionality.

## User Preferences

```
Preferred communication style: Simple, everyday language.
```

## System Architecture

The application follows a full-stack architecture with a clear separation between client and server components:

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **State Management**: React Query (@tanstack/react-query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Mobile-First Design**: Responsive layout optimized for mobile devices with PWA capabilities

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **File Uploads**: Multer middleware for handling photo uploads
- **Development**: Hot module replacement with Vite integration

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Definition**: Centralized in `/shared/schema.ts` for type safety across client and server
- **Migrations**: Managed through Drizzle Kit with migrations stored in `/migrations`

## Key Components

### Data Models
The application centers around the `binSurveyEntries` table with the following fields:
- GPS coordinates (latitude/longitude)
- Street selection from predefined Glyfada streets
- Multiple bin types (Green, Blue, Brown, Yellow)
- Quantity, photos, comments, and sync status

### Mobile Features
- **GPS Integration**: Real-time location capture with accuracy tracking
- **Camera Integration**: Photo capture with file upload support
- **Offline Support**: Service worker implementation for offline functionality
- **Progressive Web App**: Manifest configuration for mobile installation

### User Interface Components
- **Survey Form**: Main data entry interface with form validation
- **Location Card**: GPS status and coordinate display
- **Bin Type Selector**: Multi-select interface for waste bin types
- **Photo Capture**: Camera integration with preview and removal
- **History View**: List of submitted entries with export functionality
- **Bottom Navigation**: Quick access to main features

## Data Flow

1. **Data Entry**: Users fill out the survey form with location automatically populated from GPS
2. **Local Storage**: Form data is stored locally with Drizzle ORM managing database operations
3. **Photo Handling**: Images are processed through Multer and stored in the uploads directory
4. **Data Export**: Users can export collected data in CSV or GeoJSON formats
5. **Sync Management**: Tracks which entries have been synced/exported

## External Dependencies

### UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for managing component variants

### Development and Build
- **Vite**: Fast build tool with HMR support
- **TypeScript**: Type safety across the entire application
- **ESBuild**: Fast JavaScript bundler for production builds

### Database and Validation
- **Drizzle ORM**: Type-safe database operations
- **Zod**: Runtime type validation and schema validation
- **React Hook Form**: Form management with validation

## Deployment Strategy

### Development
- Vite development server with hot module replacement
- Express server running on Node.js
- Environment variables for database configuration

### Production
- Vite builds static assets to `/dist/public`
- ESBuild bundles server code to `/dist/index.js`
- Single-process deployment serving both API and static files
- PostgreSQL database hosted on Neon Database

### Key Scripts
- `npm run dev`: Development server with hot reloading
- `npm run build`: Production build for both client and server
- `npm start`: Production server startup
- `npm run db:push`: Database schema deployment

The architecture prioritizes mobile usability, offline functionality, and data integrity while maintaining a simple deployment model suitable for municipal use cases.