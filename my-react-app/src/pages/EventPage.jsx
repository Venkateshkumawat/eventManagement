import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";

const dummyChartData = [
  { name: "Jan", Events: 2, Registrations: 10 },
  { name: "Feb", Events: 3, Registrations: 15 },
  { name: "Mar", Events: 1, Registrations: 8 },
  { name: "Apr", Events: 4, Registrations: 20 },
  { name: "May", Events: 2, Registrations: 12 }
];

const EventPage = () => {
  
  const navigate = useNavigate();
  const { isLoggedIn, API_BASE_URL } = useAuth();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [popup, setPopup] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventData, setEventData] = useState({
    name: "",
    email: "",
    contact: "",
    status: "registered"
  });

  const [createMode, setCreateMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    image: "",
    createdBy: "",
    activities: "",
    itemsToCarry: [],
  });

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      try {
        const resUser = await axios.get(`${API_BASE_URL}/api/auth/profile`, {
          withCredentials: true
        });
        setUser(resUser.data);

        if (resUser.data.role === "organizer") {
          setNewEvent((prev) => ({ ...prev, createdBy: resUser.data._id }));
        }

        const resEvents = await axios.get(`${API_BASE_URL}/api/event`, {
          withCredentials: true
        });
        setEvents(resEvents.data);
      } catch (err) {
        console.error("Failed to fetch user or events:", err);
        setUser(null);
      }
    };

    if (isLoggedIn) fetchUserAndEvents();
  }, [isLoggedIn, API_BASE_URL]);

  const handleChange = (e) => {
    if (createMode || editMode) {
      setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    } else {
      setEventData({ ...eventData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if ((createMode || editMode) && user?.role === "organizer") {
        if (editMode) {
          // Update existing event
          await axios.put(`${API_BASE_URL}/api/event/${selectedEvent._id}`, newEvent, {
            withCredentials: true,
          });
          
          Swal.fire({
            icon: "success",
            title: "Event Updated!",
            text: "Your event has been updated successfully.",
            confirmButtonColor: "#3085d6",
          });
        } else {
          // Create new event
          await axios.post(`${API_BASE_URL}/api/event`, newEvent, {
            withCredentials: true,
          });

          Swal.fire({
            icon: "success",
            title: "Event Created!",
            text: "Your event has been created successfully.",
            confirmButtonColor: "#3085d6",
          });
        }

        // Refresh events list
        const resEvents = await axios.get(`${API_BASE_URL}/api/event`, {
          withCredentials: true,
        });
        setEvents(resEvents.data);
      } else if (user?.role === "volunteer") {
        
        await axios.post(
          `${API_BASE_URL}/api/registration`,
          {
            name: eventData.name,
            email: eventData.email,
            contact: eventData.contact,
            eventName: selectedEvent?.title,
            status: eventData.status,
          },
          { withCredentials: true }
        );

        Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: `You have registered for: ${selectedEvent?.title}`,
          confirmButtonColor: "#28a745",
        });
      }

      handleCancelForm();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setCreateMode(false);
    setEditMode(false);
    setSelectedEvent(null);
    setNewEvent({
      title: "",
      description: "",
      location: "",
      date: "",
      image: "",
      createdBy: user?._id || "",
      activities: "",
      itemsToCarry: [],
    });
    setEventData({
      name: "",
      email: "",
      contact: "",
      status: "registered"
    });
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      description: event.description,
      location: event.location,
      date: event.date.split('T')[0], 
      image: event.image,
      createdBy: event.createdBy,
      activities: event.activities,
      itemsToCarry: event.itemsToCarry || [],
    });
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/api/event/${eventId}`, {
          withCredentials: true,
        });

        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "Event has been deleted successfully.",
          confirmButtonColor: "#28a745",
        });

        // Refresh events list
        const resEvents = await axios.get(`${API_BASE_URL}/api/event`, {
          withCredentials: true,
        });
        setEvents(resEvents.data);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Failed to delete event. Please try again.",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  const renderForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto space-y-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700">
            {editMode ? "Edit Event" : createMode ? "Create New Event" : "Register for Event"}
          </h2>
          <button
            type="button"
            onClick={handleCancelForm}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {(createMode || editMode) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="title"
              placeholder="Event Title"
              value={newEvent.title}
              onChange={handleChange}
              className="p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />

            <input
              name="location"
              placeholder="Location"
              value={newEvent.location}
              onChange={handleChange}
              className="p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />

            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleChange}
              className="p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />

            <input
              name="image"
              placeholder="Image URL"
              value={newEvent.image}
              onChange={handleChange}
              className="p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />

            <textarea
              name="description"
              placeholder="Event Description"
              value={newEvent.description}
              onChange={handleChange}
              className="col-span-2 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              rows={4}
              required
            />

            <textarea
              name="activities"
              placeholder="Activities (e.g. Clean-up, Teaching, Organizing)"
              value={newEvent.activities}
              onChange={handleChange}
              className="col-span-2 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              rows={3}
            />

            <input
              name="itemsToCarry"
              placeholder="Items to Carry (comma-separated)"
              value={Array.isArray(newEvent.itemsToCarry) ? newEvent.itemsToCarry.join(', ') : newEvent.itemsToCarry}
              onChange={(e) =>
                setNewEvent({
                  ...newEvent,
                  itemsToCarry: e.target.value.split(",").map((item) => item.trim()),
                })
              }
              className="col-span-2 p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
        ) : (
          <div className="space-y-6">
            <input
              name="name"
              placeholder="Your Name"
              value={eventData.name}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
            <input
              name="email"
              placeholder="Email"
              value={eventData.email}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
            <input
              name="contact"
              placeholder="Contact Number"
              value={eventData.contact}
              onChange={handleChange}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              required
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={handleCancelForm}
            className="bg-gray-500 text-white px-8 py-3 rounded-lg text-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition-colors"
          >
            {editMode ? "Update Event" : createMode ? "Create Event" : "Register"}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );

  const handleEventClick = (event) => {
    if (!isLoggedIn || !user) {
      setPopup(true);
    } else {
      setSelectedEvent(event);
      setShowForm(true);
    }
  };



  // Real-time analytics state
  const [analyticsData, setAnalyticsData] = useState({
    monthlyStats: [],
    eventTypes: [],
    registrationTrends: [],
    performanceMetrics: [],
    liveStats: {
      totalEvents: 0,
      totalRegistrations: 0,
      activeVolunteers: 0,
      completionRate: 0
    }
  });

  // Generate real-time analytics data
  const generateAnalyticsData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    // Monthly stats with realistic variations
    const monthlyStats = months.slice(0, currentMonth + 1).map((month, index) => ({
      name: month,
      Events: Math.floor(Math.random() * 15) + 5,
      Registrations: Math.floor(Math.random() * 80) + 20,
      Completed: Math.floor(Math.random() * 60) + 15,
      Revenue: Math.floor(Math.random() * 5000) + 2000
    }));

    // Event types distribution
    const eventTypes = [
      { name: 'Community Service', value: 35, color: '#8884d8' },
      { name: 'Environmental', value: 25, color: '#82ca9d' },
      { name: 'Education', value: 20, color: '#ffc658' },
      { name: 'Healthcare', value: 12, color: '#ff7c7c' },
      { name: 'Sports & Recreation', value: 8, color: '#8dd1e1' }
    ];

    // Registration trends (last 30 days)
    const registrationTrends = Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      registrations: Math.floor(Math.random() * 50) + 10,
      activeUsers: Math.floor(Math.random() * 200) + 50
    }));

    // Performance metrics
    const performanceMetrics = [
      { metric: 'Event Success Rate', value: 87, target: 90 },
      { metric: 'Volunteer Retention', value: 78, target: 85 },
      { metric: 'Registration Rate', value: 92, target: 88 },
      { metric: 'Completion Rate', value: 84, target: 80 }
    ];

    // Live stats
    const liveStats = {
      totalEvents: Math.floor(Math.random() * 50) + 25,
      totalRegistrations: Math.floor(Math.random() * 500) + 200,
      activeVolunteers: Math.floor(Math.random() * 150) + 80,
      completionRate: Math.floor(Math.random() * 20) + 75
    };

    setAnalyticsData({
      monthlyStats,
      eventTypes,
      registrationTrends,
      performanceMetrics,
      liveStats
    });
  };

  useEffect(() => {
    // Set a dummy user for demonstration
    setUser({ role: "volunteer" });
    generateAnalyticsData();

    // Update analytics every 30 seconds for real-time effect
    const interval = setInterval(generateAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);


  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white p-6">
      {/* Hero Section */}
      <motion.div
        className="flex flex-col-reverse md:flex-row items-center justify-between bg-gradient-to-r from-white via-pink-50 to-blue-50 rounded-3xl shadow-2xl px-8 py-12 mb-10"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Left Side */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <motion.h1
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-extrabold text-indigo-800 leading-tight mb-4"
          >
            Transform Volunteering with <span className="text-pink-600">VolunteerHub</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-700 mb-6"
          >
            Streamline your events, connect passionate volunteers, and manage registrations — all in one powerful, easy-to-use platform.
          </motion.p>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 justify-center md:justify-start"
          >
            <button
              onClick={() => navigate("/")}
              className="bg-pink-600 text-white px-6 py-3 rounded-lg shadow hover:bg-pink-700 transition-all duration-300"
            >
              Explore Features
            </button>
          </motion.div>

          {/* Key Benefits */}
          <ul className="mt-8 space-y-2 text-left text-gray-600 text-sm">
            <li>✅ Real-time event dashboards & insights</li>
            <li>✅ Seamless volunteer registration & tracking</li>
            <li>✅ Organizer tools for effortless event creation</li>
            <li>✅ Smart analytics & monthly performance reports</li>
          </ul>
        </div>

        {/* Right Image */}
        <motion.div
          className="w-full md:w-1/2 mb-8 md:mb-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <img
            src="https://media.licdn.com/dms/image/v2/D4D12AQHOAn_nj-DXZg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1691338625403?e=2147483647&v=beta&t=jklYcicVBM-0K89YexOwiu5fIleEUWLmff634b3Apt8"
            alt="VMHub Illustration"
            className="w-full max-w-md mx-auto rounded-xl"
          />
        </motion.div>
      </motion.div>


{/* Live Statistics Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10"
      >
        {[
          { title: 'Total Events', value: analyticsData.liveStats.totalEvents, icon: '🎯', color: 'bg-blue-500' },
          { title: 'Registrations', value: analyticsData.liveStats.totalRegistrations, icon: '👥', color: 'bg-green-500' },
          { title: 'Active Volunteers', value: analyticsData.liveStats.activeVolunteers, icon: '⭐', color: 'bg-purple-500' },
          { title: 'Success Rate', value: `${analyticsData.liveStats.completionRate}%`, icon: '📈', color: 'bg-orange-500' }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-16 h-16 rounded-full flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Real-time Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Monthly Performance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📊</span>
            Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="Events" stackId="1" stroke="#8884d8" fill="#8884d8" />
              <Area type="monotone" dataKey="Registrations" stackId="2" stroke="#82ca9d" fill="#82ca9d" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Event Types Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Event Categories
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.eventTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analyticsData.eventTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Registration Trends */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">📈</span>
            Registration Trends (30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.registrationTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="registrations" stroke="#ff7c7c" strokeWidth={3} />
              <Line type="monotone" dataKey="activeUsers" stroke="#8dd1e1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🎯</span>
            Key Performance Indicators
          </h3>
          <div className="space-y-4">
            {analyticsData.performanceMetrics.map((metric, index) => (
              <div key={metric.metric} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                  <span className="text-sm text-gray-500">{metric.value}% / {metric.target}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(metric.value / metric.target) * 100}%` }}
                    transition={{ delay: index * 0.2, duration: 1 }}
                    className={`h-2 rounded-full ${
                      metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Events Section */}
      <div className="relative">
        <h1 className="text-4xl font-bold text-center text-blue-800 mb-8">
          Upcoming Events
        </h1>

        {user?.role === "organizer" && !showForm && (
          <div className="text-center mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                setShowForm(true);
                setCreateMode(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-lg font-semibold"
            >
              ✨ Create New Event
            </motion.button>
          </div>
        )}

        <div className="space-y-6">
          {events.map((event, index) => (
            <motion.div
              key={event._id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row"
            >
              {/* Left Side - Event Image */}
              <div className="w-full md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                {event.image ? (
                  <img
                    src={event.image}
                    alt="Event"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-6xl">🎉</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white bg-opacity-90 px-3 py-2 rounded-full">
                  <span className="text-sm font-bold text-gray-700">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
              </div>

              {/* Right Side - Event Details */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    {event.title}
                  </h2>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600">
                      <span className="mr-3 text-lg">📅</span>
                      <span className="font-medium">{new Date(event.date).toDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="mr-3 text-lg">📍</span>
                      <span className="font-medium">{event.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {event.description}
                  </p>

                  {event.activities && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <span className="mr-2">🎯</span>
                        Activities:
                      </h4>
                      <p className="text-gray-600 pl-6">{event.activities}</p>
                    </div>
                  )}

                  {event.itemsToCarry && event.itemsToCarry.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                        <span className="mr-2">🎒</span>
                        Items to Carry:
                      </h4>
                      <div className="flex flex-wrap gap-2 pl-6">
                        {event.itemsToCarry.map((item, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                  {/* Organizer Actions */}
                  {user?.role === "organizer" && (
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(event)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium flex items-center space-x-2"
                      >
                        <span>✏️</span>
                        <span>Edit</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(event._id)}
                        className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors text-sm font-medium flex items-center space-x-2"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </motion.button>
                      
                    </div>
                  )}

                  {/* Volunteer Register */}
                  {user?.role === "volunteer" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEventClick(event)}
                      className="bg-gradient-to-r from-pink-500 to-red-500 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium flex items-center space-x-2"
                    >
                      <span>🎯</span>
                      <span>Register Now</span>
                    </motion.button>
                  )}

                  {/* Guest/Not logged in */}
                  {!user && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEventClick(event)}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
                    >
                      Sign in to Register
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Events Yet</h3>
            <p className="text-gray-500">Check back later for upcoming events!</p>
          </div>
        )}
      </div>

      {/* Render Form Modal */}
      {showForm && user && renderForm()}

      {/* Final CTA Section */}
<section className="bg-gradient-to-r from-blue-50 to-blue-100 py-16 px-4 mt-20">
  <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    {/* Image */}
    <motion.img
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      src="https://img.freepik.com/free-vector/volunteering-concept-illustration_114360-2042.jpg"
      alt="Join Us"
      className="rounded-3xl shadow-lg w-full"
    />

    {/* Text + CTA */}
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center md:text-left"
    >
      <h2 className="text-4xl font-extrabold text-blue-800 mb-4">
        Come, Be the Change 🌟
      </h2>
      <p className="text-lg text-gray-700 mb-6">
        Whether you're lending a hand, leading an initiative, or sharing your skills — 
        your presence can spark real transformation. Join a vibrant community of changemakers today!
      </p>
      
    </motion.div>
  </div>
</section>


      {/* Login Popup */}
      {popup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-4"
          >
            <div className="text-center">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sign In Required</h3>
              <p className="text-gray-600 mb-6">You need to sign in to register for events.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setPopup(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setPopup(false);
                    navigate('/login'); // Assuming you have a login route
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EventPage;