require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema (inline to avoid import issues)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  role: { type: String, enum: ['super_admin', 'content_manager', 'examiner'], default: 'content_manager' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function createUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    const users = [
      {
        email: 'admin@ielts.com',
        password: 'Admin123',
        firstName: 'System',
        lastName: 'Administrator',
        role: 'super_admin',
        isActive: true
      },
      {
        email: 'manager@ielts.com',
        password: 'Manager123',
        firstName: 'Content',
        lastName: 'Manager',
        role: 'content_manager',
        isActive: true
      },
      {
        email: 'examiner@ielts.com',
        password: 'Examiner123',
        firstName: 'Test',
        lastName: 'Examiner',
        role: 'examiner',
        isActive: true
      }
    ];

    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email}`);
    }

    console.log('All demo users created successfully!');
    console.log('\nDemo Credentials:');
    console.log('Super Admin: admin@ielts.com / Admin123');
    console.log('Content Manager: manager@ielts.com / Manager123');
    console.log('Examiner: examiner@ielts.com / Examiner123');

  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

createUsers(); 