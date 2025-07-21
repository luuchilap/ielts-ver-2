# IELTS Client Application Setup Guide

## Prerequisites

Before setting up the client application, ensure you have:

1. **Node.js** (v16 or higher)
2. **npm** or **yarn** package manager
3. **Git** for version control
4. **Backend API** running (from the admin folder)

## Installation Steps

### 1. Navigate to Client Directory
```bash
cd d:\ielts_ver_2\client
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- React 18 with TypeScript
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls
- React Query for state management
- Audio libraries for listening/speaking tests
- Form handling libraries

### 3. Install Missing Tailwind CSS Plugins
```bash
npm install -D @tailwindcss/forms @tailwindcss/typography @tailwindcss/aspect-ratio
```

### 4. Environment Configuration

Create a `.env` file in the client root directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_UPLOADS_URL=http://localhost:5000/uploads
REACT_APP_APP_NAME=IELTS Test Platform
REACT_APP_VERSION=1.0.0
```

### 5. Start Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

## Project Structure Overview

```
client/
├── public/                 # Static files
│   ├── index.html         # Main HTML template
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/         # Authentication components
│   │   ├── common/       # Common components (Button, Input)
│   │   ├── layout/       # Layout components
│   │   └── tests/        # Test-taking components
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.tsx
│   │   └── TestContext.tsx
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Page components
│   │   ├── auth/         # Login/Register pages
│   │   ├── dashboard/    # Dashboard
│   │   ├── tests/        # Test pages
│   │   ├── results/      # Results pages
│   │   └── profile/      # Profile page
│   ├── services/         # API services
│   │   └── api.ts        # Main API configuration
│   ├── types/            # TypeScript definitions
│   │   └── index.ts      # All type definitions
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main app component
│   ├── index.tsx         # App entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

## Available Scripts

### Development
```bash
npm start          # Start development server
npm run dev        # Alternative start command
```

### Building
```bash
npm run build      # Create production build
npm run test       # Run tests
npm run eject      # Eject from Create React App (not recommended)
```

## Key Features Implemented

### 1. Routing System
- Public routes (Home, Login, Register)
- Protected routes (Dashboard, Tests, Results, Profile)
- 404 error handling
- Route guards for authentication

### 2. Authentication Flow
- JWT-based authentication
- Context-based state management
- Automatic token refresh
- Protected route access

### 3. UI Components
- Responsive design with Tailwind CSS
- Modern component library
- Accessibility features
- Mobile-first approach

### 4. Test Taking Interface
- Timer management
- Progress tracking
- Auto-save functionality
- Multi-skill support (Reading, Listening, Writing, Speaking)

## Integration with Backend

The client application is designed to work with the backend API from the admin folder:

### API Endpoints Used
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
GET  /api/auth/me            # Get current user
GET  /api/tests              # Get available tests
POST /api/tests/:id/start    # Start a test
PUT  /api/submissions/:id    # Save progress
POST /api/submissions/:id/submit # Submit test
```

### CORS Configuration
Ensure the backend allows requests from `http://localhost:3000` in development.

## Customization

### Styling
- Modify `tailwind.config.js` for theme customization
- Update color schemes in the config
- Add custom components in `src/index.css`

### API Configuration
- Update API base URL in `src/services/api.ts`
- Modify request/response interceptors
- Add new API endpoints as needed

### Features
- Add new test question types in `src/types/index.ts`
- Implement additional components in `src/components/`
- Create new pages in `src/pages/`

## Troubleshooting

### Common Issues

1. **Module not found errors**
   ```bash
   npm install  # Reinstall dependencies
   ```

2. **TypeScript errors**
   - Check `tsconfig.json` configuration
   - Ensure all type definitions are imported

3. **Tailwind CSS not working**
   ```bash
   npm run build  # Rebuild to regenerate CSS
   ```

4. **API connection issues**
   - Verify backend is running on port 5000
   - Check CORS configuration
   - Validate API endpoints

### Development Tips

1. **Hot Reload**: The development server supports hot reloading
2. **DevTools**: Install React Developer Tools browser extension
3. **API Testing**: Use the browser's Network tab to debug API calls
4. **State Debugging**: React Query Devtools are enabled in development

## Next Steps

After setting up the client:

1. **Complete Authentication Forms**: Implement login/register form validation
2. **Test Interface**: Build the complete test-taking interface
3. **Dashboard**: Create student dashboard with analytics
4. **Results**: Implement detailed results and scoring
5. **Profile Management**: Build user profile editing features

## Production Deployment

For production deployment:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy static files** to your hosting provider:
   - Vercel (recommended)
   - Netlify
   - AWS S3 + CloudFront
   - Traditional web hosting

3. **Environment variables**: Update production API URLs

4. **Domain setup**: Configure custom domain and SSL

## Support

For technical support or questions about the client implementation:
- Check the PROJECT_GUIDE.md for detailed architecture
- Review the backend API documentation
- Test API endpoints with the admin panel first

The client application provides a solid foundation for the IELTS test platform with modern React practices, TypeScript safety, and responsive design.
