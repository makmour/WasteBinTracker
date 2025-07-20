
# Waste Bin Survey Application

A mobile-first Progressive Web App (PWA) designed for municipal waste supervisors and field workers to collect and export data about street waste bin locations with GPS coordinates, photos, and comments while supporting offline functionality.

## Overview

This application was developed as an MVP for Glyfada Municipality in Greece, with plans to expand to all Greek municipalities. It enables systematic surveying of waste bin distribution across municipality streets while working offline in the field.

## Features

### Core Functionality
- **GPS-based bin logging** with real-time location capture
- **Street selection** with three modes:
  - **Nearby**: Shows streets within 2km of GPS location
  - **Search**: Real-time search through municipality streets
  - **Browse All**: Complete street database (180+ Glyfada streets)
- **Multi-bin type counting** (Green, Blue, Brown, Yellow recycling bins)
- **Photo capture** with camera integration
- **Comments** for bin condition notes
- **Offline support** with service worker implementation

### Data Management
- **Local storage** with PostgreSQL and Drizzle ORM
- **Export functionality** (CSV and GeoJSON formats)
- **Sync status tracking** for data management
- **History view** of all survey entries

### Mobile-First Design
- **Progressive Web App** (PWA) capabilities
- **"Add to Home Screen"** functionality
- **Touch-friendly interface** optimized for field work
- **Responsive design** for all screen sizes
- **Bottom navigation** for easy mobile access

## Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast development and building
- **Wouter** for lightweight routing
- **Tailwind CSS** for styling
- **Shadcn/ui** components built on Radix UI
- **React Query** for server state management

### Backend
- **Node.js** with Express.js
- **PostgreSQL** with Neon Database
- **Drizzle ORM** for type-safe database operations
- **Multer** for file upload handling

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for production builds
- **Drizzle Kit** for database migrations

## Usage

### Typical Workflow
1. **Navigate** to a street location
2. **Wait for GPS** to lock your position
3. **Select the street** name from the database
4. **Count bins** as you walk (tap +/- buttons for each type)
5. **Add comments** about bin conditions if needed
6. **Submit the entry** with automatic timestamp
7. **Export data** when needed for municipal reporting

### Street Selection Modes
- **GPS-Based**: Automatically filters to nearby streets
- **Search**: Type to find specific streets
- **Browse**: View complete municipality street list

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (or Neon Database account)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/waste-bin-survey.git
cd waste-bin-survey
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your database connection string
DATABASE_URL="your_postgresql_connection_string"
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Data Model

The application stores survey entries with the following fields:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | Serial | Yes | Unique identifier |
| datetime | Timestamp | Yes | Auto-generated submission time |
| municipality | Text | Yes | Municipality name (currently "Glyfada") |
| street | Text | Yes | Selected street name |
| latitude | Float | Yes | GPS latitude coordinate |
| longitude | Float | Yes | GPS longitude coordinate |
| binTypes | Text[] | Yes | Array of bin types found |
| quantity | Integer | Yes | Total number of bins |
| photoUri | Text | No | Path to uploaded photo |
| comments | Text | No | Optional notes |
| synced | Boolean | Yes | Export/sync status |

## Export Formats

### CSV Export
- UTF-8 encoded
- Headers matching data model
- Compatible with Excel and other spreadsheet applications

### GeoJSON Export
- FeatureCollection format
- Point geometry with coordinates
- All survey data as feature properties
- Compatible with GIS applications

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check
npm run check

# Push database schema changes
npm run db:push
```

### Project Structure

```
├── client/                 # Frontend React application
│   ├── public/            # Static assets and PWA manifest
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── pages/         # Application pages
├── server/                # Backend Express application
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data access layer
├── shared/               # Shared TypeScript schemas
└── uploads/              # Photo storage directory
```

## Deployment

This application is designed to be deployed on Replit with automatic scaling and deployment capabilities.

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)

## 🗺 Street Data

The application features a comprehensive database of streets in Glyfada Municipality. For other municipalities:

1. Update the street data in the database
2. Modify the municipality field in the schema
3. Adjust the GPS filtering radius as needed

## PWA Features

- **Offline functionality** with service worker
- **Add to home screen** on mobile devices
- **Mobile-optimized interface**
- **Background sync** capabilities
- **Push notifications** ready (future enhancement)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

## Roadmap

- [ ] Multi-municipality support
- [ ] Advanced reporting and analytics
- [ ] QR code integration for street selection
- [ ] Scheduled data backups
- [ ] Integration with municipal management systems
- [ ] User authentication and role management

---

**Built for Greek Municipalities** | **Mobile-First Design** | **Offline Capable**
