import React, { useState, useEffect } from 'react';
import { User, Edit3, Save, X, Mail, Phone, MapPin, Calendar, Briefcase, Camera, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/authContext';
import Swal from 'sweetalert2';

const ProfilePage = () => {
  const { API_BASE_URL, authToken } = useAuth();
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });


const fetchUserData = async () => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'GET',
      credentials: 'include'  // 👈 allows sending cookies
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    setUser(data);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching user data:', error);
    setLoading(false);
  }
};


  const updateUserData = async (updatedData) => {
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      credentials: 'include', // ✅ to send cookies
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update failed');

    setUser(prev => ({ ...prev, ...updatedData }));
    setMessage({ type: 'success', text: 'Profile updated successfully!' });
    setIsEditing(false);

    // ✅ SweetAlert success
    Swal.fire({
      icon: 'success',
      title: 'Profile Updated',
      text: 'Your changes have been saved.',
      confirmButtonColor: '#6366f1'
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });

    // ❌ SweetAlert error
    Swal.fire({
      icon: 'error',
      title: 'Update Failed',
      text: error.message || 'Something went wrong.',
      confirmButtonColor: '#ef4444'
    });
  } finally {
    setLoading(false);
    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  }
};

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleEdit = () => {
    setEditForm({ ...user });
    setIsEditing(true);
    setMessage({ type: '', text: '' });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm({});
    setMessage({ type: '', text: '' });
  };

  const handleSave = () => {
    if (!editForm.name?.trim() || !editForm.email?.trim()) {
      setMessage({ type: 'error', text: 'Name and email are required.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      setMessage({ type: 'error', text: 'Enter a valid email.' });
      return;
    }

    updateUserData(editForm);
  };

  const handleInputChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32"></div>
          <div className="relative px-8 pb-8">
            <div className="absolute -top-16 left-8">
              <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
            <div className="mt-4 ml-40">
              <h1 className="text-3xl font-bold text-gray-900">
                {user.name}
              </h1>
              <p className="text-lg text-indigo-600 font-medium">{user.role}</p>
            </div>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            {['email', 'phone', 'dob', 'address', 'availability', 'skills', 'motivation'].map(field => (
              <div key={field}>
                <label className="text-sm font-medium text-gray-500 capitalize">{field}</label>
                {!isEditing ? (
                  <p className="text-gray-900">{user[field]}</p>
                ) : (
                  <input
                    type={field === 'dob' ? 'date' : 'text'}
                    value={editForm[field] || ''}
                    onChange={(e) => handleInputChange(field, e.target.value)}
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
            {["hobbies", "interests"].map(field => (
              <div key={field}>
                <label className="text-sm font-medium text-gray-500 capitalize">{field} (comma-separated)</label>
                {!isEditing ? (
                  <p className="text-gray-900">{Array.isArray(user[field]) ? user[field].join(', ') : ''}</p>
                ) : (
                  <input
                    type="text"
                    value={editForm[field]?.join(', ') || ''}
                    onChange={(e) => handleInputChange(field, e.target.value.split(',').map(s => s.trim()))}
                    className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <div className="fixed bottom-8 right-8 flex space-x-3">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
              disabled={loading}
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{loading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
