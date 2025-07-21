# IELTS Admin Management System

A comprehensive admin panel for managing IELTS tests and users, built with React.js (Frontend) and Node.js (Backend) with MongoDB database.

## 🚀 Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Super Admin, Content Manager, Examiner)
- Secure login/logout functionality

### Dashboard
- Real-time statistics and analytics
- Interactive charts and graphs
- Recent activity tracking
- Quick actions for test creation

### Test Management
- **Reading Tests**: 9 different question types
- **Listening Tests**: Audio-based questions
- **Writing Tests**: Task 1 & Task 2 management
- **Speaking Tests**: 3-part speaking assessment

### User Management
- User creation and management
- Role assignment
- Activity tracking

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - UI Framework
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Hook Form** - Form management
- **React Query** - Data fetching
- **Recharts** - Data visualization
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd ielts-admin-system
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Setup

Create a `.env` file in the `backend` directory:
```env
# Database
MONGODB_URI=mongodb://localhost:27017/ielts_admin

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000
```

### 4. Start the application

#### Development Mode (Both servers)
```bash
# From root directory
npm run dev
```

#### Or start individually
```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm start
```

## 🔑 Default Credentials

For testing purposes, you can create these demo users:

- **Super Admin**: admin@ielts.com / Admin123
- **Content Manager**: manager@ielts.com / Manager123  
- **Examiner**: examiner@ielts.com / Examiner123

## 📱 Usage

1. **Access the application**: Open http://localhost:3000
2. **Login**: Use demo credentials or create new users
3. **Dashboard**: View statistics and recent activities
4. **Test Management**: Create and manage IELTS tests
5. **User Management**: Manage users and roles (Super Admin only)

## 🏗️ Project Structure

```
ielts-admin-system/
├── frontend/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── dashboard/   # Dashboard components
│   │   │   └── layout/      # Layout components
│   │   ├── contexts/        # React contexts
│   │   ├── services/        # API services
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/                  # Node.js backend
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Custom middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   └── server.js        # Server entry point
│   ├── package.json
│   └── env.example
├── package.json              # Root package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration (Super Admin only)
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - User logout

### Tests (Coming Soon)
- `GET /api/tests` - Get all tests
- `POST /api/tests` - Create new test
- `GET /api/tests/:id` - Get test by ID
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test

## 🎯 Development Roadmap

### Phase 1: Foundation ✅
- [x] Authentication system
- [x] Basic dashboard
- [x] User management
- [x] Project structure

### Phase 2: Test Management (In Progress)
- [ ] Reading test creation
- [ ] Question type implementations
- [ ] Rich text editor integration
- [ ] Drag & drop functionality

### Phase 3: Advanced Features
- [ ] Listening test management
- [ ] Writing test management
- [ ] Speaking test management
- [ ] File upload handling

### Phase 4: Analytics & Reports
- [ ] Advanced analytics
- [ ] Test performance reports
- [ ] User activity tracking
- [ ] Export functionality

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@ielts-admin.com or create an issue in the repository.

---

**Built with ❤️ for IELTS educators and administrators** 