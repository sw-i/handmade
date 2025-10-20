import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Search, 
  MapPin, 
  Users, 
  Clock,
  XCircle,
  Star,
  Eye
} from 'lucide-react';
import eventService from '../../services/eventService';
import toast from 'react-hot-toast';
import ChatWidget from '@components/chat/ChatWidget';

const VendorEventsPage = () => {
  const navigate = useNavigate();
  
  // State management
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    eventType: '',
    status: '',
    myRegistrations: true, // Default to showing only registered events
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Modal states
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Form states
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    feedback: '',
  });

  // Categories and types
  const categories = [
    { value: 'craft_fair', label: 'Craft Fair' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'conference', label: 'Conference' },
    { value: 'networking', label: 'Networking' },
    { value: 'other', label: 'Other' },
  ];

  const eventTypes = [
    { value: 'physical', label: 'Physical' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Hybrid' },
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Fetch events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      };
      
      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === false) {
          delete params[key];
        }
      });

      const response = await eventService.getEvents(params);
      setEvents(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filters, pagination.page]);



  // Handle register
  const handleRegister = async (eventId) => {
    try {
      const response = await eventService.registerForEvent(eventId);
      toast.success(response.message || 'Registration submitted! Waiting for admin approval.');
      fetchEvents();
      if (showDetailModal) {
        const updatedEvent = await eventService.getEvent(eventId);
        setSelectedEvent(updatedEvent.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to register');
    }
  };

  // Handle unregister
  const handleUnregister = async (eventId) => {
    if (!window.confirm('Are you sure you want to unregister from this event?')) return;
    
    try {
      await eventService.unregisterFromEvent(eventId);
      toast.success('Successfully unregistered!');
      fetchEvents();
      if (showDetailModal) {
        const updatedEvent = await eventService.getEvent(eventId);
        setSelectedEvent(updatedEvent.data);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to unregister');
    }
  };

  // Handle submit feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await eventService.submitFeedback(
        selectedEvent.id,
        feedbackForm.rating,
        feedbackForm.feedback
      );
      toast.success('Feedback submitted successfully!');
      setShowFeedbackModal(false);
      setFeedbackForm({ rating: 5, feedback: '' });
      fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to submit feedback');
    }
  };

  // View event details
  const viewEventDetails = async (eventId) => {
    try {
      const response = await eventService.getEvent(eventId);
      setSelectedEvent(response.data);
      setShowDetailModal(true);
    } catch (error) {
      toast.error(error.message || 'Failed to load event details');
    }
  };



  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.draft;
  };

  // Get registration status badge
  const getRegistrationBadge = (registration) => {
    if (!registration) return null;
    
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      waitlist: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
      attended: 'bg-purple-100 text-purple-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[registration.status]}`}>
        {registration.status.charAt(0).toUpperCase() + registration.status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Event Registrations</h1>
          <p className="text-gray-600 mt-1">
            Browse and manage your registered events
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          {/* Event Type Filter */}
          <select
            value={filters.eventType}
            onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          >
            <option value="">All Types</option>
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
          >
            {statusOptions.map(status => (
              <option key={status.value} value={status.value}>{status.label}</option>
            ))}
          </select>
        </div>

        {/* Quick Filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => setFilters({ ...filters, myRegistrations: !filters.myRegistrations })}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filters.myRegistrations
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filters.myRegistrations ? 'Show All Events' : 'Show My Registrations Only'}
          </button>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {filters.myRegistrations ? 'No registered events found' : 'No events found'}
          </h3>
          <p className="text-gray-600">
            {filters.myRegistrations 
              ? 'You have not registered for any events yet. Browse available events to register.'
              : 'No events match your current filters. Try adjusting your search criteria.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Event Banner */}
              {event.bannerImage && (
                <img
                  src={`http://localhost:5000${event.bannerImage}`}
                  alt={event.name}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {event.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(event.status)}`}>
                        {event.status}
                      </span>
                      {event.myRegistration && getRegistrationBadge(event.myRegistration)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    {event.location || 'Virtual Event'}
                  </div>
                  {event.maxCapacity && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users size={16} />
                      {event.currentParticipants}/{event.maxCapacity} participants
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => viewEventDetails(event.id)}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm font-medium transition-colors"
                  >
                    <Eye size={16} className="inline mr-1" />
                    View Details
                  </button>

                  {/* If not registered and can register */}
                  {!event.myRegistration && event.status === 'published' && (
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-medium transition-colors"
                    >
                      Register
                    </button>
                  )}

                  {/* If registered */}
                  {event.myRegistration && event.myRegistration.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUnregister(event.id)}
                      className="flex-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm font-medium transition-colors"
                    >
                      Unregister
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-900"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-900"
          >
            Next
          </button>
        </div>
      )}

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {selectedEvent.bannerImage && (
              <img
                src={`http://localhost:5000${selectedEvent.bannerImage}`}
                alt={selectedEvent.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEvent.name}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                    {selectedEvent.myRegistration && getRegistrationBadge(selectedEvent.myRegistration)}
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Dates</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="text-blue-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium text-gray-900">
                      {selectedEvent.location || 'Virtual Event'}
                    </p>
                  </div>
                </div>

                {selectedEvent.maxCapacity && (
                  <div className="flex items-center gap-3">
                    <Users className="text-blue-600" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Capacity</p>
                      <p className="font-medium text-gray-900">
                        {selectedEvent.currentParticipants}/{selectedEvent.maxCapacity}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEvent.registrationDeadline && (
                  <div className="flex items-center gap-3">
                    <Clock className="text-blue-600" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Registration Deadline</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(selectedEvent.registrationDeadline)}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedEvent.requirements && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Requirements
                  </h3>
                  <p className="text-gray-700">{selectedEvent.requirements}</p>
                </div>
              )}

              {selectedEvent.organizer && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Organized By
                  </h3>
                  <div className="flex items-center gap-3">
                    {selectedEvent.organizer.logoUrl && (
                      <img
                        src={selectedEvent.organizer.logoUrl}
                        alt={selectedEvent.organizer.businessName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedEvent.organizer.businessName}
                      </p>
                      {selectedEvent.organizer.user && (
                        <p className="text-sm text-gray-600">
                          {selectedEvent.organizer.user.firstName} {selectedEvent.organizer.user.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                
                {!selectedEvent.myRegistration && selectedEvent.status === 'published' && (
                  <button
                    onClick={() => {
                      handleRegister(selectedEvent.id);
                      setShowDetailModal(false);
                    }}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Register Now
                  </button>
                )}

                {selectedEvent.myRegistration && selectedEvent.myRegistration.status === 'attended' && (
                  <button
                    onClick={() => {
                      setShowDetailModal(false);
                      setShowFeedbackModal(true);
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Star size={16} className="inline mr-1" />
                    Submit Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Submit Feedback
              </h2>
              <p className="text-gray-600 mb-4">
                Share your experience at {selectedEvent.name}
              </p>

              <form onSubmit={handleSubmitFeedback}>
                <div className="space-y-4">
                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(rating => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setFeedbackForm({ ...feedbackForm, rating })}
                          className="p-2 hover:scale-110 transition-transform"
                        >
                          <Star
                            size={32}
                            className={rating <= feedbackForm.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Feedback
                    </label>
                    <textarea
                      rows={4}
                      value={feedbackForm.feedback}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      placeholder="Tell us about your experience..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFeedbackModal(false);
                      setFeedbackForm({ rating: 5, feedback: '' });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <ChatWidget />
    </div>
  );
};

export default VendorEventsPage;
