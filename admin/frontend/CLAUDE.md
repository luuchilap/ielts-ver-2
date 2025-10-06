# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with the admin frontend codebase.

## Project Overview

This is the admin frontend application for the IELTS test platform. Built with React.js and Tailwind CSS, it provides a comprehensive interface for content managers and administrators to create, edit, and manage IELTS tests.

## Development Commands

```bash
# Install dependencies
npm install

# Development server
npm start
# or
npm run dev

# Production build
npm run build

# Run tests
npm test

# Eject from Create React App (not recommended)
npm run eject
```

## Server Configuration

- **Development server**: Port 3000
- **Proxy**: Configured to proxy API calls to backend at port 5002
- **Hot reload**: Enabled for development

## Project Structure

```
src/
├── App.js                    # Main app component with routing
├── index.js                  # App entry point
├── index.css                 # Global styles with Tailwind
├── components/
│   ├── auth/
│   │   └── Login.js         # Admin login component
│   ├── dashboard/
│   │   └── Dashboard.js     # Main dashboard with analytics
│   ├── layout/
│   │   ├── Header.js        # Top navigation bar
│   │   ├── Layout.js        # Main layout wrapper
│   │   └── Sidebar.js       # Left navigation sidebar
│   └── tests/               # Test management components
│       ├── TestCreateForm.js       # Initial test creation form
│       ├── TestsList.js            # Tests listing and management
│       ├── QuestionGroup.js        # Generic question group editor
│       ├── SimpleQuestionEditor.js # Basic question editor
│       ├── ReadingTestEditor.js    # Reading test editor
│       ├── ListeningTestEditor.js  # Listening test editor  
│       ├── WritingTestEditor.js    # Writing test editor
│       ├── SpeakingTestEditor.js   # Speaking test editor
│       ├── listening/
│       │   ├── ListeningAudioManager.js # Audio upload/management
│       │   └── ListeningPreview.js      # Preview listening tests
│       ├── reading/
│       │   ├── ReadingPassageEditor.js  # Passage text editor
│       │   └── ReadingPreview.js        # Preview reading tests
│       ├── speaking/
│       │   ├── SpeakingPart1Editor.js   # Part 1 questions editor
│       │   ├── SpeakingPart2Editor.js   # Part 2 cue card editor
│       │   ├── SpeakingPart3Editor.js   # Part 3 discussion editor
│       │   └── SpeakingPreview.js       # Preview speaking tests
│       └── writing/
│           ├── WritingTask1Editor.js    # Task 1 prompt editor
│           ├── WritingTask2Editor.js    # Task 2 essay editor
│           └── WritingPreview.js        # Preview writing tests
├── contexts/
│   └── AuthContext.js       # Authentication state management
└── services/
    └── api.js              # API client configuration
```

## Technology Stack

### Core Framework
- **React.js 18**: UI framework
- **React Router Dom**: Client-side routing
- **Create React App**: Build toolchain

### State Management
- **React Query**: Server state management and caching
- **React Context**: Authentication state
- **React Hook Form**: Form state management

### UI/UX Libraries
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **React Hot Toast**: Toast notifications
- **React Quill**: Rich text editor for passages
- **React Beautiful DnD**: Drag and drop for question ordering
- **Recharts**: Charts and analytics
- **Date-fns**: Date manipulation

### Development Tools
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Routing Structure

```
/                           # Dashboard (protected)
/login                      # Admin login page
/tests                      # Tests listing page (protected)
/tests/create               # Create new test (protected)
/tests/:id/edit/reading     # Edit reading sections (protected)
/tests/:id/edit/listening   # Edit listening sections (protected)
/tests/:id/edit/writing     # Edit writing tasks (protected)
/tests/:id/edit/speaking    # Edit speaking parts (protected)
```

## Authentication Flow

### AuthContext Implementation
- JWT token stored in localStorage
- Automatic token inclusion in API requests
- Protected route guards
- User role-based access control

### Login Process
1. Admin enters credentials
2. API call to `/api/auth/login`
3. JWT token received and stored
4. User redirected to dashboard
5. Token automatically included in subsequent requests

## Test Creation Workflow

### Multi-Step Test Creation
1. **Initial Creation**: Basic test metadata (title, description, skills)
2. **Skill-Specific Editing**: Navigate to specific skill editors
3. **Reading Editor**: Add passages and questions
4. **Listening Editor**: Upload audio and create synchronized questions
5. **Writing Editor**: Create Task 1 and Task 2 prompts
6. **Speaking Editor**: Design Part 1, 2, and 3 questions

### Question Type Support
All IELTS question types are supported:
- Multiple choice (single/multiple answers)
- True/False/Not Given
- Fill in the blanks
- Matching headings/features
- Sentence completion
- Short answer questions
- Summary completion
- Note completion
- Diagram labeling

## API Integration

### Axios Configuration
- Base URL: Configurable via environment or defaults to `/api`
- Request timeout: 10 seconds
- Automatic JWT token injection
- Response error handling with toast notifications

### API Endpoints Used
```
POST /api/auth/login        # Admin authentication
GET  /api/auth/me          # Get current user
GET  /api/tests            # Get all tests with pagination
POST /api/tests            # Create new test
GET  /api/tests/:id        # Get test details
PUT  /api/tests/:id        # Update test
DELETE /api/tests/:id      # Delete test
POST /api/tests/:id/duplicate # Duplicate test
POST /api/upload/audio     # Upload audio files
POST /api/upload/image     # Upload images
```

## Tailwind CSS Customization

### Custom Color Palette
- **Primary**: Blue color scale for main UI elements
- **Secondary**: Gray color scale for backgrounds and text
- **Success**: Green for positive actions and states
- **Warning**: Yellow/orange for warnings
- **Error**: Red for errors and validation

### Custom Animations
- **fade-in**: Smooth fade entrance
- **slide-in**: Horizontal slide entrance
- **bounce-in**: Bouncy scale entrance

### Typography
- **Font**: Inter as primary sans-serif font
- **Spacing**: Custom spacing utilities (18, 88, 128)

## Form Management

### React Hook Form Integration
- Client-side validation
- Error handling and display
- Form state management
- Integration with React Query mutations

### Validation Patterns
- Required field validation
- Text length limits
- Number range validation
- Custom validation for test-specific rules

## File Upload System

### Audio Upload (Listening Tests)
- Drag and drop interface
- File type validation (mp3, wav)
- Upload progress indicators
- Audio preview functionality
- Waveform visualization

### Image Upload
- Support for test diagrams and charts
- Automatic image optimization
- Preview before upload
- Alt text management for accessibility

## State Management Patterns

### React Query Usage
- **Queries**: Data fetching with automatic caching
- **Mutations**: Create, update, delete operations
- **Query invalidation**: Refresh data after mutations
- **Loading states**: Automatic loading indicators
- **Error handling**: Centralized error management

### Context Patterns
- AuthContext for global authentication state
- Minimal context usage to avoid performance issues
- Local state for component-specific data

## Component Architecture

### Layout Components
- **Layout**: Main wrapper with sidebar and header
- **Header**: Navigation with user menu and actions
- **Sidebar**: Collapsible navigation menu

### Test Editor Components
- **Modular design**: Separate editors for each skill
- **Reusable question components**: Shared question editing logic
- **Preview components**: Real-time test preview
- **Auto-save functionality**: Prevents data loss

### Common UI Patterns
- Loading states with skeletons
- Error boundaries for graceful error handling
- Toast notifications for user feedback
- Modal dialogs for confirmations

## Performance Optimizations

### Code Splitting
- Route-based code splitting
- Lazy loading of heavy components
- Dynamic imports for editor components

### React Query Optimizations
- 5-minute stale time for cached data
- Aggressive caching for static data
- Background refetching for data freshness

### Image and Asset Optimization
- Automatic image compression
- Lazy loading for images
- Efficient icon usage with Lucide React

## Development Workflow

### Environment Configuration
```env
REACT_APP_API_URL=http://localhost:5002/api
REACT_APP_UPLOADS_URL=http://localhost:5002/uploads
```

### Code Standards
- Functional components with hooks
- JSX file extension for React components
- Consistent file naming (PascalCase for components)
- ESLint configuration from Create React App

### Testing Strategy
- React Testing Library for component tests
- Jest for unit testing
- Integration tests for critical workflows

## Editor-Specific Features

### Reading Test Editor
- Rich text editor for passages
- Question type selector
- Drag-and-drop question ordering
- Real-time word count
- Passage difficulty analysis

### Listening Test Editor
- Audio waveform display
- Timestamp synchronization
- Question timing setup
- Audio quality validation
- Multiple audio section support

### Writing Test Editor
- Task type templates (Task 1: charts/letters, Task 2: essays)
- Evaluation criteria setup
- Sample answer management
- Word count requirements

### Speaking Test Editor
- Part-specific templates
- Timing configuration
- Cue card builder for Part 2
- Topic progression for Part 3
- Recording simulation setup

## Responsive Design

### Breakpoint Strategy
- Mobile-first approach
- Tablet-optimized layout
- Desktop full-feature interface
- Touch-friendly controls

### Accessibility Features
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Focus management
- ARIA labels and descriptions

## Integration with Backend

### Data Synchronization
- Real-time updates via React Query
- Optimistic updates for better UX
- Conflict resolution for concurrent edits
- Auto-save with debounced API calls

### Error Handling
- Network error recovery
- Validation error display
- Graceful degradation
- User-friendly error messages