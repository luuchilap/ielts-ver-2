# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the admin backend codebase.

## Project Overview

This is the admin backend API server for the IELTS test platform. It handles test creation, content management, user administration, and file uploads for the admin panel.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (with nodemon)
npm run dev

# Production server
npm start

# Database seeding
npm run seed

# Run tests
npm test
```

## Server Configuration

- **Port**: 5002 (configured in env)
- **CORS**: Configured for admin frontend at http://localhost:3000
- **Database**: Shared MongoDB with client backend
- **File Uploads**: Served from `/uploads` endpoint

## Project Structure

```
src/
├── server.js              # Main Express server
├── config/
│   └── database.js        # MongoDB connection
├── controllers/
│   ├── authController.js  # Admin authentication
│   ├── testController.js  # Test CRUD operations
│   └── uploadController.js # File upload handling
├── middleware/
│   ├── auth.js           # JWT authentication & role authorization
│   └── validation.js     # Request validation
├── models/
│   ├── Test.js          # Test schema with complex question types
│   ├── TestSubmission.js # Test submission results
│   └── User.js          # User model with admin roles
└── routes/
    ├── auth.js          # Authentication routes
    ├── tests.js         # Test management routes
    └── upload.js        # File upload routes
```

## Authentication & Authorization

### Role-Based Access Control
- **authenticateToken**: JWT verification middleware
- **requireContentManager**: Role-based access for test operations
- **User roles**: Super Admin, Content Manager, Admin

### JWT Configuration
- Token expiration: 7 days (configurable via JWT_EXPIRES_IN)
- Secret key from environment variables
- User data attached to req.user

## API Endpoints

### Authentication (`/api/auth`)
```
POST /login          # Admin login
POST /logout         # Admin logout
GET  /me            # Get current admin user
PUT  /profile       # Update admin profile
```

### Test Management (`/api/tests`)
```
GET    /            # Get all tests (with pagination/filtering)
GET    /:id         # Get test by ID
POST   /            # Create new test (requires Content Manager)
PUT    /:id         # Update test (requires Content Manager)
DELETE /:id         # Delete test (requires Content Manager)
POST   /:id/duplicate # Duplicate existing test
```

### File Upload (`/api/upload`)
```
POST /audio         # Upload audio files for listening tests
POST /image         # Upload images for test content
```

## Test Data Structure

### Complex Question Types Supported
- **multipleChoiceSingle/Multiple**: Standard MC questions
- **trueFalseNotGiven**: IELTS-style T/F/NG questions
- **fillInBlanks**: Gap-fill questions with word limits
- **matchingHeadings**: Paragraph-heading matching
- **sentenceCompletion**: Complete sentences from options
- **shortAnswer**: Short text responses
- **summaryCompletion**: Fill gaps in summaries
- **noteCompletion**: Complete notes/forms
- **diagramLabeling**: Label diagrams/charts

### Test Structure
- **Reading**: Multiple sections with passages and questions
- **Listening**: Audio files with synchronized questions
- **Writing**: Task 1 & Task 2 with evaluation criteria
- **Speaking**: Part 1, 2, 3 with timing and prompts

## Database Operations

### Models Location
- Uses shared models from `../../shared/models/`
- Consistent schema across admin and client backends
- MongoDB with Mongoose ODM

### Test ID Management
- Automatic string ID generation for nested objects
- Handles MongoDB ObjectId conversion
- Ensures frontend compatibility

## File Upload System

### Multer Configuration
- **Max file size**: 10MB (configurable)
- **Allowed types**: Audio (mp3, wav), Images (jpg, png, gif)
- **Storage**: Local filesystem in `/uploads` directory
- **URL serving**: Static files served at `/uploads` endpoint

### File Validation
- MIME type checking
- File size limits
- Path sanitization for security

## Security Features

### Helmet.js Security Headers
- XSS protection
- Content Security Policy
- HSTS headers
- Frame options

### Rate Limiting
- 100 requests per 15 minutes per IP
- Applied to all `/api/` routes
- Configurable limits via environment

### Input Validation
- Express-validator for request validation
- Sanitization of user inputs
- Type checking for complex test structures

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ielts_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=5002
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=uploads/
```

## Development Workflow

### Adding New Question Types
1. Update Test model schema in `src/models/Test.js`
2. Add validation rules in `src/middleware/validation.js`
3. Update controller logic in `src/controllers/testController.js`
4. Test with appropriate admin frontend components

### Database Migrations
- Use scripts in `/scripts` directory
- `migrateTestStructure.js` for test schema updates
- Always backup before migrations

### Testing
- Jest test framework
- Test files should be in `__tests__` directories
- Mock database connections for unit tests

## Error Handling

### Structured Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed validation errors"]
}
```

### Logging
- Morgan HTTP request logging
- Development: 'dev' format
- Production: 'combined' format

## Performance Considerations

### Database Queries
- Populate related data efficiently
- Use pagination for large datasets
- Index frequently queried fields

### File Handling
- Stream large file uploads
- Cleanup temporary files
- Compress images before storage

## Integration Points

### With Admin Frontend
- CORS configured for localhost:3000
- JSON API responses
- File upload endpoints for media

### With Client Backend
- Shared database models
- Consistent test data structure
- No direct API communication