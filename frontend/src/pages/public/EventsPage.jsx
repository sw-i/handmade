import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import eventService from '@services/eventService';
import { 
  Calendar, MapPin, Users, Clock, Filter, Search, 
  ExternalLink, Star, X, Tag, ChevronLeft, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

const EventsPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    eventType: '',
    status: 'published' // Only show published events
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'craft_fair', label: 'Craft Fair' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'exhibition', label: 'Exhibition' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'conference', label: 'Conference' },
    { value: 'networking', label: 'Networking' },
    { value: 'other', label: 'Other' }
  ];

  const eventTypes = [
    { value: '', label: 'All Types' },
    { value: 'physical', label: 'In-Person' },
    { value: 'virtual', label: 'Virtual' },
    { value: 'hybrid', label: 'Hybrid' }
  ];

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    setIsAuthenticated(!!token);
    setUserRole(user?.role || null);
  }, []);

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
        limit: pagination.limit,
        visibility: 'public' // Only show public events
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

  const handleRegister = async (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (userRole !== 'vendor') {
      toast.error('Only vendors can register for events');
      return;
    }

    try {
      const response = await eventService.registerForEvent(eventId);
      toast.success(response.message || 'Registration submitted! Waiting for admin approval.');
      setShowDetailModal(false);
      // Refresh events to update registration status
      fetchEvents();
    } catch (error) {
      toast.error(error.message || 'Failed to register');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'physical':
        return <MapPin size={16} className="inline" />;
      case 'virtual':
        return <ExternalLink size={16} className="inline" />;
      case 'hybrid':
        return <><MapPin size={16} className="inline mr-1" /><ExternalLink size={16} className="inline" /></>;
      default:
        return null;
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      craft_fair: 'bg-pink-100 text-pink-800',
      workshop: 'bg-blue-100 text-blue-800',
      exhibition: 'bg-purple-100 text-purple-800',
      marketplace: 'bg-green-100 text-green-800',
      conference: 'bg-indigo-100 text-indigo-800',
      networking: 'bg-yellow-100 text-yellow-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  const isEventUpcoming = (startDate) => {
    return new Date(startDate) > new Date();
  };

  const isEventOngoing = (startDate, endDate) => {
    const now = new Date();
    return new Date(startDate) <= now && new Date(endDate) >= now;
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-colors">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Artisan Events</h1>
            <p className="text-xl text-indigo-100 mb-8">
              Connect with local artisans, attend workshops, and explore craft fairs
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events by name, location, or description..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full px-6 py-4 pr-12 rounded-lg text-gray-900 bg-white border-2 border-transparent focus:border-indigo-300 focus:outline-none shadow-lg"
                />
                <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Toggle Button (Mobile) */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={() => setFilters({ search: '', category: '', eventType: '', status: 'published' })}
                  className="text-sm text-indigo-600 hover:underline"
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Event Type Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Type
                </label>
                <select
                  value={filters.eventType}
                  onChange={(e) => setFilters({ ...filters, eventType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                <p className="text-sm text-indigo-700">
                  <Calendar size={16} className="inline mr-1" />
                  Found {pagination.total} events
                </p>
              </div>
            </div>
          </aside>

          {/* Events Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-20">
                <Calendar size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => setFilters({ search: '', category: '', eventType: '', status: 'published' })}
                  className="text-indigo-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden group cursor-pointer"
                      onClick={() => viewEventDetails(event.id)}
                    >
                      {/* Event Image */}
                      {event.bannerImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={`http://localhost:5000${event.bannerImage}`}
                            alt={event.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect width=%22400%22 height=%22300%22 fill=%22%23f3f4f6%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%239ca3af%22 font-size=%2220%22%3EEvent Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          {/* Status Badge */}
                          {isEventOngoing(event.startDate, event.endDate) && (
                            <span className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                              Happening Now
                            </span>
                          )}
                          {isEventUpcoming(event.startDate) && (
                            <span className="absolute top-2 right-2 px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
                              Upcoming
                            </span>
                          )}
                        </div>
                      )}

                      <div className="p-5">
                        {/* Category Badge */}
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getCategoryColor(event.category)}`}>
                          {categories.find(c => c.value === event.category)?.label || event.category}
                        </span>

                        {/* Event Title */}
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                          {event.name}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        {/* Event Details */}
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-indigo-600" />
                            <span>{formatDate(event.startDate)}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {getEventTypeIcon(event.eventType)}
                            <span className="capitalize">
                              {event.eventType === 'physical' && event.location}
                              {event.eventType === 'virtual' && 'Virtual Event'}
                              {event.eventType === 'hybrid' && event.location}
                            </span>
                          </div>

                          {event.maxCapacity && (
                            <div className="flex items-center gap-2">
                              <Users size={16} className="text-indigo-600" />
                              <span>
                                {event.currentParticipants || 0}/{event.maxCapacity} attendees
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Organizer */}
                        {event.organizer && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              {event.organizer.logoUrl && (
                                <img
                                  src={`http://localhost:5000${event.organizer.logoUrl}`}
                                  alt={event.organizer.businessName}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <span className="text-xs text-gray-500">
                                by {event.organizer.businessName}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
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
          </main>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {selectedEvent.bannerImage && (
              <img
                src={`http://localhost:5000${selectedEvent.bannerImage}`}
                alt={selectedEvent.name}
                className="w-full h-64 object-cover rounded-t-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22800%22 height=%22400%22%3E%3Crect width=%22800%22 height=%22400%22 fill=%22%23f3f4f6%22/%3E%3C/svg%3E';
                }}
              />
            )}
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedEvent.name}
                  </h2>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(selectedEvent.category)}`}>
                    {categories.find(c => c.value === selectedEvent.category)?.label || selectedEvent.category}
                  </span>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <Calendar className="text-indigo-600" size={20} />
                  <div>
                    <p className="text-sm text-gray-600">Event Dates</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(selectedEvent.startDate)} - {formatDate(selectedEvent.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getEventTypeIcon(selectedEvent.eventType)}
                  <div>
                    <p className="text-sm text-gray-600">
                      {selectedEvent.eventType === 'virtual' ? 'Virtual Event' : 'Location'}
                    </p>
                    <p className="font-medium text-gray-900">
                      {selectedEvent.eventType === 'physical' && selectedEvent.location}
                      {selectedEvent.eventType === 'virtual' && 'Online'}
                      {selectedEvent.eventType === 'hybrid' && `${selectedEvent.location} & Online`}
                    </p>
                  </div>
                </div>

                {selectedEvent.maxCapacity && (
                  <div className="flex items-center gap-3">
                    <Users className="text-indigo-600" size={20} />
                    <div>
                      <p className="text-sm text-gray-600">Capacity</p>
                      <p className="font-medium text-gray-900">
                        {selectedEvent.currentParticipants || 0}/{selectedEvent.maxCapacity}
                      </p>
                    </div>
                  </div>
                )}

                {selectedEvent.registrationDeadline && (
                  <div className="flex items-center gap-3">
                    <Clock className="text-indigo-600" size={20} />
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
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Requirements
                  </h3>
                  <p className="text-gray-700">{selectedEvent.requirements}</p>
                </div>
              )}

              {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Tag size={20} />
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEvent.organizer && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Organized By
                  </h3>
                  <div className="flex items-center gap-3">
                    {selectedEvent.organizer.logoUrl && (
                      <img
                        src={`http://localhost:5000${selectedEvent.organizer.logoUrl}`}
                        alt={selectedEvent.organizer.businessName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <Link
                        to={`/vendors/${selectedEvent.organizer.username || selectedEvent.organizer.id}`}
                        className="font-medium text-indigo-600 hover:underline"
                        onClick={() => setShowDetailModal(false)}
                      >
                        {selectedEvent.organizer.businessName}
                      </Link>
                      {selectedEvent.organizer.user && (
                        <p className="text-sm text-gray-600">
                          Contact: {selectedEvent.organizer.user.firstName} {selectedEvent.organizer.user.lastName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Participating Vendors Section */}
              {selectedEvent.participatingVendors && selectedEvent.participatingVendors.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={20} className="text-green-600" />
                    Participating Vendors ({selectedEvent.participatingVendors.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedEvent.participatingVendors.map((vendor) => (
                      <Link
                        key={vendor.id}
                        to={`/vendors/${vendor.username || vendor.id}`}
                        onClick={() => setShowDetailModal(false)}
                        className="flex items-center gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow border border-gray-200"
                      >
                        {vendor.logoUrl ? (
                          <img
                            src={`http://localhost:5000${vendor.logoUrl}`}
                            alt={vendor.businessName}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold ${vendor.logoUrl ? 'hidden' : ''}`}
                        >
                          {vendor.businessName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {vendor.businessName}
                          </p>
                          {vendor.businessDescription && (
                            <p className="text-xs text-gray-500 truncate">
                              {vendor.businessDescription}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
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
                
                {/* Show different buttons based on authentication and registration status */}
                {!isAuthenticated ? (
                  <Link
                    to="/login"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-center"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Login to Register
                  </Link>
                ) : userRole !== 'vendor' ? (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
                  >
                    Vendors Only
                  </button>
                ) : selectedEvent.myRegistration?.status === 'pending' ? (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg cursor-not-allowed"
                  >
                    Pending Approval
                  </button>
                ) : selectedEvent.myRegistration?.status === 'confirmed' || selectedEvent.myRegistration?.status === 'attended' ? (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 bg-green-100 text-green-800 rounded-lg cursor-not-allowed"
                  >
                    Registered ✓
                  </button>
                ) : selectedEvent.myRegistration?.status === 'cancelled' ? (
                  <button
                    disabled
                    className="flex-1 px-4 py-2 bg-red-100 text-red-800 rounded-lg cursor-not-allowed"
                  >
                    Registration Rejected
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(selectedEvent.id)}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Register Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
