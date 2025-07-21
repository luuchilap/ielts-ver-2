import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic, 
  Target, 
  Users, 
  Award,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Reading Tests',
      description: 'Practice with authentic IELTS reading passages and 9 different question types.',
      color: 'text-blue-600'
    },
    {
      icon: Headphones,
      title: 'Listening Tests',
      description: 'Improve your listening skills with high-quality audio recordings.',
      color: 'text-green-600'
    },
    {
      icon: PenTool,
      title: 'Writing Practice',
      description: 'Master both Task 1 and Task 2 with guided writing exercises.',
      color: 'text-purple-600'
    },
    {
      icon: Mic,
      title: 'Speaking Assessment',
      description: 'Record your responses and get feedback on your speaking performance.',
      color: 'text-red-600'
    }
  ];

  const benefits = [
    'Authentic IELTS test format',
    'Detailed performance analytics',
    'Instant feedback and explanations',
    'Progress tracking',
    'Mobile-friendly interface',
    'Expert-designed content'
  ];

  const stats = [
    { number: '50+', label: 'Practice Tests' },
    { number: '10k+', label: 'Students' },
    { number: '95%', label: 'Success Rate' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Master IELTS with
                <span className="block text-gradient bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                  Confidence
                </span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Prepare for your IELTS exam with our comprehensive online platform. 
                Practice all four skills with authentic test materials and get instant feedback.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                        Start Free Trial
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/tests">
                      <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white/10">
                        Browse Tests
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                      <div className="text-blue-200 text-sm">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Complete IELTS Preparation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practice all four IELTS skills with our comprehensive testing platform designed by experts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`inline-flex p-3 rounded-lg bg-gray-50 ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Why Choose Our Platform?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Our IELTS preparation platform is designed to give you the best possible 
                chance of achieving your target score with comprehensive practice materials 
                and expert guidance.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-blue-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary-100 p-3 rounded-lg">
                    <Target className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Personalized Learning</h3>
                    <p className="text-gray-600 text-sm">Tailored practice based on your performance</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expert Support</h3>
                    <p className="text-gray-600 text-sm">Get help from IELTS professionals</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Proven Results</h3>
                    <p className="text-gray-600 text-sm">High success rate among our students</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your IELTS Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of students who have achieved their target IELTS score with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/tests">
                  <Button variant="secondary" size="lg" className="border-white text-white hover:bg-white/10">
                    Try Sample Test
                  </Button>
                </Link>
              </>
            )}
            {isAuthenticated && (
              <Link to="/tests">
                <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                  Start Practicing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
