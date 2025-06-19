import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const SignupForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer',
    phone: '',
    dob: '',
    address: '',
    availability: '',
    skills: '',
    motivation: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { API_BASE_URL } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Signup failed');
      }

      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl rounded-lg w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-purple-700 text-center mb-6">
          Sign Up
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder='Write your full name'
              required
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Write your email'
              required
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder='Write your password'
              onChange={handleChange}
              required
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder='Write your phone number'
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder='Write your address'
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
            <select
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
              required
            >
              <option value="" disabled>Select availability</option>
              <option value="Weekends">Weekends</option>
              <option value="Evenings">Evenings</option>
              <option value="Mornings">Mornings</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Skills</label>
            <input
              type="text"
              name="skills"
              placeholder="First aid, event planning, etc."
              value={formData.skills}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Motivation</label>
            <textarea
              name="motivation"
              value={formData.motivation}
              onChange={handleChange}
              rows="3"
              className="w-full border px-4 py-2 rounded-md"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-md"
            >
              <option value="volunteer">Volunteer</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-purple-600 hover:underline cursor-pointer"
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
