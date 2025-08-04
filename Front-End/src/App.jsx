import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import { Routes, Route } from 'react-router-dom'
import Start from './pages/Start'
import ForgotPassword from './pages/ForgotPassword'
import AdminLogin from './pages/Adminlogin'
import Home from './pages/Home'
import CreateCourse from './pages/CreateCourse'
import Profile from './pages/Profile'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/dashboard' element={<Home />} />
        <Route path='/create-course' element={<CreateCourse />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>

    </>
  )
}

export default App
