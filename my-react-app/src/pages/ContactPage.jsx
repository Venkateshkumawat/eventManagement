import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/authContext";
import img12 from "../assets/img12.avif";
import img13 from "../assets/img13.avif";
import img14 from "../assets/img14.avif";
import Swal from "sweetalert2";

const ContactPage = () => {


  
  const { API_BASE_URL } = useAuth();

  const [formData, setFormData] = useState({
    event: "",
    role: "",
    givenBy: "",
    rating: "",
    comment: "",
  });

  const [showForm, setShowForm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [faqOpen, setFaqOpen] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { text: "Your Feedback Matters", img: img12 },
    { text: "Help Us Improve Together", img: img13 },
    { text: "We Listen, We Act", img: img14 },
  ];

  const faqs = [
    {
      question: "How do I become a volunteer?",
      answer: "Simply register and complete your profile. Then, choose events that interest you.",
    },
    {
      question: "Can I cancel my feedback?",
      answer: "Once submitted, feedback is stored securely. Contact us to request removal.",
    },
    {
      question: "How do I contact the organizers?",
      answer: "Visit the Contact section below or email us at support@volunteerhub.org.",
    },
  ];

  const [queryText, setQueryText] = useState("");
  const [email, setEmail] = useState("");

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/api/query`, {
        email,
        query: queryText,
      });

      Swal.fire({
        icon: "success",
        title: "Thank you!",
        text: "Your query has been submitted successfully.",
        confirmButtonColor: "#8e44ad",
      });

      setQueryText("");
      setEmail("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error?.response?.data?.message || "Something went wrong!",
        confirmButtonColor: "#e74c3c",
      });
    }
  };

  // ✅ Check login using cookie
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/check-auth`, {
          withCredentials: true,
        });
        setIsLoggedIn(res.data.isAuthenticated);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, [API_BASE_URL]);

  // ✅ Auto-rotate banner
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const dataToSend = { ...formData, rating: Number(formData.rating) };

    const res = await axios.post(`${API_BASE_URL}/api/feedback`, dataToSend, {
      withCredentials: true,
    });

    if (res.status === 201) {
      Swal.fire({
        icon: 'success',
        title: 'Feedback Submitted!',
        text: 'Thank you for your valuable feedback.',
        confirmButtonColor: '#6366F1',
      });

      setShowForm(false);
      setFormData({
        event: '',
        role: '',
        givenBy: '',
        rating: '',
        comment: '',
      });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Oops!',
        text: 'Unexpected response from server.',
        confirmButtonColor: '#F59E0B',
      });
    }
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Submission Failed',
      text: 'Something went wrong. Please try again later.',
      confirmButtonColor: '#EF4444',
    });
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100 p-8 space-y-20">
      {/* ✅ Banner Section */}
      <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl relative">
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[currentSlide].img}
            src={slides[currentSlide].img}
            alt={slides[currentSlide].text}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-64 object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            key={slides[currentSlide].text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-extrabold text-purple-200 drop-shadow-lg"
          >
            {slides[currentSlide].text}
          </motion.h1>
          <p className="text-gray-200 mt-4 text-lg max-w-xl">
            We value your input to improve volunteering experiences.
          </p>

          {/* ✅ Show button only if logged in */}
          {!showForm &&
            (isLoggedIn ? (
              <button
                onClick={() => {
                  setSuccessMsg("");
                  setErrorMsg("");
                  setShowForm(true);
                }}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full shadow-lg hover:opacity-90 transition"
              >
                Give Feedback
              </button>
            ) : (
              <p className="mt-6 text-white font-medium bg-red-500 px-6 py-2 rounded-full shadow-md">
                Please sign in to give feedback.
              </p>
            ))}
        </div>
      </div>

      {/* ✅ Feedback Form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-4"
          >
            <h2 className="text-2xl font-semibold text-purple-600">Feedback Form</h2>

            <input
              type="text"
              name="event"
              required
              placeholder="Event ID or Title"
              className="w-full p-3 border rounded-lg"
              value={formData.event}
              onChange={handleChange}
            />

            <select
              name="role"
              required
              className="w-full p-3 border rounded-lg"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              <option value="volunteer">Volunteer</option>
              <option value="organizer">Organizer</option>
            </select>

            <input
              type="text"
              name="givenBy"
              required
              placeholder="User ID (You)"
              className="w-full p-3 border rounded-lg"
              value={formData.givenBy}
              onChange={handleChange}
            />

            <select
              name="rating"
              required
              className="w-full p-3 border rounded-lg"
              value={formData.rating}
              onChange={handleChange}
            >
              <option value="">Rating (1-5)</option>
              {[1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>

            <textarea
              name="comment"
              required
              placeholder="Your Feedback"
              className="w-full p-3 border rounded-lg h-32"
              value={formData.comment}
              onChange={handleChange}
            />

            {successMsg && <p className="text-green-600">{successMsg}</p>}
            {errorMsg && <p className="text-red-600">{errorMsg}</p>}

            <div className="flex justify-between items-center">
              <button
                type="submit"
                className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-red-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <div key={index} className="mb-4">
            <button
              onClick={() => setFaqOpen(faqOpen === index ? null : index)}
              className="w-full text-left p-4 bg-pink-100 hover:bg-pink-200 rounded-lg font-medium"
            >
              {faq.question}
            </button>
            <AnimatePresence>
              {faqOpen === index && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-2 px-4 text-gray-700"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </section>

      {/* Contact Section */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-purple-700 mb-6 text-center">Contact</h2>
        <p className="mb-6 text-gray-700 text-center max-w-xl mx-auto leading-relaxed">
          If you have any questions, need assistance, or want to learn more about our volunteer programs, please reach out.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold text-pink-600 mb-2">Email & Phone</h3>
            <p className="text-gray-700">
              Email:{" "}
              <a href="mailto:support@volunteerhub.org" className="text-blue-600 hover:underline">
                support@volunteerhub.org
              </a>
              <br />
              Phone: +1 234 567 8901
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-600 mb-2">Our Office</h3>
            <p className="text-gray-700">
              123 Volunteer Lane <br />
              Community City, State 12345
            </p>
          </div>
        </div>
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            <strong>Cancellation Policy:</strong> Please notify us at least 24 hours before if you need to cancel or reschedule any volunteer commitments.
          </p>
        </div>
      </div>

            {/* Rules & Policies Section */}
      <section className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">Rules & Policies</h2>
        <p className="text-gray-700 mb-4 text-center">
          Please take a moment to review our policies to ensure a smooth experience for everyone.
        </p>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-purple-600">Cancellation Policy</h3>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              <li>Cancellations must be made at least 24 hours prior to the event.</li>
              <li>Late cancellations may affect your eligibility for future events.</li>
              <li>Contact support@volunteerhub.org for rescheduling.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-pink-600">Refund Policy</h3>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              <li>Participation in events is free of charge unless otherwise stated.</li>
              <li>In case of paid events, refunds are available if cancellation is done 48 hours prior.</li>
              <li>No refunds will be processed after the event has started.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-blue-600">Code of Conduct</h3>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              <li>Respect fellow volunteers, organizers, and community members.</li>
              <li>Abusive language or behavior will not be tolerated.</li>
              <li>Always follow event-specific guidelines provided on-site.</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-600">Privacy & Data Usage</h3>
            <ul className="list-disc list-inside text-gray-700 mt-2">
              <li>Your personal data is stored securely and only used to improve the volunteering platform.</li>
              <li>We do not share your information with third parties without your consent.</li>
              <li>For full details, read our <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a>.</li>
            </ul>
          </div>
        </div>
      </section>

{/* //queries */}
<section className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl mt-10">
      <h2 className="text-3xl font-bold text-purple-700 mb-4 text-center">
        Have Questions or Want Updates?
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Write your queries below or share your email to get updates about events and volunteering.
      </p>

      <form onSubmit={handleQuerySubmit} className="space-y-4">
        <textarea
          placeholder="Write your queries here..."
          className="w-full p-4 border border-gray-300 rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Enter your email for updates"
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="text-center">
          <button
            type="submit"
            className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-md hover:opacity-90 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </section>

    </div>
  );
};

export default ContactPage;
