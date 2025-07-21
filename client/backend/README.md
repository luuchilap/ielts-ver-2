# IELTS Client Backend

This is the backend API server for the IELTS client application. It serves the student-facing frontend and provides APIs for test taking, results viewing, and user management.

## Features

- Student authentication and registration
- Test browsing and taking
- Progress tracking and results
- User profile management
- Statistics and analytics
- File uploads (audio recordings, avatars)

## Getting Started

### Prerequisites

- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will start on http://localhost:5000

### Environment Variables

See `.env.example` for required environment variables.

### API Documentation

The API follows RESTful conventions. Main endpoints:

- `/api/auth` - Authentication and user management
- `/api/tests` - Test browsing and taking
- `/api/submissions` - Test submissions and results  
- `/api/stats` - Statistics and progress tracking
- `/api/upload` - File upload endpoints

### Database Seeding

To seed the database with sample data:

```bash
npm run seed
```

### Testing

Run tests with:

```bash
npm test
```

## Project Structure

```
src/
├── server.js          # Main server file
├── config/            # Database and app configuration
├── models/            # MongoDB models
├── routes/            # Express routes
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── utils/             # Utility functions
├── scripts/           # Database scripts
└── uploads/           # File upload directory
```

## License

MIT
