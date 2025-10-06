# IELTS Client Application

A modern React.js application for students to take IELTS tests online.

## 🚀 Features

### Authentication
- Student registration and login
- JWT-based authentication
- Profile management
- Password reset functionality

### Test Taking
- **Reading Tests**: Interactive reading passages with 9 question types
- **Listening Tests**: Audio-based questions with built-in player
- **Writing Tests**: Task 1 & Task 2 with rich text editor
- **Speaking Tests**: Voice recording for 3-part speaking assessment

### Student Dashboard
- View available tests
- Track progress and scores
- Test history and analytics
- Performance insights

### User Experience
- Responsive design for all devices
- Real-time test timer
- Auto-save functionality
- Intuitive navigation
- Accessibility features

## 🛠️ Tech Stack

- **React.js 18** - UI Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form management
- **React Query** - Data fetching
- **Framer Motion** - Animations
- **Howler.js** - Audio handling
- **Axios** - HTTP client

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## 🔧 Configuration

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_UPLOADS_URL=http://localhost:5001/uploads
```

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Common UI components
│   ├── layout/         # Layout components
│   └── tests/          # Test-taking components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
├── pages/              # Page components
├── services/           # API services
├── types/              # TypeScript types
├── utils/              # Utility functions
└── styles/             # Global styles
```

## 🎯 Key Features

### Reading Tests
- Multiple choice questions
- True/False/Not Given
- Fill in the blanks
- Matching exercises
- Summary completion

### Listening Tests
- Audio player with controls
- Question synchronization
- Replay functionality
- Answer submission

### Writing Tests
- Rich text editor
- Word count tracking
- Auto-save drafts
- Timer management

### Speaking Tests
- Audio recording
- Part-by-part structure
- Preparation time
- Response time limits

## 🔒 Security

- JWT token management
- Protected routes
- Input validation
- XSS protection

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Accessible design patterns

## 🚀 Deployment

The application can be deployed to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Traditional hosting

## 📄 License

This project is proprietary software.
