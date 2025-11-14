# Skill Exchange - Frontend

Modern, responsive React frontend for the Skill Exchange platform - a learning management system where users can discover courses, share skills, and learn from each other using a points-based economy.

## 🚀 Features

### 🎓 User Experience

- **Authentication System** - Login, signup, password reset with OTP verification
- **User Profiles** - View and edit profiles, follow system, skills showcase
- **Course Discovery** - Browse, search, and filter courses
- **Course Creation** - Create and manage your own courses with modules
- **Enrollment System** - Enroll in courses using points
- **Real-time Notifications** - Socket.io powered instant updates
- **Reviews & Ratings** - Rate courses and read reviews
- **Q&A System** - Ask questions and get answers from instructors
- **Progress Tracking** - Track your learning progress
- **Responsive Design** - Fully responsive mobile-first design

### 🎨 UI/UX Features

- **Modern Design** - Built with Tailwind CSS
- **Smooth Animations** - GSAP-powered animations
- **Loading States** - Beautiful loading indicators
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Instant feedback for actions
- **Search Functionality** - Real-time search with suggestions
- **Profile Cards** - Beautiful user and course cards

## 🛠️ Tech Stack

- **Framework:** React 19.1.0
- **Build Tool:** Vite 7.0.4
- **Routing:** React Router DOM 7.7.1
- **Styling:** Tailwind CSS 3.4.0
- **Animations:** GSAP 3.13.0
- **HTTP Client:** Axios 1.11.0
- **Real-time:** Socket.io Client 4.8.1
- **File Upload:** Cloudinary
- **Icons:** Lucide React 0.544.0
- **State Management:** React Context API

## 📋 Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Backend API running (see [Backend README](../Back-End/README.md))
- Cloudinary account (for image uploads)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Taxilpatel132/skill-exchage.git
   cd skill-exchage/Front-End
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `Front-End` directory:

   ```env
   # Backend API URL
   VITE_API_URL=http://localhost:3000

   # Cloudinary Configuration (for image uploads)
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloud_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

   **Note:** Never put `CLOUDINARY_API_SECRET` in frontend. Use unsigned upload presets instead.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   App will run on `http://localhost:5173`

## 📁 Project Structure

```
Front-End/
├── index.html                  # HTML entry point
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── package.json                # Dependencies and scripts
│
├── public/                     # Static assets
│
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Main app component with routes
    ├── App.css                 # Global styles
    ├── index.css               # Tailwind imports
    │
    ├── assets/                 # Images, fonts, etc.
    │
    ├── pages/                  # Page components
    │   ├── UserLogin.jsx       # Login page
    │   ├── UserSignup.jsx      # Signup page
    │   ├── ForgotPassword.jsx  # Password reset request
    │   ├── CreateNewPassword.jsx # Password reset with OTP
    │   ├── Home.jsx            # Main dashboard
    │   ├── Profile.jsx         # User profile view
    │   ├── EditProfile.jsx     # Profile editor
    │   ├── CourseDetails.jsx   # Course detail page
    │   ├── CreateCourse.jsx    # Course creation
    │   ├── EditCourse.jsx      # Course editor
    │   ├── MyEnrollments.jsx   # User's enrolled courses
    │   ├── History.jsx         # User activity history
    │   └── Adminlogin.jsx      # Admin login (OTP-based)
    │
    ├── components/             # Reusable components
    │   ├── Navbar.jsx          # Main navigation
    │   ├── Footer.jsx          # Footer component
    │   ├── CourseCard.jsx      # Course card display
    │   ├── EnrolledCourseCard.jsx # Enrolled course card
    │   ├── UserCard.jsx        # User profile card
    │   ├── UserProfile.jsx     # User profile component
    │   ├── SearchBar.jsx       # Search input
    │   ├── SearchResults.jsx   # Search results display
    │   ├── Notifications.jsx   # Notifications dropdown
    │   ├── ProfileDropdown.jsx # User menu dropdown
    │   ├── ModulesSection.jsx  # Course modules display
    │   ├── QASection.jsx       # Q&A section
    │   ├── ReviewsSection.jsx  # Reviews display
    │   ├── StarRating.jsx      # Star rating component
    │   ├── OTPInput.jsx        # OTP input field
    │   ├── Loading.jsx         # Loading spinner
    │   ├── CourseNavbar.jsx    # Course page navigation
    │   ├── AdminNavbar.jsx     # Admin navigation
    │   └── CreateCourse/
    │       └── ModuleCreationSection.jsx # Module creator
    │
    ├── context/                # React Context providers
    │   ├── UserContext.jsx     # User authentication state
    │   └── SocketContext.jsx   # Socket.io connection
    │
    ├── hooks/                  # Custom React hooks
    │   └── use-create-userReport.jsx # User report hook
    │
    └── utils/                  # Utility functions
        └── cloudinary.js       # Cloudinary upload helper
```

## 🛣️ Routes

### Public Routes

```
/                               → Redirects to /home
/home                           → Main dashboard
/auth/login                     → User login
/auth/signup                    → User registration
/auth/forgot-password           → Password reset request
/auth/reset-password            → Password reset with OTP
/courses/:courseId              → Course details (public view)
```

### Protected Routes (Requires Authentication)

```
/profile/:userId                → User profile view
/profile/edit                   → Edit your profile
/courses/create                 → Create new course
/courses/edit/:courseId         → Edit your course
/courses/my-enrollments         → Your enrolled courses
/history                        → Activity history
```

### Legacy Routes (Backward Compatibility)

All old routes automatically redirect to new paths:

```
/login                          → /auth/login
/signup                         → /auth/signup
/create-course                  → /courses/create
/edit-course/:id                → /courses/edit/:id
/course/:id                     → /courses/:id
```

## 🎨 Styling

### Tailwind CSS

The app uses Tailwind CSS for styling with custom configuration.

### Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- All components are fully responsive

## 🔐 Authentication Flow

1. **Login/Signup** - User enters credentials
2. **JWT Token** - Backend returns JWT token
3. **Local Storage** - Token stored in `localStorage`
4. **UserContext** - Token added to context for global access
5. **Protected Routes** - Routes check authentication status
6. **Auto Redirect** - Unauthenticated users redirected to login

### Local Storage Keys

```javascript
localStorage.getItem("token"); // JWT token
localStorage.getItem("myId"); // User ID
localStorage.getItem("email"); // User email
```

## 🔔 Real-time Features

### Socket.io Integration

The app uses Socket.io for real-time updates:

```javascript
// SocketContext.jsx
const socket = io(VITE_API_URL, {
  auth: { token: userToken },
});

// Listen for notifications
socket.on("notification", (data) => {
  // Update UI with new notification
});
```

### Real-time Events

- New course enrollments
- Q&A answers
- Follower notifications
- Course updates

## 📤 File Uploads

### Cloudinary Integration

Images are uploaded directly to Cloudinary for profile pictures, course thumbnails, etc.

### Supported Formats

- Images: JPG, PNG, GIF, WebP
- Maximum size: 10MB

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Development Server

- Runs on `http://localhost:5173`
- Hot Module Replacement (HMR) enabled
- Fast refresh for React components

## 🚀 Deployment

### Build for Production

1. **Update environment variables**

   ```env
   VITE_API_URL=https://your-production-api.com
   ```

2. **Build the app**

   ```bash
   npm run build
   ```

3. **Test the build**
   ```bash
   npm run preview
   ```

### Deployment Platforms

#### Vercel (Recommended)

```bash
vercel --prod
```

#### Netlify

- Build command: `npm run build`
- Publish directory: `dist`

## 🎯 Key Features

### Course Enrollment Flow

1. User browses courses
2. Clicks "Enroll" button
3. System checks user's points balance
4. Points deducted and transferred to instructor
5. User added to course enrollments
6. Real-time notification sent

### Search Functionality

- Real-time search as you type
- Search courses and users
- Filter by category, level, rating
- Sort by relevance, date, popularity

### Progress Tracking

- Track completion of modules
- Calculate overall course progress
- Display progress bars

### Notifications System

- Real-time via Socket.io
- Dropdown notification panel
- Mark as read functionality
- Notification badges

## 🐛 Troubleshooting

### Common Issues

**Port already in use**

```bash
# Change port in vite.config.js
server: { port: 5174 }
```

**CORS errors**

- Ensure backend CORS allows your frontend URL
- Check `VITE_API_URL` is correct

**Build fails**

```bash
# Clear cache
rm -rf node_modules
rm package-lock.json
npm install
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Taxil Patel** - [Taxilpatel132](https://github.com/Taxilpatel132)

## 📞 Support

For issues or questions:

- Create an issue on GitHub
- Check [Backend README](../Back-End/README.md) for API documentation
- Review component code for usage examples

---

**Built with ❤️ using React + Vite**
