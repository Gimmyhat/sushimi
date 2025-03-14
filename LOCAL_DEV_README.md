# Local Development Automation

## Description

This branch adds automation scripts for local development to simplify the process of starting and stopping the project. It also fixes database initialization issues and adds missing columns.

## Changes

1. Fixed database initialization:
   - Added `popularity` column to the `products` table
   - Updated product data with popularity values
   - Created a standalone script for manual database initialization

2. Added automation scripts:
   - `scripts/local/start.js` - Starts the database, initializes it, and runs the application
   - `scripts/local/stop.js` - Stops the database

3. Added npm scripts:
   - `npm run local:start` - Starts the project locally
   - `npm run local:stop` - Stops the project locally
   - `npm run local:db:init` - Initializes the database manually

## Usage

### Starting the project

```bash
npm run local:start
```

This command will:
1. Check if Docker is running
2. Start PostgreSQL in Docker if it's not already running
3. Initialize the database with test data
4. Start the Next.js development server

### Stopping the project

```bash
npm run local:stop
```

This command will:
1. Stop the PostgreSQL Docker container
2. Clean up Docker resources

### Manually initializing the database

```bash
npm run local:db:init
```

This command will:
1. Connect to the PostgreSQL database
2. Drop existing tables
3. Create new tables
4. Populate tables with test data

## Requirements

- Docker
- Node.js
- npm

## Notes

- The database runs on port 5433 to avoid conflicts with any existing PostgreSQL installations
- The application runs on port 3000
- All database credentials are stored in the `.env.local` file 