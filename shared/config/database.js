const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4 // Use IPv4, skip trying IPv6
    });

    console.log(`📚 MongoDB Connected: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    
    // Connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      await mongoose.connection.close();
      console.log('📚 MongoDB connection closed through app termination (SIGTERM)');
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📚 MongoDB connection closed through app termination (SIGINT)');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Log detailed error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error:', error);
    }
    
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;