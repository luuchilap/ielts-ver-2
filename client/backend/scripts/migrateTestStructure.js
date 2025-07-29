const mongoose = require('mongoose');
require('dotenv').config();

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ielts_client');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test model - simple schema for migration
const testSchema = new mongoose.Schema({}, { strict: false });
const Test = mongoose.model('Test', testSchema);

async function migrateTestStructures() {
  try {
    console.log('Starting test structure migration...');
    
    // Find all tests
    const tests = await Test.find({});
    console.log(`Found ${tests.length} tests to process`);
    
    let updateCount = 0;
    
    for (const test of tests) {
      let needsUpdate = false;
      const updateData = {};
      
      // Migrate reading sections
      if (test.reading && test.reading.sections && (!test.readingSections || test.readingSections.length === 0)) {
        updateData.readingSections = test.reading.sections;
        needsUpdate = true;
        console.log(`Adding readingSections to test: ${test.title}`);
      }
      
      // Migrate listening sections
      if (test.listening && test.listening.sections && (!test.listeningSections || test.listeningSections.length === 0)) {
        updateData.listeningSections = test.listening.sections;
        needsUpdate = true;
        console.log(`Adding listeningSections to test: ${test.title}`);
      }
      
      // Migrate writing tasks
      if (test.writing && test.writing.tasks && (!test.writingTasks || test.writingTasks.length === 0)) {
        updateData.writingTasks = test.writing.tasks;
        needsUpdate = true;
        console.log(`Adding writingTasks to test: ${test.title}`);
      }
      
      // Migrate speaking parts
      if (test.speaking && test.speaking.parts && (!test.speakingParts || test.speakingParts.length === 0)) {
        updateData.speakingParts = test.speaking.parts;
        needsUpdate = true;
        console.log(`Adding speakingParts to test: ${test.title}`);
      }
      
      // Also migrate in the opposite direction - from flat to legacy structure
      if (test.readingSections && test.readingSections.length > 0 && (!test.reading || !test.reading.sections || test.reading.sections.length === 0)) {
        updateData.reading = {
          sections: test.readingSections,
          totalTime: test.readingSections.reduce((total, section) => total + (section.suggestedTime || 20), 0)
        };
        needsUpdate = true;
        console.log(`Adding reading.sections to test: ${test.title}`);
      }
      
      if (test.listeningSections && test.listeningSections.length > 0 && (!test.listening || !test.listening.sections || test.listening.sections.length === 0)) {
        updateData.listening = {
          sections: test.listeningSections,
          totalTime: test.listeningSections.reduce((total, section) => total + (section.suggestedTime || 10), 0)
        };
        needsUpdate = true;
        console.log(`Adding listening.sections to test: ${test.title}`);
      }
      
      if (test.writingTasks && test.writingTasks.length > 0 && (!test.writing || !test.writing.tasks || test.writing.tasks.length === 0)) {
        updateData.writing = {
          tasks: test.writingTasks,
          totalTime: test.writingTasks.reduce((total, task) => total + (task.suggestedTime || task.timeLimit || 30), 0)
        };
        needsUpdate = true;
        console.log(`Adding writing.tasks to test: ${test.title}`);
      }
      
      if (test.speakingParts && test.speakingParts.length > 0 && (!test.speaking || !test.speaking.parts || test.speaking.parts.length === 0)) {
        updateData.speaking = {
          parts: test.speakingParts,
          totalTime: test.speakingParts.reduce((total, part) => total + (part.timeLimit || 5), 0)
        };
        needsUpdate = true;
        console.log(`Adding speaking.parts to test: ${test.title}`);
      }
      
      // Update the test if needed
      if (needsUpdate) {
        await Test.findByIdAndUpdate(test._id, updateData);
        updateCount++;
        console.log(`✓ Updated test: ${test.title}`);
      }
    }
    
    console.log(`\nMigration completed! Updated ${updateCount} tests.`);
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run migration
(async () => {
  await connectDB();
  await migrateTestStructures();
})();
