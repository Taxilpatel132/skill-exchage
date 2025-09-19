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
import CreateNewPassword from './pages/CreateNewPassword'
import History from './pages/History'
import CourseDetails from './pages/CourseDetails'
import EditProfile from './pages/EditProfile'
import MyEnrollments from './pages/MyEnrollments'

function App() {


  return (
    <>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<UserLogin />} />
        <Route path="/signup" element={<UserSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/home' element={<Home />} />
        <Route path='/create-course' element={<CreateCourse />} />

        <Route path='/profile/:userId' element={<Profile />} />
        <Route path='/create-new-password' element={<CreateNewPassword />} />

        <Route path="/course/:courseId" element={<CourseDetails />} />

        <Route path='/history' element={<History />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />


      </Routes>

    </>
  )
}

export default App