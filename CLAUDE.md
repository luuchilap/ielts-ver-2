# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a comprehensive IELTS test platform with two main applications:
- **Admin Panel**: For test creation, management, and grading (React.js + Node.js/Express)
- **Client Application**: For students to take tests (React.js/TypeScript + Node.js/Express)

## Repository Structure

```
ielts_ver_2/
├── admin/
│   ├── frontend/          # Admin React app (port 3000, proxy to 5002)
│   └── backend/           # Admin API server (port 5002)
├── client/
│   ├── frontend/          # Student React/TypeScript app (port 3000, proxy to 5001)
│   └── backend/           # Student API server (port 5001)
├── shared/
│   ├── models/            # Shared MongoDB models
│   └── config/            # Shared configuration
```

## Development Commands

### Admin Application
```bash
# Admin Frontend (React.js)
cd admin/frontend
npm install
npm start                  # Development server on port 3000
npm run build              # Production build
npm test                   # Run tests

# Admin Backend (Node.js/Express)
cd admin/backend
npm install
npm run dev                # Development with nodemon
npm start                  # Production server
npm test                   # Run tests with Jest
```

### Client Application
```bash
# Client Frontend (React.js/TypeScript)
cd client/frontend
npm install
npm start                  # Development server on port 3000
npm run build              # Production build
npm test                   # Run tests

# Client Backend (Node.js/Express)
cd client/backend
npm install
npm run dev                # Development with nodemon
npm start                  # Production server
npm run seed               # Seed database with sample data
npm test                   # Run tests with Jest
npm run lint               # ESLint checking
npm run lint:fix           # ESLint with auto-fix
```

## Architecture

### Backend Services
- **Admin Backend (port 5002)**: Test creation, user management, content management
- **Client Backend (port 5001)**: Student authentication, test taking, results submission
- **Shared Models**: Common MongoDB schemas for User, Test, TestSubmission

### Frontend Applications
- **Admin Frontend**: React.js with Tailwind CSS for test administration
- **Client Frontend**: React.js with TypeScript and Tailwind CSS for student interface

### Database
- MongoDB with shared models across both backends
- Models include: User, Test, TestSubmission with complex question schemas

## Key Features

### Test Types Supported
- **Reading**: 9 question types (multiple choice, True/False/Not Given, fill in blanks, matching, etc.)
- **Listening**: Audio-based questions with synchronized playback
- **Writing**: Task 1 & Task 2 with rich text editor
- **Speaking**: Voice recording with part-by-part structure

### Technology Stack
- **Frontend**: React.js, TypeScript, Tailwind CSS, React Query, React Hook Form
- **Backend**: Node.js, Express.js, MongoDB, JWT authentication
- **Audio**: Howler.js for playback, native recording APIs
- **Security**: Helmet, CORS, rate limiting, input validation

## Environment Setup

Both backends require `.env` files based on their respective `env.example` files:

### Admin Backend
- MongoDB connection string
- JWT secrets
- CORS origins
- File upload limits

### Client Backend
- Similar configuration with different ports
- Email configuration for notifications
- Rate limiting settings

## Database Models

### Test Schema
Complex nested structure supporting:
- Reading sections with multiple question types
- Listening sections with audio synchronization
- Writing tasks with evaluation criteria
- Speaking parts with timing controls

### Question Types
- multipleChoiceSingle/Multiple
- trueFalseNotGiven
- fillInBlanks
- matchingHeadings
- sentenceCompletion
- shortAnswer
- summaryCompletion
- noteCompletion
- diagramLabeling

## Development Workflow

1. **Database Setup**: Ensure MongoDB is running
2. **Backend First**: Start both backend services
3. **Frontend Development**: Run frontend applications with proxy configuration
4. **Testing**: Use Jest for backend, React Testing Library for frontend

## API Structure

### Admin APIs
- `/api/auth` - Admin authentication
- `/api/tests` - Test CRUD operations
- `/api/users` - User management
- `/api/upload` - File uploads

### Client APIs
- `/api/auth` - Student authentication
- `/api/tests` - Test browsing and taking
- `/api/submissions` - Test submissions and results
- `/api/stats` - Progress tracking

## Common Development Tasks

### Adding New Question Types
1. Update shared Test model in `shared/models/Test.js`
2. Update frontend TypeScript types in `client/frontend/src/types/index.ts`
3. Add question editor in admin frontend
4. Add question display in client frontend

### Database Operations
- Use `npm run seed` in client/backend for sample data
- Migration scripts available in both backends
- Shared models ensure consistency

## Port Configuration
- Admin Frontend: 3000 (proxy to 5002)
- Admin Backend: 5002
- Client Frontend: 3000 (proxy to 5001)
- Client Backend: 5001

## Build and Deployment
- Both frontends use Create React App build process
- Backend deployments require Node.js environment
- Static files served from backend `/uploads` endpoints
- Environment variables required for production deployment