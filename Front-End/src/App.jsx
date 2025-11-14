import './App.css'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'

// Auth Pages
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import ForgotPassword from './pages/ForgotPassword'
import CreateNewPassword from './pages/CreateNewPassword'


// Main App Pages
import Home from './pages/Home'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import History from './pages/History'

// Course Pages
import CreateCourse from './pages/CreateCourse'
import EditCourse from './pages/EditCourse'
import CourseDetails from './pages/CourseDetails'
import MyEnrollments from './pages/MyEnrollments'



const CourseRedirect = () => {
  const { courseId } = useParams()
  return <Navigate to={`/courses/${courseId}`} replace />
}

function App() {
  return (
    <Routes>



      {/* Authentication Routes */}
      <Route path="/auth/login" element={<UserLogin />} />
      <Route path="/auth/signup" element={<UserSignup />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<CreateNewPassword />} />
     

      {/* Legacy auth routes for backward compatibility */}
      <Route path="/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/signup" element={<Navigate to="/auth/signup" replace />} />
      <Route path="/forgot-password" element={<Navigate to="/auth/forgot-password" replace />} />
      <Route path="/create-new-password" element={<Navigate to="/auth/reset-password" replace />} />

      {/* Main App Routes */}
      <Route path="/home" element={<Home />} />
      <Route path="/history" element={<History />} />
      <Route path="/" element={<Navigate to="/home" replace />} />
      {/* User Profile Routes */}
      <Route path="/profile/:userId" element={<Profile />} />
      <Route path="/profile/edit" element={<EditProfile />} />

      {/* Course Routes */}
      <Route path="/courses/create" element={<CreateCourse />} />
      <Route path="/courses/edit/:courseId" element={<EditCourse />} />
      <Route path="/courses/:courseId" element={<CourseDetails />} />
      <Route path="/courses/my-enrollments" element={<MyEnrollments />} />
      {/* <Route path="/courses/search" element={<SearchResults />} /> */}

      {/* Legacy course routes for backward compatibility */}
      <Route path="/create-course" element={<Navigate to="/courses/create" replace />} />
      <Route path="/edit-course/:courseId" element={<Navigate to="/courses/edit/:courseId" replace />} />
      <Route path="/course/:courseId" element={<CourseRedirect />} />
      <Route path="/my-enrollments" element={<Navigate to="/courses/my-enrollments" replace />} />
      <Route path="/edit-profile" element={<Navigate to="/profile/edit" replace />} />

    
      {/* 404 Not Found - Redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App