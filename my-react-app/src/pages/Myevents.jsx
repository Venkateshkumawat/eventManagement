import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Mail, Phone, X, RefreshCw } from 'lucide-react';

const MyEvents = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [error, setError] = useState('');

  // Replace with your actual API base URL
  const API_BASE_URL = 'http://localhost:5000';

  // Fetch user's event registrations
  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}/api/registration/me`, {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Please log in to view your registrations');
        }
        throw new Error('Failed to fetch registrations');
      }

      const data = await response.json();
      setRegistrations(Array.isArray(data) ? data : data.registrations || []);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cancel event registration
  const cancelRegistration = async (registrationId, eventName) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your registration for "${eventName}"?`
    );

    if (!confirmCancel) return;

    setCancellingId(registrationId);

    try {
      const response = await fetch(`${API_BASE_URL}/api/registration/${registrationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to cancel registration');
      }

      // Remove cancelled registration from state
      setRegistrations(prev => 
        prev.filter(reg => reg._id !== registrationId && reg.id !== registrationId)
      );

      alert('Registration cancelled successfully!');
    } catch (err) {
      console.error('Error cancelling registration:', err);
      alert(`Error: ${err.message}`);
    } finally {
      setCancellingId(null);
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Format time helper
  const formatTime = (timeString) => {
    if (!timeString) return 'Time not available';
    try {
      const time = new Date(`1970-01-01T${timeString}`);
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your events...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Events</h1>
          <p className="text-lg text-gray-600">Manage your event registrations</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={fetchRegistrations}
              className="ml-4 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Refresh Button */}
        <div className="mb-6 text-right">
          <button
            onClick={fetchRegistrations}
            disabled={loading}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Events Grid */}
        {registrations.length === 0 ? (
          <div className="text-center py-16">
            <Calendar className="h-24 w-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No Events Found</h3>
            <p className="text-gray-600 mb-6">You haven't registered for any events yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {registrations.map((registration) => {
              const regId = registration._id || registration.id;
              const eventInfo = registration.event || registration;
              
              return (
                <div
                  key={regId}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Event Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <h3 className="text-xl font-bold text-white truncate">
                      {registration.eventName || eventInfo.name || 'Event Name'}
                    </h3>
                  </div>

                  {/* Event Details */}
                  <div className="p-6">
                    {/* Date & Time */}
                    <div className="space-y-3 mb-4">
                      {(registration.eventDate || eventInfo.date) && (
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-5 w-5 mr-3 text-blue-600" />
                          <span className="font-medium">
                            {formatDate(registration.eventDate || eventInfo.date)}
                          </span>
                        </div>
                      )}
                      
                      {(registration.eventTime || eventInfo.time) && (
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-5 w-5 mr-3 text-blue-600" />
                          <span className="font-medium">
                            {formatTime(registration.eventTime || eventInfo.time)}
                          </span>
                        </div>
                      )}

                      {(registration.location || eventInfo.location) && (
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-5 w-5 mr-3 text-blue-600" />
                          <span className="font-medium">
                            {registration.location || eventInfo.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Registration Info */}
                    <div className="border-t pt-4 mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Registration Details</h4>
                      <div className="space-y-2 text-sm">
                        {registration.name && (
                          <div className="flex items-center text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <span>{registration.name}</span>
                          </div>
                        )}
                        
                        {registration.email && (
                          <div className="flex items-center text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <span>{registration.email}</span>
                          </div>
                        )}
                        
                        {registration.contact && (
                          <div className="flex items-center text-gray-600">
                            <Phone className="h-4 w-4 mr-2" />
                            <span>{registration.contact}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        registration.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        registration.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        registration.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {registration.status || 'Registered'}
                      </span>
                    </div>

                    {/* Registration Date */}
                    {registration.createdAt && (
                      <p className="text-xs text-gray-500 mb-4">
                        Registered on {formatDate(registration.createdAt)}
                      </p>
                    )}

                    {/* Cancel Button */}
                    <button
                      onClick={() => cancelRegistration(
                        regId,
                        registration.eventName || eventInfo.name || 'this event'
                      )}
                      disabled={
                        cancellingId === regId || 
                        registration.status === 'cancelled'
                      }
                      className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                        registration.status === 'cancelled'
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : cancellingId === regId
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
                      }`}
                    >
                      {cancellingId === regId ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Cancelling...
                        </>
                      ) : registration.status === 'cancelled' ? (
                        'Already Cancelled'
                      ) : (
                        <>
                          <X className="h-5 w-5 mr-2" />
                          Cancel Registration
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyEvents;