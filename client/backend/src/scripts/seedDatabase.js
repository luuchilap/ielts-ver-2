require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Test = require('../models/Test');
const TestSubmission = require('../models/TestSubmission');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('📚 MongoDB Connected for seeding');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Sample users data
const sampleUsers = [
  {
    email: 'john.doe@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    country: 'United States',
    targetScore: 7.5,
    level: 'Intermediate',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'America/New_York',
      notifications: {
        email: true,
        testReminders: true,
        progressUpdates: true
      }
    }
  },
  {
    email: 'jane.smith@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    country: 'Canada',
    targetScore: 8.0,
    level: 'Advanced',
    isEmailVerified: true,
    preferences: {
      language: 'en',
      timezone: 'America/Toronto',
      notifications: {
        email: true,
        testReminders: false,
        progressUpdates: true
      }
    }
  },
  {
    email: 'alex.chen@example.com',
    password: 'password123',
    firstName: 'Alex',
    lastName: 'Chen',
    country: 'China',
    targetScore: 6.5,
    level: 'Beginner',
    isEmailVerified: true,
    preferences: {
      language: 'zh',
      timezone: 'Asia/Shanghai',
      notifications: {
        email: true,
        testReminders: true,
        progressUpdates: true
      }
    }
  }
];

// Sample tests data
const sampleTests = [
  {
    title: 'IELTS Practice Test - Academic Reading',
    description: 'A comprehensive academic reading test with three passages covering various topics including science, history, and social issues.',
    difficulty: 'Intermediate',
    duration: 60, // minutes
    skills: ['Reading'],
    category: 'Academic',
    status: 'active',
    isPublic: true,
    isFeatured: true,
    tags: ['reading', 'academic', 'practice'],
    readingSections: [
      {
        title: 'Climate Change and Arctic Ice',
        passage: `The Arctic region has been experiencing unprecedented changes due to global warming. Scientists have observed a dramatic reduction in sea ice coverage over the past three decades, with some areas showing ice loss rates of up to 13% per decade. This phenomenon has far-reaching consequences not only for the Arctic ecosystem but also for global weather patterns and sea levels.

The loss of Arctic sea ice creates a feedback loop known as the albedo effect. Ice and snow reflect sunlight back into space, but when they melt, they expose darker ocean water that absorbs more heat. This absorption leads to further warming and more ice loss, accelerating the entire process.

Marine life in the Arctic has been severely affected by these changes. Polar bears, which depend on sea ice for hunting seals, have been forced to swim longer distances between ice floes. Many bears have been observed to be undernourished, and cub survival rates have declined significantly in some populations.

The implications extend beyond the Arctic. The melting of Arctic ice contributes to global sea level rise, though to a lesser extent than the melting of land-based ice sheets in Greenland and Antarctica. More significantly, the changing Arctic conditions affect the jet stream, the high-altitude wind current that influences weather patterns across the Northern Hemisphere.`,
        suggestedTime: 20,
        order: 1,
        questions: [
          {
            type: 'multiple_choice_single',
            order: 1,
            content: {
              question: 'According to the passage, what is the albedo effect?',
              options: [
                'The reflection of sunlight by ice and snow',
                'A feedback loop where ice loss leads to more warming',
                'The absorption of heat by ocean water',
                'The impact of Arctic changes on global weather'
              ],
              correctAnswer: 1,
              explanation: 'The albedo effect is described as a feedback loop where melting ice exposes darker water that absorbs more heat, leading to further warming and ice loss.'
            }
          },
          {
            type: 'true_false_not_given',
            order: 2,
            content: {
              statement: 'Polar bear cub survival rates have improved in recent years.',
              answer: 'False',
              explanation: 'The passage states that cub survival rates have declined significantly in some populations.'
            }
          },
          {
            type: 'fill_in_blanks',
            order: 3,
            content: {
              sentence: 'Scientists have observed ice loss rates of up to _____ per decade in some Arctic areas.',
              correctAnswers: ['13%', '13 percent', 'thirteen percent'],
              maxWords: 2,
              explanation: 'The passage specifically mentions "ice loss rates of up to 13% per decade".'
            }
          }
        ]
      }
    ],
    settings: {
      allowReview: true,
      showCorrectAnswers: true,
      allowPause: true,
      shuffleQuestions: false,
      passingScore: 6.0
    }
  },
  {
    title: 'IELTS Practice Test - General Listening',
    description: 'A general training listening test featuring everyday conversations and situations you might encounter in an English-speaking environment.',
    difficulty: 'Beginner',
    duration: 40,
    skills: ['Listening'],
    category: 'General Training',
    status: 'active',
    isPublic: true,
    isFeatured: false,
    tags: ['listening', 'general', 'conversation'],
    listeningSections: [
      {
        title: 'Booking a Hotel Room',
        audioUrl: '/uploads/audio/listening/hotel_booking.mp3',
        transcript: 'Receptionist: Good morning, Grand Hotel. How can I help you?\nCustomer: Hi, I\'d like to book a room for next weekend, please.\nReceptionist: Certainly. What dates are you looking at?\nCustomer: Friday the 15th to Sunday the 17th. Two nights.\nReceptionist: Perfect. Would you prefer a single or double room?\nCustomer: A double room, please. With a sea view if possible.\nReceptionist: I have a lovely double room with ocean view available. That would be $180 per night.\nCustomer: That sounds good. Can I also ask about breakfast?\nReceptionist: Breakfast is included in the rate. It\'s served from 7 AM to 10 AM in our restaurant.\nCustomer: Excellent. I\'ll take it.',
        suggestedTime: 15,
        order: 1,
        questions: [
          {
            type: 'fill_in_blanks',
            order: 1,
            timestamp: 25,
            content: {
              sentence: 'The customer wants to book a room from Friday the _____ to Sunday the 17th.',
              correctAnswers: ['15th', 'fifteenth', '15'],
              maxWords: 1,
              explanation: 'The customer specifically mentions "Friday the 15th to Sunday the 17th".'
            }
          },
          {
            type: 'multiple_choice_single',
            order: 2,
            timestamp: 45,
            content: {
              question: 'How much does the room cost per night?',
              options: ['$150', '$170', '$180', '$200'],
              correctAnswer: 2,
              explanation: 'The receptionist states "That would be $180 per night".'
            }
          }
        ]
      }
    ],
    settings: {
      allowReview: true,
      showCorrectAnswers: true,
      allowPause: false,
      passingScore: 5.5
    }
  },
  {
    title: 'IELTS Mock Test - Full Academic',
    description: 'A complete IELTS Academic test including Reading, Listening, Writing, and Speaking sections. Perfect for exam preparation.',
    difficulty: 'Advanced',
    duration: 180, // 3 hours
    skills: ['Reading', 'Listening', 'Writing', 'Speaking'],
    category: 'Mock Test',
    status: 'active',
    isPublic: true,
    isFeatured: true,
    tags: ['mock', 'full-test', 'academic', 'comprehensive'],
    writingTasks: [
      {
        taskNumber: 1,
        prompt: 'The chart below shows the percentage of households with different types of internet connection in three countries in 2010 and 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
        imageUrl: '/uploads/images/charts/internet_connection_chart.png',
        requirements: 'Write at least 150 words. You should spend about 20 minutes on this task.',
        suggestedTime: 20,
        wordLimit: {
          min: 150,
          max: 200
        },
        criteria: [
          {
            name: 'Task Achievement',
            description: 'How well you address the task requirements',
            maxScore: 9
          },
          {
            name: 'Coherence and Cohesion',
            description: 'Organization and logical flow of ideas',
            maxScore: 9
          },
          {
            name: 'Lexical Resource',
            description: 'Range and accuracy of vocabulary',
            maxScore: 9
          },
          {
            name: 'Grammatical Range and Accuracy',
            description: 'Range and accuracy of grammar',
            maxScore: 9
          }
        ]
      },
      {
        taskNumber: 2,
        prompt: 'Some people believe that technology has made our lives more complicated, while others think it has made life easier. Discuss both views and give your own opinion.',
        requirements: 'Write at least 250 words. You should spend about 40 minutes on this task.',
        suggestedTime: 40,
        wordLimit: {
          min: 250,
          max: 350
        },
        criteria: [
          {
            name: 'Task Response',
            description: 'How well you address the task and develop arguments',
            maxScore: 9
          },
          {
            name: 'Coherence and Cohesion',
            description: 'Organization and logical flow of ideas',
            maxScore: 9
          },
          {
            name: 'Lexical Resource',
            description: 'Range and accuracy of vocabulary',
            maxScore: 9
          },
          {
            name: 'Grammatical Range and Accuracy',
            description: 'Range and accuracy of grammar',
            maxScore: 9
          }
        ]
      }
    ],
    speakingParts: [
      {
        partNumber: 1,
        title: 'Introduction and Interview',
        instructions: 'In this part, the examiner will ask you general questions about yourself and a range of familiar topics.',
        questions: [
          {
            question: 'Can you tell me your full name, please?'
          },
          {
            question: 'What should I call you?'
          },
          {
            question: 'Where are you from?'
          },
          {
            question: 'Do you work or are you a student?'
          },
          {
            question: 'What do you like most about your hometown?'
          }
        ],
        preparationTime: 0,
        speakingTime: 300 // 5 minutes
      },
      {
        partNumber: 2,
        title: 'Long Turn',
        instructions: 'You will be given a topic and you will have 1 minute to prepare. Then you will speak for 1-2 minutes.',
        questions: [
          {
            question: 'Describe a memorable journey you have taken.',
            cueCard: `Describe a memorable journey you have taken.

You should say:
• where you went
• how you traveled
• who you went with
• and explain why this journey was memorable for you.`
          }
        ],
        preparationTime: 60,
        speakingTime: 120 // 2 minutes
      },
      {
        partNumber: 3,
        title: 'Discussion',
        instructions: 'In this part, the examiner will ask you questions related to the topic in Part 2.',
        questions: [
          {
            question: 'How do you think travel has changed over the past 50 years?',
            followUpQuestions: [
              'What are the advantages and disadvantages of modern travel?',
              'Do you think space tourism will become popular in the future?'
            ]
          }
        ],
        preparationTime: 0,
        speakingTime: 300 // 5 minutes
      }
    ],
    settings: {
      allowReview: false,
      showCorrectAnswers: false,
      allowPause: false,
      passingScore: 6.5
    }
  }
];

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Test.deleteMany({});
    await TestSubmission.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Seed users
const seedUsers = async () => {
  try {
    const users = [];
    
    for (const userData of sampleUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      users.push({
        ...userData,
        password: hashedPassword
      });
    }
    
    const createdUsers = await User.insertMany(users);
    console.log(`👥 Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error);
    return [];
  }
};

// Seed tests
const seedTests = async (users) => {
  try {
    const tests = sampleTests.map(testData => ({
      ...testData,
      createdBy: users[0]._id // Assign first user as creator
    }));
    
    const createdTests = await Test.insertMany(tests);
    console.log(`📝 Created ${createdTests.length} tests`);
    return createdTests;
  } catch (error) {
    console.error('Error seeding tests:', error);
    return [];
  }
};

// Seed sample submissions
const seedSubmissions = async (users, tests) => {
  try {
    const submissions = [];
    
    // Create some sample completed submissions
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const test = tests[Math.floor(Math.random() * tests.length)];
      
      // Create a few submissions per user
      for (let j = 0; j < 2; j++) {
        const submission = new TestSubmission({
          testId: test._id,
          userId: user._id,
          status: 'completed',
          startTime: new Date(Date.now() - (j + 1) * 7 * 24 * 60 * 60 * 1000), // Past weeks
          endTime: new Date(Date.now() - (j + 1) * 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
          totalTimeSpent: 7200 + Math.random() * 1800, // 2-2.5 hours
          scores: {
            reading: 5.5 + Math.random() * 3, // 5.5-8.5
            listening: 5 + Math.random() * 3.5, // 5-8.5
            writing: 5 + Math.random() * 3, // 5-8
            speaking: 5.5 + Math.random() * 2.5, // 5.5-8
            overall: 5.5 + Math.random() * 2.5 // 5.5-8
          },
          results: {
            totalQuestions: test.totalQuestions || 40,
            correctAnswers: Math.floor((test.totalQuestions || 40) * (0.6 + Math.random() * 0.3)) // 60-90% correct
          }
        });
        
        submissions.push(submission);
      }
    }
    
    const createdSubmissions = await TestSubmission.insertMany(submissions);
    console.log(`📊 Created ${createdSubmissions.length} test submissions`);
    return createdSubmissions;
  } catch (error) {
    console.error('Error seeding submissions:', error);
    return [];
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDB();
    await clearData();
    
    const users = await seedUsers();
    const tests = await seedTests(users);
    const submissions = await seedSubmissions(users, tests);
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Users: ${users.length}`);
    console.log(`   Tests: ${tests.length}`);
    console.log(`   Submissions: ${submissions.length}`);
    console.log('\n🔐 Test login credentials:');
    console.log('   Email: john.doe@example.com');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('📚 Database connection closed');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
