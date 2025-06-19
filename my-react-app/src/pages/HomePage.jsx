import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.webp";
import CountUp from 'react-countup';
import img8 from '../assets/img8.jpg'
import img9 from '../assets/img9.jpg'
import img10 from '../assets/img10.jpg'
import img11 from '../assets/img11.avif'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const dummyChartData = [
  { name: "Jan", volunteers: 40 },
  { name: "Feb", volunteers: 70 },
  { name: "Mar", volunteers: 100 },
  { name: "Apr", volunteers: 60 },
  { name: "May", volunteers: 90 },
  { name: "Jun", volunteers: 120 },
];


const slides = [
  {
    image: "/images/volunteer1.jpg",
    title: "Empower Volunteers",
    description: "Connect, support, and engage with passionate individuals.",
  },
  {
    image: "/images/volunteer2.jpg",
    title: "Manage Easily",
    description: "Organize tasks, schedules, and reports effortlessly.",
  },
  {
    image: "/images/volunteer3.jpg",
    title: "Celebrate Impact",
    description: "Recognize contributions and share achievements.",
  },
  {
    image: "/images/volunteer4.jpg",
    title: "Train with Purpose",
    description: "Offer skill-building and meaningful mentorship.",
  },
  {
    image: "/images/volunteer5.jpg",
    title: "Build Communities",
    description: "Unite people with causes that matter.",
  },
];

const stats = [
  { label: "Volunteers", value: 1245 },
  { label: "Events Organized", value: 134 },
  { label: "Hours Served", value: 8765 },
];

const volunteerRoles = [
  {
    icon: "🤝",
    title: "Community Helper",
    desc: "Assist with outreach and on-site event coordination.",
  },
  {
    icon: "📝",
    title: "Administrative Support",
    desc: "Help with data entry, scheduling, and communications.",
  },
  {
    icon: "🎤",
    title: "Spokesperson",
    desc: "Represent the organization in local events and media.",
  },
];

const events = [
  {
    des: "Join us to clean and protect our beautiful beaches.Together, we can keep the shoreline safe and pollution",
    title: "Beach Cleanup Drive",
    image: img2,
  },
  {
    des: "Help us sort and pack nutritious food for those in need.Your time can bring hope and hunger relief to many families.",
    title: "Food Bank Volunteer Day",
    image: img3,
  },
  {
    des: "Empower young minds through guidance and support.Join us to inspire the next generation of leaders.",
    title: "Youth Mentoring Workshop",
    image: img4,
  },
];

const faqs = [
  {
    question: "How do I become a volunteer?",
    answer:
      "Simply sign up through our Volunteer Signup page and attend an orientation session.",
  },
  {
    question: "Is there a minimum time commitment?",
    answer: "No, you can volunteer as much or as little as you want.",
  },
  {
    question: "Do I need prior experience?",
    answer: "No experience necessary! Training is provided for all roles.",
  },
];

export default function HomePage() {
  const [faqOpenIndex, setFaqOpenIndex] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [volunteerCount, setVolunteerCount] = useState(0);
  const [orgCount, setOrgCount] = useState(0);

  useEffect(() => {
    let v = 0, o = 0;
    const interval = setInterval(() => {
      if (v < 1500) setVolunteerCount((v += 25));
      if (o < 250) setOrgCount((o += 5));
      if (v >= 1500 && o >= 250) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const toggleFaq = (index) =>
    setFaqOpenIndex(faqOpenIndex === index ? null : index);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 text-white">
      {/* Header */}
      <header className="p-6 text-center">
  <motion.h1
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1 }}
    className="text-3xl md:text-5xl font-extrabold font-poppins bg-gradient-to-r from-blue-900 via-indigo-900 text-transparent bg-clip-text drop-shadow-md transition-all duration-500"
  >
    Volunteer Management System
  </motion.h1>
  <motion.p
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.5, duration: 1 }}
    className="mt-3 text-base md:text-xl text-gray-700 dark:text-gray-700 font-poppins transition-all duration-500"
  >
    Organize, Engage, and Appreciate Volunteers Effectively
  </motion.p>
</header>



      {/* Slideshow */}
      <section className="max-w-6xl mx-auto p-6 bg-blue-50 rounded-xl">
  <div className="flex flex-col md:flex-row items-center gap-6">
    {/* Left Image */}
    <img
      src={img1} // Replace with your actual image path
      alt="Volunteer"
      className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
    />

    {/* Right Text */}
    <div className="text-center md:text-left md:w-1/2">
      <h2 className="text-3xl font-bold text-blue-700 mb-3">Join the Movement</h2>
      <p className="text-lg text-gray-700">
        Be a part of VolunteerHub and help bring positive change to your community. Connect, serve, and grow together.
      </p>
    </div>
  </div>
</section>

<div className="min-h-screen bg-gradient-to-br   text-blue-950">
      {/* Header */}
      <div className="text-center py-12 px-6 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold mb-4 tracking-wide"
        >
          About VolunteerHub
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
          className="text-lg md:text-xl leading-relaxed"
        >
          At VolunteerHub, we empower communities by connecting passionate volunteers
          with organizations that make a difference. Whether you're looking to give back,
          gain skills, or grow your network, we provide a platform designed to make
          volunteering easy, impactful, and rewarding.
        </motion.p>
      </div>

      {/* What is a Volunteer & Organization */}
      <section className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Volunteer */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="md:flex md:items-center bg-white bg-opacity-10 rounded-xl p-6 shadow-lg"
        >
          <img
            src={img8}
            alt="Volunteer"
            className="md:w-1/2 rounded-lg object-cover mb-6 md:mb-0 md:mr-8"
          />
          <div>
            <h2 className="text-2xl font-semibold mb-4">What is a Volunteer?</h2>
            <p className="leading-relaxed text-lg">
              A volunteer is someone who freely offers their time and skills to support
              causes they care about. Volunteers drive social change by providing
              assistance in community outreach, event coordination, mentoring, and more.
            </p>
          </div>
        </motion.div>

        {/* Organization */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="md:flex md:items-center bg-white bg-opacity-10 rounded-xl p-6 shadow-lg"
        >
          <div className="md:w-1/2 md:order-2 md:ml-8 mb-6 md:mb-0">
            <img
              src={img9}
              alt="Organization"
              className="rounded-lg object-cover w-full"
            />
          </div>
          <div className="md:w-1/2 md:order-1">
            <h2 className="text-2xl font-semibold mb-4">What is an Organization?</h2>
            <p className="leading-relaxed text-lg">
              Organizations are the backbone of community initiatives, offering structured
              programs, resources, and opportunities for volunteers to contribute.
              They facilitate impactful projects and create lasting benefits for society.
            </p>
          </div>
        </motion.div>
      </section>

      

      {/* Certification Info */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="md:flex md:items-center bg-white bg-opacity-20 rounded-xl p-8 shadow-lg"
        >
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold mb-4 text-center md:text-left">Certification Program</h2>
            <p className="max-w-xl mx-auto md:mx-0 text-center md:text-left leading-relaxed text-lg">
              VolunteerHub offers official certifications that recognize your time and
              impact in various volunteering roles. These certifications are valid proofs
              of your commitment and can be shared with employers, educational
              institutions, or community organizations.
            </p>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 md:ml-10">
            <img
              src={img11}
              alt="Certification"
              className="rounded-xl shadow-lg object-cover w-full"
            />
          </div>
        </motion.div>
      </section>

      

      
    </div>

      {/* Why VolunteerHub */}
      <section className="text-center px-6 py-12 bg-white text-black">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose VolunteerHub?</h2>
        <p className="max-w-3xl mx-auto text-lg">
          Whether you're a nonprofit looking to manage your volunteer workforce or a passionate individual seeking to give back to the community, VolunteerHub makes it easier to connect, collaborate, and celebrate impact.
        </p>
      </section>

      {/* Events */}
      <section className="py-12 px-6 bg-pink-100 text-black">
        <h2 className="text-3xl font-bold text-center mb-8">Get Involved </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {events.map((event, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md overflow-hidden transition hover:scale-105"
            >
              <img src={event.image} alt={event.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.des}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

{/* Stats & Recharts Section */}
      <section className="max-w-6xl mx-auto py-12 px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <motion.h2 className="text-3xl font-bold mb-6">Volunteering Trends 2025</motion.h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dummyChartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="volunteers" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center md:text-left">
          <motion.h3 className="text-2xl font-semibold mb-4 text-purple-800">
            Our Growing Impact
          </motion.h3>
          <div className="flex flex-col space-y-6 text-4xl font-bold">
            <div className="text-blue-700">
              <span>{volunteerCount}+</span> Volunteers
            </div>
            <div className="text-pink-700">
              <span>{orgCount}+</span> Partner Organizations
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-12 px-6 bg-white text-black">
        <h2 className="text-3xl font-bold text-center mb-8">Volunteer Roles</h2>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          {volunteerRoles.map((role, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-xl">
              <div className="text-4xl mb-2">{role.icon}</div>
              <h3 className="text-xl font-semibold">{role.title}</h3>
              <p className="text-gray-700 mt-2">{role.desc}</p>
            </div>
          ))}
        </div>
      </section>

      

{/* Testimonials */}
      <section className="bg-gradient-to-tr from-purple-100 via-blue-100 to-pink-100 py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-10 text-purple-800">What Volunteers Say</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Anjali M.",
              quote: "Volunteering here changed my life. I gained confidence and made lifelong friends.",
              img: "https://media.istockphoto.com/id/1618846975/photo/smile-black-woman-and-hand-pointing-in-studio-for-news-deal-or-coming-soon-announcement-on.jpg?s=612x612&w=0&k=20&c=LUvvJu4sGaIry5WLXmfQV7RStbGG5hEQNo8hEFxZSGY=",
            },
            {
              name: "Ravi K.",
              quote: "The platform is easy to use and connects you with real impact projects.",
              img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
            },
            {
              name: "Neha S.",
              quote: "Certifications from VolunteerHub helped me in job interviews!",
              img: "https://plus.unsplash.com/premium_photo-1689551670902-19b441a6afde?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fHww",
            },
          ].map((t, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow-md p-6 text-center"
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="italic text-gray-700 mb-2">"{t.quote}"</p>
              <h4 className="text-lg font-semibold text-purple-800">{t.name}</h4>
            </motion.div>
          ))}
        </div>
      </section>
{/* Call to Action */}
      <div className="text-center py-12 px-6 ">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-3xl md:text-4xl font-bold mb-4 text-blue-800"
        >
          Be the Change. Volunteer Today.
        </motion.h2>
        <p className="text-lg max-w-2xl mx-auto text-blue-800">
          Join a growing network of kind-hearted individuals. Every helping hand counts.
        </p>
      </div>
      
    </div>
  );
}
