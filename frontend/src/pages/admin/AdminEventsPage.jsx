import { useState, useEffect } from 'react';
import eventService from '@services/eventService';
import { 
  Calendar, MapPin, Users, Clock, Filter, Search, 
  Plus, Edit, Trash2, X, Eye, BarChart3, ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    eventType: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    name: '',
    description: '',
    category: 'craft_fair',
    eventType: 'physical',
    location: '',
    virtualLink: '',
    startDate: '',
    endDate: '',
    registrationDeadline: '',
    maxCapacity: '',
    requirements: '',
    status: 'draft',
    visibility: 'public',
    banner: null
  });

  const categories = [
    { value: 'craft_fair', label: 'Craft Fair' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'conference', label: 'Conference' },
    { value: 'networking', label: 'Networking' },
    { value: 'other', label: 'Other' }
  ];

  const eventTypes = [
    { value: 'physical', label: 'In-Person' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'draft', label: 'Draft' },
    { value: 'published', label: 'Published' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, [filters, pagination.page]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        page: pagination.page,
        limit: pagination.limit
      };
      
      const response = await eventService.getEvents(params);
      setEvents(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }));
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await eventService.createEvent(eventForm);
      toast.success('Event created successfully');
      setShowCreateModal(false);
      resetEventForm();
      fetchEvents();
    } catch (error) {
      console.error('Create event error:', error);
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    try {
      await eventService.updateEvent(selectedEvent.id, eventForm);
      toast.success('Event updated successfully');
      setShowEditModal(false);
      resetEventForm();
      fetchEvents();
    } catch (error) {
      console.error('Update event error:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await eventService.deleteEvent(eventId);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      console.error('Delete event error:', error);
      toast.error('Failed to delete event');
    }
  };

  const viewEventDetails = async (eventId) => {
    try {
      const response = await eventService.getEvent(eventId);
      setSelectedEvent(response.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching event details:', error);
      toast.error('Failed to load event details');
    }
  };

  const viewAnalytics = async (eventId) => {
    try {
      const response = await eventService.getEventAnalytics(eventId);
      setSelectedEvent({ ...selectedEvent, analytics: response.data });
      setShowAnalyticsModal(true);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    }
  };

  const handleApproveRegistration = async (eventId, registrationId) => {
    try {
      await eventService.approveRegistration(eventId, registrationId);
      toast.success('Registration approved successfully');
      // Refresh event details to show updated status
      viewEventDetails(eventId);
    } catch (error) {
      console.error('Error approving registration:', error);
      toast.error(error.message || 'Failed to approve registration');
    }
  };

  const handleRejectRegistration = async (eventId, registrationId) => {
    try {
      await eventService.rejectRegistration(eventId, registrationId);
      toast.success('Registration rejected successfully');
      // Refresh event details to show updated status
      viewEventDetails(eventId);
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast.error(error.message || 'Failed to reject registration');
    }
  };

  const openEditModal = (event) => {
    setSelectedEvent(event);
    setEventForm({
      name: event.name,
      description: event.description,
      category: event.category,
      eventType: event.eventType,
      location: event.location || '',
      virtualLink: event.virtualLink || '',
      startDate: event.startDate?.split('T')[0] || '',
      endDate: event.endDate?.split('T')[0] || '',
      registrationDeadline: event.registrationDeadline?.split('T')[0] || '',
      maxCapacity: event.maxCapacity || '',
      requirements: event.requirements || '',
      status: event.status,
      visibility: event.visibility,
      banner: null
    });
    setShowEditModal(true);
  };

  const resetEventForm = () => {
    setEventForm({
      name: '',
      description: '',
      category: 'craft_fair',
      eventType: 'physical',
      location: '',
      virtualLink: '',
      startDate: '',
      endDate: '',
      registrationDeadline: '',
      maxCapacity: '',
      requirements: '',
      status: 'draft',
      visibility: 'public',
      banner: null
    });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-purple-100 text-purple-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.draft;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600">Create and manage artisan events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Create Event</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg">
          <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600 mb-4">Create your first event to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Event
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Event Image */}
                {event.bannerImage && (
                  <img
                    src={`http://localhost:5000${event.bannerImage}`}
                    alt={event.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-5">
                  {/* Status Badge */}
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getStatusBadgeColor(event.status)}`}>
                    {event.status}
                  </span>

                  {/* Event Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.name}
                  </h3>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{formatDate(event.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      <span>{event.location || 'Virtual'}</span>
                    </div>
                    {event.maxCapacity && (
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{event.currentParticipants}/{event.maxCapacity}</span>
                      </div>
                    )}
                  </div>

                  {/* Organizer */}
                  {event.organizer && (
                    <div className="mb-4 text-sm text-gray-600">
                      Organized by: {event.organizer.businessName}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewEventDetails(event.id)}
                      className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => openEditModal(event)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              
              <span className="text-gray-700">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Event Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {showCreateModal ? 'Create Event' : 'Edit Event'}
              </h2>
              
              <form onSubmit={showCreateModal ? handleCreateEvent : handleUpdateEvent}>
                <div className="space-y-4">
                  {/* Event Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={eventForm.name}
                      onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>

                  {/* Category & Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        required
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Type *
                      </label>
                      <select
                        required
                        value={eventForm.eventType}
                        onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      >
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Location / Virtual Link */}
                  {eventForm.eventType !== 'virtual' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                  )}
                  
                  {eventForm.eventType !== 'physical' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Virtual Link
                      </label>
                      <input
                        type="url"
                        value={eventForm.virtualLink}
                        onChange={(e) => setEventForm({ ...eventForm, virtualLink: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                  )}

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={eventForm.startDate}
                        onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        End Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={eventForm.endDate}
                        onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Registration Deadline & Capacity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Deadline
                      </label>
                      <input
                        type="date"
                        value={eventForm.registrationDeadline}
                        onChange={(e) => setEventForm({ ...eventForm, registrationDeadline: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Max Capacity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={eventForm.maxCapacity}
                        onChange={(e) => setEventForm({ ...eventForm, maxCapacity: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      />
                    </div>
                  </div>

                  {/* Status & Visibility */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={eventForm.status}
                        onChange={(e) => setEventForm({ ...eventForm, status: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Visibility
                      </label>
                      <select
                        value={eventForm.visibility}
                        onChange={(e) => setEventForm({ ...eventForm, visibility: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      >
                        <option value="public">Public</option>
                        <option value="invite_only">Invite Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={eventForm.requirements}
                      onChange={(e) => setEventForm({ ...eventForm, requirements: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                      placeholder="Any special requirements for vendors..."
                    />
                  </div>

                  {/* Banner Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Banner
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEventForm({ ...eventForm, banner: e.target.files[0] })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      resetEventForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {showCreateModal ? 'Create Event' : 'Update Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEvent.name}
                  </h2>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedEvent.status === 'published' ? 'bg-green-100 text-green-800' :
                      selectedEvent.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      selectedEvent.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      selectedEvent.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedEvent.status}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {categories.find(c => c.value === selectedEvent.category)?.label}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Banner Image */}
              {selectedEvent.bannerImage && (
                <img 
                  src={`http://localhost:5000${selectedEvent.bannerImage}`}
                  alt={selectedEvent.name}
                  className="w-full h-48 object-cover rounded-lg mb-6"
                />
              )}

              {/* Event Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                  <p className="text-gray-900">{selectedEvent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      <Calendar className="inline mr-1" size={16} />
                      Start Date
                    </h3>
                    <p className="text-gray-900">
                      {new Date(selectedEvent.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      <Calendar className="inline mr-1" size={16} />
                      End Date
                    </h3>
                    <p className="text-gray-900">
                      {new Date(selectedEvent.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {selectedEvent.location && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                      <MapPin className="inline mr-1" size={16} />
                      Location
                    </h3>
                    <p className="text-gray-900">{selectedEvent.location}</p>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    <Users className="inline mr-1" size={16} />
                    Capacity
                  </h3>
                  <p className="text-gray-900">
                    {selectedEvent.currentParticipants} / {selectedEvent.maxCapacity || 'Unlimited'}
                  </p>
                </div>
              </div>

              {/* Pending Registrations Section */}
              {selectedEvent.pendingRegistrations && selectedEvent.pendingRegistrations.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Pending Registrations ({selectedEvent.pendingRegistrations.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedEvent.pendingRegistrations.map((registration) => (
                      <div 
                        key={registration.id}
                        className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {registration.vendor.logoUrl ? (
                            <img 
                              src={`http://localhost:5000${registration.vendor.logoUrl}`}
                              alt={registration.vendor.businessName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                              {registration.vendor.businessName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {registration.vendor.businessName}
                            </p>
                            <p className="text-sm text-gray-500">
                              Registered: {new Date(registration.registrationDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveRegistration(selectedEvent.id, registration.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectRegistration(selectedEvent.id, registration.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Participating Vendors Section */}
              {selectedEvent.participatingVendors && selectedEvent.participatingVendors.length > 0 && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Participating Vendors ({selectedEvent.participatingVendors.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedEvent.participatingVendors.map((vendor) => (
                      <div 
                        key={vendor.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        {vendor.logoUrl ? (
                          <img 
                            src={`http://localhost:5000${vendor.logoUrl}`}
                            alt={vendor.businessName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                            {vendor.businessName.charAt(0)}
                          </div>
                        )}
                        <p className="font-medium text-sm text-gray-900">
                          {vendor.businessName}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Close Button */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventsPage;
