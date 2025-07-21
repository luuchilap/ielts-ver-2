import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Clock,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user, canManageContent } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [stats, setStats] = useState({
    totalTests: 0,
    totalUsers: 0,
    completedTests: 0,
    averageScore: 0
  });

  // Mock data for charts
  const chartData = [
    { name: 'Mon', tests: 12, users: 8 },
    { name: 'Tue', tests: 19, users: 12 },
    { name: 'Wed', tests: 15, users: 10 },
    { name: 'Thu', tests: 22, users: 15 },
    { name: 'Fri', tests: 18, users: 13 },
    { name: 'Sat', tests: 25, users: 18 },
    { name: 'Sun', tests: 20, users: 14 }
  ];

  const skillsData = [
    { name: 'Reading', value: 35, color: '#3b82f6' },
    { name: 'Listening', value: 28, color: '#10b981' },
    { name: 'Writing', value: 22, color: '#f59e0b' },
    { name: 'Speaking', value: 15, color: '#ef4444' }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'test_created',
      title: 'New Reading Test Created',
      description: 'IELTS Academic Reading Practice Test #15',
      time: '2 minutes ago',
      user: 'John Smith'
    },
    {
      id: 2,
      type: 'user_registered',
      title: 'New User Registered',
      description: 'Sarah Johnson joined as examiner',
      time: '1 hour ago',
      user: 'System'
    },
    {
      id: 3,
      type: 'test_completed',
      title: 'Test Session Completed',
      description: 'Student completed Listening Test #8',
      time: '3 hours ago',
      user: 'Alice Brown'
    },
    {
      id: 4,
      type: 'test_published',
      title: 'Test Published',
      description: 'Speaking Test #12 is now live',
      time: '5 hours ago',
      user: 'Mike Wilson'
    }
  ];

  useEffect(() => {
    // Mock API call to fetch stats
    setStats({
      totalTests: 156,
      totalUsers: 89,
      completedTests: 1247,
      averageScore: 6.8
    });
  }, [timeRange]);

  const StatCard = ({ icon: Icon, title, value, change, changeType, color }) => (
    <div className="card">
      <div className="card-content">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-secondary-600">{title}</p>
            <p className="text-2xl font-bold text-secondary-900">{value}</p>
            {change && (
              <div className={`flex items-center mt-1 text-sm ${
                changeType === 'increase' ? 'text-success-600' : 'text-error-600'
              }`}>
                {changeType === 'increase' ? (
                  <ArrowUpRight className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 mr-1" />
                )}
                {change}
              </div>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-secondary-600">
            Here's what's happening with your IELTS tests today.
          </p>
        </div>
        
        {canManageContent() && (
          <button className="btn btn-primary btn-md">
            <Plus className="w-4 h-4 mr-2" />
            Create New Test
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={FileText}
          title="Total Tests"
          value={stats.totalTests}
          change="+12%"
          changeType="increase"
          color="bg-primary-500"
        />
        <StatCard
          icon={Users}
          title="Active Users"
          value={stats.totalUsers}
          change="+8%"
          changeType="increase"
          color="bg-success-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Completed Tests"
          value={stats.completedTests.toLocaleString()}
          change="+23%"
          changeType="increase"
          color="bg-warning-500"
        />
        <StatCard
          icon={Clock}
          title="Average Score"
          value={stats.averageScore}
          change="-2%"
          changeType="decrease"
          color="bg-error-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="card-title">Test Activity</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-secondary-300 rounded-md px-3 py-1"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="tests" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Tests Created"
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="New Users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Tests by Skill</h3>
          </div>
          <div className="card-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={skillsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {skillsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        {canManageContent() && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Quick Actions</h3>
            </div>
            <div className="card-content space-y-3">
              <button className="w-full btn btn-outline btn-md justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Create Reading Test
              </button>
              <button className="w-full btn btn-outline btn-md justify-start">
                <Headphones className="w-4 h-4 mr-2" />
                Create Listening Test
              </button>
              <button className="w-full btn btn-outline btn-md justify-start">
                <PenTool className="w-4 h-4 mr-2" />
                Create Writing Test
              </button>
              <button className="w-full btn btn-outline btn-md justify-start">
                <Mic className="w-4 h-4 mr-2" />
                Create Speaking Test
              </button>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className={`card ${canManageContent() ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div className="card-header">
            <div className="flex items-center justify-between">
              <h3 className="card-title">Recent Activity</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      {activity.type === 'test_created' && <FileText className="w-4 h-4 text-primary-600" />}
                      {activity.type === 'user_registered' && <Users className="w-4 h-4 text-success-600" />}
                      {activity.type === 'test_completed' && <TrendingUp className="w-4 h-4 text-warning-600" />}
                      {activity.type === 'test_published' && <Eye className="w-4 h-4 text-error-600" />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900">
                      {activity.title}
                    </p>
                    <p className="text-sm text-secondary-600">
                      {activity.description}
                    </p>
                    <p className="text-xs text-secondary-400 mt-1">
                      {activity.time} • by {activity.user}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 