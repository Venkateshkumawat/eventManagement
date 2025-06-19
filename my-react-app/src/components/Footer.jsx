import React from 'react'
import { Link } from 'react-router-dom'

const FooterPage = () => {
  return (
    <div>
      <><footer className="bg-indigo-950 text-gray-300 py-8 text-center">
              <div className="max-w-5xl mx-auto px-4">
                <p className="text-lg font-semibold mb-2">VolunteerHub</p>
                <p className="text-sm mb-4">© 2025 VolunteerHub. All rights reserved.</p>
                <div className="flex justify-center space-x-6 text-sm">
                  <Link to="/" className="hover:underline">
                    Home
                  </Link>
                  <Link to="/about" className="hover:underline">
                    About
                  </Link>
                  <Link to="/event" className="hover:underline">
                    Event
                  </Link>
                  <Link to="/contact" className="hover:underline">
                    Contact
                  </Link>
                </div>
              </div>
            </footer>
      
      </>
    </div>
  )
}

export default FooterPage
