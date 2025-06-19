import React from 'react'
import {AuthProvider} from './context/authContext'
import Navbar from './components/Navbar'
import { Route,Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import FooterPage from './components/Footer'
import ContactPage from './pages/ContactPage'
import LoginForm from './pages/LoginPage'
import SignupForm from './pages/SignupPage'
import Profile from './pages/ProfilePage'
import EventPage from './pages/EventPage'
import Myevents from './pages/Myevents'

const App = () => {
  return (
    <>
    <AuthProvider>
      <Navbar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/contact' element={<ContactPage/>}/>
        <Route path='/login' element={<LoginForm/>}/>
        <Route path='/signup' element={<SignupForm/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/event' element={<EventPage/>}/>
        <Route path='/myevent' element={<Myevents/>} />
      </Routes>
      <FooterPage/>
    </AuthProvider>
   
    </>
  )
}

export default App
