require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Test = require('../models/Test');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Demo users data
const demoUsers = [
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

// Demo tests data
const demoTests = [
  {
    title: 'IELTS Academic Practice Test #1',
    description: 'A comprehensive practice test covering all four skills with academic-level content.',
    difficulty: 'intermediate',
    status: 'published',
    totalTime: 180,
    tags: ['academic', 'practice', 'full-test'],
    reading: {
      sections: [
        {
          title: 'The History of Photography',
          passage: `Photography, as we know it today, began in the early decades of the 19th century. The word "photography" is derived from the Greek words "photos" (meaning light) and "graphos" (meaning drawing or writing), literally meaning "drawing with light."

The first permanent photograph was created by Joseph Nicéphore Niépce in 1826 or 1827. Using a camera obscura, he captured an image on a pewter plate coated with bitumen of Judea, which hardened when exposed to light. This process, called heliography, required an exposure time of about eight hours.

Louis Daguerre, working with Niépce, developed the daguerreotype process in 1839. This method produced highly detailed images on silver-plated copper sheets and reduced exposure times to just a few minutes. The daguerreotype quickly became popular, especially for portrait photography.

Meanwhile, in England, William Henry Fox Talbot was developing the calotype process, which used paper negatives that could produce multiple positive prints. This concept of negative-to-positive printing became the foundation of modern photography.

The invention of flexible film by George Eastman in 1888 revolutionized photography, making it accessible to amateur photographers. His Kodak camera came pre-loaded with film for 100 exposures, and the entire camera was sent back to the factory for processing.`,
          suggestedTime: 20,
          questions: [
            {
              type: 'multiple_choice_single',
              order: 1,
              content: {
                question: 'What does the word "photography" literally mean?',
                options: [
                  'Light painting',
                  'Drawing with light',
                  'Picture making',
                  'Image creation'
                ],
                correctAnswer: 1,
                explanation: 'Photography comes from Greek words "photos" (light) and "graphos" (drawing), literally meaning "drawing with light".'
              }
            },
            {
              type: 'true_false_not_given',
              order: 2,
              content: {
                statement: 'The first permanent photograph required an exposure time of eight hours.',
                answer: 'True',
                explanation: 'The passage states that Niépce\'s first permanent photograph "required an exposure time of about eight hours".'
              }
            },
            {
              type: 'fill_in_blanks',
              order: 3,
              content: {
                sentence: 'The daguerreotype process was developed by _____ in 1839.',
                correctAnswers: ['Louis Daguerre', 'Daguerre'],
                maxWords: 2,
                explanation: 'Louis Daguerre developed the daguerreotype process in 1839.'
              }
            }
          ]
        }
      ],
      totalTime: 60
    },
    listening: {
      sections: [],
      totalTime: 0
    },
    writing: {
      tasks: [
        {
          taskNumber: 1,
          title: 'Academic Writing Task 1',
          prompt: 'The chart below shows the percentage of households in different income brackets in three countries in 2019.',
          requirements: 'Summarize the information by selecting and reporting the main features, and make comparisons where relevant.',
          timeLimit: 20,
          minWords: 150,
          images: [],
          sampleAnswer: 'The chart illustrates the distribution of household income across three countries in 2019...',
          scoringCriteria: {
            taskAchievement: 'Clear overview with key features identified',
            coherenceCohesion: 'Logical organization with appropriate linking',
            lexicalResource: 'Accurate vocabulary with some range',
            grammaticalRange: 'Mix of simple and complex structures'
          }
        }
      ],
      totalTime: 60
    },
    speaking: {
      parts: [],
      totalTime: 0
    }
  },
  {
    title: 'IELTS General Training Practice Test #1',
    description: 'Practice test focused on general training modules with everyday contexts.',
    difficulty: 'beginner',
    status: 'published',
    totalTime: 120,
    tags: ['general-training', 'beginner', 'practice'],
    reading: {
      sections: [
        {
          title: 'Community Notice Board',
          passage: `COMMUNITY SWIMMING POOL - SUMMER SCHEDULE

Opening Hours:
Monday - Friday: 6:00 AM - 10:00 PM
Saturday - Sunday: 7:00 AM - 9:00 PM

Admission Fees:
Adults: $8.00
Children (under 12): $5.00
Seniors (65+): $6.00
Family Pass (2 adults + 2 children): $22.00

New Member Special:
Join before July 31st and receive 20% off your first month's membership!

Pool Rules:
- No diving in shallow end
- Children under 8 must be accompanied by an adult
- No glass containers in pool area
- Proper swimwear required

Contact Information:
Phone: (555) 123-4567
Email: info@communitypool.com
Address: 123 Pool Lane, Swimtown`,
          suggestedTime: 15,
          questions: [
            {
              type: 'multiple_choice_single',
              order: 1,
              content: {
                question: 'What time does the pool close on weekends?',
                options: [
                  '9:00 PM',
                  '10:00 PM',
                  '8:00 PM',
                  '11:00 PM'
                ],
                correctAnswer: 0,
                explanation: 'The passage states that on Saturday-Sunday, the pool is open from 7:00 AM - 9:00 PM.'
              }
            },
            {
              type: 'fill_in_blanks',
              order: 2,
              content: {
                sentence: 'A family pass for 2 adults and 2 children costs $_____.',
                correctAnswers: ['22.00', '22'],
                maxWords: 1,
                explanation: 'The family pass (2 adults + 2 children) costs $22.00.'
              }
            }
          ]
        }
      ],
      totalTime: 60
    },
    listening: {
      sections: [],
      totalTime: 0
    },
    writing: {
      tasks: [],
      totalTime: 0
    },
    speaking: {
      parts: [],
      totalTime: 0
    }
  },
  {
    title: 'IELTS Reading Skills Test - Advanced',
    description: 'Advanced reading test with complex academic texts and challenging question types.',
    difficulty: 'advanced',
    status: 'draft',
    totalTime: 60,
    tags: ['reading-only', 'advanced', 'academic'],
    reading: {
      sections: [
        {
          title: 'Climate Change and Arctic Ice',
          passage: `The Arctic region is experiencing unprecedented changes due to global warming, with implications that extend far beyond the polar regions. Arctic sea ice has been declining at a rate of approximately 13% per decade since satellite records began in 1979, representing one of the most visible indicators of climate change.

The albedo effect plays a crucial role in this phenomenon. Ice and snow reflect approximately 80-90% of incoming solar radiation back to space, while dark ocean water absorbs about 90% of solar energy. As ice melts, more dark water is exposed, creating a positive feedback loop that accelerates warming and further ice loss.

This transformation has profound ecological consequences. Polar bears, which depend on sea ice for hunting seals, face habitat loss that threatens their survival. The Arctic fox, caribou, and numerous seabird species are similarly affected by changing conditions. Marine ecosystems are also disrupted as the timing of ice formation and melting affects the entire food chain, from phytoplankton to whales.

The economic implications are equally significant. The opening of Arctic shipping routes due to reduced ice cover presents new opportunities for global trade but also raises concerns about environmental protection and territorial disputes. The potential for oil and gas extraction in previously inaccessible areas adds another layer of complexity to Arctic policy discussions.

Furthermore, the loss of Arctic ice contributes to global sea level rise, though not directly through melting sea ice (which is already floating), but through increased melting of land-based ice sheets in Greenland and Antarctica. The disruption of ocean currents, particularly the Gulf Stream, could have far-reaching effects on global weather patterns.`,
          suggestedTime: 20,
          questions: [
            {
              type: 'multiple_choice_single',
              order: 1,
              content: {
                question: 'According to the passage, Arctic sea ice has been declining at what rate per decade?',
                options: [
                  'Approximately 10%',
                  'Approximately 13%',
                  'Approximately 15%',
                  'Approximately 20%'
                ],
                correctAnswer: 1,
                explanation: 'The passage states that Arctic sea ice has been declining at approximately 13% per decade since 1979.'
              }
            },
            {
              type: 'true_false_not_given',
              order: 2,
              content: {
                statement: 'The albedo effect creates a positive feedback loop that slows down ice melting.',
                answer: 'False',
                explanation: 'The passage states that the albedo effect creates a positive feedback loop that accelerates warming and further ice loss, not slows it down.'
              }
            },
            {
              type: 'matching_headings',
              order: 3,
              content: {
                headings: [
                  'Economic opportunities and challenges',
                  'The science behind ice melting',
                  'Effects on Arctic wildlife',
                  'Global consequences of ice loss',
                  'Historical data on ice decline'
                ],
                paragraphs: [
                  'The Arctic region is experiencing unprecedented changes...',
                  'The albedo effect plays a crucial role...',
                  'This transformation has profound ecological consequences...',
                  'The economic implications are equally significant...',
                  'Furthermore, the loss of Arctic ice contributes...'
                ],
                correctMatching: [
                  { paragraphIndex: 0, headingIndex: 4 },
                  { paragraphIndex: 1, headingIndex: 1 },
                  { paragraphIndex: 2, headingIndex: 2 },
                  { paragraphIndex: 3, headingIndex: 0 },
                  { paragraphIndex: 4, headingIndex: 3 }
                ],
                explanation: 'Each paragraph matches with its corresponding heading based on the main topic discussed.'
              }
            }
          ]
        }
      ],
      totalTime: 60
    },
    listening: {
      sections: [],
      totalTime: 0
    },
    writing: {
      tasks: [],
      totalTime: 0
    },
    speaking: {
      parts: [],
      totalTime: 0
    }
  }
];

// Seed users
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    // Create demo users
    const users = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.email}`);
    }
    
    return users;
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
};

// Seed tests
const seedTests = async (users) => {
  try {
    // Clear existing tests
    await Test.deleteMany({});
    
    // Create demo tests
    const contentManager = users.find(u => u.role === 'content_manager');
    
    for (const testData of demoTests) {
      const test = new Test({
        ...testData,
        createdBy: contentManager._id,
        lastModifiedBy: contentManager._id
      });
      await test.save();
      console.log(`Created test: ${test.title}`);
    }
    
    console.log('Demo tests created successfully');
  } catch (error) {
    console.error('Error seeding tests:', error);
    throw error;
  }
};

// Main seeding function
const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    const users = await seedUsers();
    await seedTests(users);
    
    console.log('Database seeding completed successfully!');
    
    console.log('\n--- Demo Credentials ---');
    console.log('Super Admin: admin@ielts.com / Admin123');
    console.log('Content Manager: manager@ielts.com / Manager123');
    console.log('Examiner: examiner@ielts.com / Examiner123');
    console.log('------------------------\n');
    
  } catch (error) {
    console.error('Database seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase }; 