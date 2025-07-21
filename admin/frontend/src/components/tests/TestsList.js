import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Copy, 
  Trash2, 
  MoreVertical,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  Clock,
  User,
  Calendar,
  Volume2
} from 'lucide-react';
import { testsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const TestsList = () => {
  const { canManageContent } = useAuth();
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    difficulty: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch tests with react-query
  const { 
    data: testsData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery(
    ['tests', filters],
    () => testsAPI.getAll(filters),
    {
      keepPreviousData: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const tests = testsData?.data?.data?.tests || [];
  const pagination = testsData?.data?.data?.pagination || {};

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setFilters(prev => ({
      ...prev,
      search: value,
      page: 1
    }));
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle duplicate test
  const handleDuplicate = async (testId) => {
    try {
      await testsAPI.duplicate(testId);
      toast.success('Test duplicated successfully');
      refetch();
    } catch (error) {
      toast.error('Failed to duplicate test');
    }
  };

  // Handle delete test
  const handleDelete = async (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await testsAPI.delete(testId);
        toast.success('Test deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete test');
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (testId, newStatus) => {
    try {
      await testsAPI.changeStatus(testId, newStatus);
      toast.success(`Test ${newStatus} successfully`);
      refetch();
    } catch (error) {
      toast.error(`Failed to ${newStatus} test`);
    }
  };

  // Get skill icons
  const getSkillIcons = (test) => {
    const icons = [];
    if (test.reading?.sections?.length > 0) {
      icons.push(<BookOpen key="reading" className="w-4 h-4 text-blue-500" title="Reading" />);
    }
    if (test.listening?.sections?.length > 0) {
      icons.push(<Headphones key="listening" className="w-4 h-4 text-green-500" title="Listening" />);
    }
    if (test.writing?.tasks?.length > 0) {
      icons.push(<PenTool key="writing" className="w-4 h-4 text-yellow-500" title="Writing" />);
    }
    if (test.speaking?.parts?.length > 0) {
      icons.push(<Mic key="speaking" className="w-4 h-4 text-red-500" title="Speaking" />);
    }
    return icons;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      draft: 'bg-secondary-100 text-secondary-800',
      published: 'bg-success-100 text-success-800',
      archived: 'bg-warning-100 text-warning-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get difficulty badge
  const getDifficultyBadge = (difficulty) => {
    const badges = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[difficulty]}`}>
        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center">
          <p className="text-error-600">Failed to load tests</p>
          <button 
            onClick={() => refetch()}
            className="mt-2 btn btn-primary btn-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Tests Management</h1>
          <p className="text-secondary-600">
            Manage and organize your IELTS tests
          </p>
        </div>
        
        {canManageContent() && (
          <Link to="/tests/create" className="btn btn-primary btn-md">
            <Plus className="w-4 h-4 mr-2" />
            Create Test
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-content">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
                <input
                  type="text"
                  placeholder="Search tests..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="input pl-10"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline btn-md"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="input"
                  >
                    <option value="">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="input"
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-');
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    className="input"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                    <option value="updatedAt-desc">Recently Updated</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {tests.length === 0 ? (
          <div className="card">
            <div className="card-content text-center py-12">
              <BookOpen className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No tests found</h3>
              <p className="text-secondary-600 mb-4">
                {filters.search || filters.status || filters.difficulty 
                  ? 'Try adjusting your filters' 
                  : 'Get started by creating your first test'}
              </p>
              {canManageContent() && (
                <Link to="/tests/create" className="btn btn-primary btn-md">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Test
                </Link>
              )}
            </div>
          </div>
        ) : (
          tests.map((test) => (
            <div key={test._id} className="card hover:shadow-md transition-shadow">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-secondary-900">
                        {test.title}
                      </h3>
                      {getStatusBadge(test.status)}
                      {getDifficultyBadge(test.difficulty)}
                    </div>
                    
                    {test.description && (
                      <p className="text-secondary-600 mb-3 line-clamp-2">
                        {test.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-6 text-sm text-secondary-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {test.totalTime} min
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {test.createdBy?.firstName} {test.createdBy?.lastName}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(test.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        Skills: {getSkillIcons(test)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/tests/${test._id}`}
                      className="btn btn-ghost btn-sm"
                      title="View Test"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    
                    {canManageContent() && (
                      <>
                        <Link
                          to={`/tests/${test._id}/reading`}
                          className="btn btn-ghost btn-sm"
                          title="Edit Reading Section"
                        >
                          <BookOpen className="w-4 h-4" />
                        </Link>
                        
                        <Link
                          to={`/tests/${test._id}/listening`}
                          className="btn btn-ghost btn-sm"
                          title="Edit Listening Section"
                        >
                          <Volume2 className="w-4 h-4" />
                        </Link>
                        
                        <Link
                          to={`/tests/${test._id}/writing`}
                          className="btn btn-ghost btn-sm"
                          title="Edit Writing Section"
                        >
                          <PenTool className="w-4 h-4" />
                        </Link>
                        
                        <Link
                          to={`/tests/${test._id}/speaking`}
                          className="btn btn-ghost btn-sm"
                          title="Edit Speaking Section"
                        >
                          <Mic className="w-4 h-4" />
                        </Link>
                        
                        <Link
                          to={`/tests/${test._id}/edit`}
                          className="btn btn-ghost btn-sm"
                          title="Edit Test"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        
                        <button
                          onClick={() => handleDuplicate(test._id)}
                          className="btn btn-ghost btn-sm"
                          title="Duplicate Test"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        
                        <div className="relative group">
                          <button className="btn btn-ghost btn-sm">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          <div className="absolute right-0 top-8 w-48 bg-white border border-secondary-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                            <div className="py-1">
                              {test.status === 'draft' && (
                                <button
                                  onClick={() => handleStatusChange(test._id, 'published')}
                                  className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                                >
                                  Publish
                                </button>
                              )}
                              {test.status === 'published' && (
                                <button
                                  onClick={() => handleStatusChange(test._id, 'archived')}
                                  className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                                >
                                  Archive
                                </button>
                              )}
                              {test.status === 'archived' && (
                                <button
                                  onClick={() => handleStatusChange(test._id, 'published')}
                                  className="w-full text-left px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100"
                                >
                                  Restore
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(test._id)}
                                className="w-full text-left px-4 py-2 text-sm text-error-600 hover:bg-error-50"
                              >
                                <Trash2 className="w-4 h-4 inline mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-secondary-600">
            Showing {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
            {pagination.totalItems} results
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="btn btn-outline btn-sm"
            >
              Previous
            </button>
            
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`btn btn-sm ${
                  page === pagination.currentPage 
                    ? 'btn-primary' 
                    : 'btn-outline'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="btn btn-outline btn-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestsList; 