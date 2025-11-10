# NepLink - Community Platform for Nepali People

## Setup Instructions

### Prerequisites
1. Node.js (v14 or higher)
2. MySQL Server

### Database Setup

1. Install MySQL Server on your system
2. Create a MySQL user with the following credentials:
   - Username: `root`
   - Password: `root`
   - Or update the credentials in the `.env` file

3. Create the database:
   ```sql
   CREATE DATABASE neplink;
   ```

4. Update the `.env` file with your database credentials if different from defaults:
   ```
   PORT=5000
   JWT_SECRET=neplink_jwt_secret_key
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=neplink
   ```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database:
   ```bash
   node setup/init-db.js
   ```

3. Start the server:
   ```bash
   npm start
   ```

### Development

For development with auto-restart:
```bash
npm run dev
```

## Features

- User authentication (Customer, Owner, Admin)
- News section
- Marketplace
- Job listings
- Rental properties
- Role-based access control

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### News
- `GET /api/news` - Get all news
- `POST /api/news` - Create news (authenticated)

### Marketplace
- `GET /api/marketplace` - Get all items
- `POST /api/marketplace` - Create item (authenticated)

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create job (authenticated)

### Rentals
- `GET /api/rentals` - Get all rentals
- `POST /api/rentals` - Create rental (authenticated)