# Skill Exchange - Backend API

Backend server for the Skill Exchange platform - a learning management system where users can share skills, create courses, and enroll in courses using a points-based system.

## 🚀 Features

- **User Management** - Registration, authentication, profile management
- **Course System** - Create, update, browse, and enroll in courses
- **Points-Based Economy** - Users earn and spend points for courses
- **Real-time Notifications** - Socket.io powered instant notifications
- **Search & Discovery** - Advanced search for courses and users
- **Q&A System** - Course-specific questions and answers
- **Reviews & Ratings** - Course feedback and rating system
- **File Uploads** - Cloudinary integration for images and media
- **Email Services** - OTP verification and notifications via Nodemailer

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js v5.1.0
- **Database:** MongoDB (Mongoose ODM v8.16.1)
- **Authentication:** JWT + Argon2 password hashing
- **Real-time:** Socket.io v4.8.1
- **File Storage:** Cloudinary
- **Email:** Nodemailer
- **Validation:** Express-validator

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (for file uploads)
- Gmail account (for email notifications)

## 🔧 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Taxilpatel132/skill-exchage.git
   cd skill-exchage/Back-End
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the `Back-End` directory:

   ```env
   # MongoDB Connection
   MONGO_URL=your_mongodb_connection_string

   # Server Configuration
   PORT=3000

   # JWT Secret
   SECRET_KEY=your_secret_key_here

   # Email Configuration (Gmail)
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the server**

   ```bash
   npm start
   ```

   Server will run on `http://localhost:3000`

## 📁 Project Structure

```
Back-End/
├── app.js                      # Express app configuration
├── server.js                   # Server entry point with Socket.io
├── package.json                # Dependencies and scripts
├── export-real-data.js         # Database backup utility
│
├── auth-middleware/
│   └── auth.js                 # JWT authentication middleware
│
├── config/
│   └── cloudinary.js           # Cloudinary configuration
│
├── database/
│   └── db.js                   # MongoDB connection
│
├── models/                     # Mongoose schemas
│   ├── users.model.js          # User model
│   ├── course.model.js         # Course model
│   ├── module.model.js         # Module model
│   ├── notification.model.js   # Notification model
│   ├── review.model.js         # Review model
│   ├── course_qa.model.js      # Q&A model
│   ├── User_enroll.model.js    # Enrollment model
│   ├── coures_creator.model.js # Course creator model
│   ├── otp.model.js            # OTP model
│   ├── admin.model.js          # Admin model
│   └── blacklisttoken.model.js # Token blacklist model
│
├── controllers/                # Request handlers
│   ├── user.controller.js      # User operations
│   ├── course.cotroller.js     # Course operations
│   ├── search.controller.js    # Search functionality
│   ├── notification.controller.js # Notifications
│   └── admin.controller.js     # Admin operations
│
├── services/                   # Business logic
│   ├── user.service.js         # User service
│   ├── course.service.js       # Course service
│   ├── search.service.js       # Search service
│   ├── notification.service.js # Notification service
│   ├── otp.service.js          # OTP service
│   ├── blacklisttoken.service.js # Token service
│   └── admin.service.js        # Admin service
│
└── routes/                     # API routes
    ├── user.route.js           # User endpoints
    ├── course.route.js         # Course endpoints
    ├── search.route.js         # Search endpoints
    ├── notification.route.js   # Notification endpoints
    └── admin.route.js          # Admin endpoints
```

## 🔌 API Endpoints

### Authentication & Users

```http
POST   /users/register              # Register new user
POST   /users/login                 # User login
POST   /users/logout                # User logout
GET    /users/profile               # Get user profile
PUT    /users/profile               # Update user profile
POST   /users/forgot-password       # Request password reset
POST   /users/reset-password        # Reset password with OTP
GET    /users/search                # Search users by name
GET    /users/:userId               # Get user profile by ID
POST   /users/:userId/follow        # Follow a user
POST   /users/:userId/unfollow      # Unfollow a user
GET    /users/enrollments           # Get user's enrolled courses
```

### Courses

```http
POST   /course/create               # Create new course (auth)
PUT    /course/update/:courseId     # Update course (auth)
GET    /course/search/all           # Get all courses
GET    /course/details/:courseId    # Get course details
GET    /course/search               # Search courses by title
GET    /course/search/:courseId/enroll # Enroll in course (auth)
POST   /course/details/:courseId/question # Ask question (auth)
POST   /course/details/:courseId/question/:questionId/answer # Answer question (auth)
POST   /course/details/:courseId/rate # Rate course (auth)
GET    /course/details/:courseId/reviews # Get course reviews
GET    /course/details/:courseId/qa # Get course Q&A
```

### Search

```http
GET    /search/courses              # Search courses
GET    /search/users                # Search users
GET    /search/all                  # Search everything
POST   /search/advanced             # Advanced search with filters
GET    /search/suggestions          # Get search suggestions
GET    /search/popular              # Get popular searches
```

### Notifications

```http
GET    /notifications               # Get user notifications (auth)
PUT    /notifications/:id/read      # Mark notification as read (auth)
DELETE /notifications/:id           # Delete notification (auth)
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in requests:

```http
Authorization: Bearer <your_jwt_token>
```

Or via cookies (automatically handled by the frontend).

### Middleware Types

- **`authUser`** - Requires authentication
- **`optionalAuthUser`** - Authentication optional (enhances response if authenticated)

## 🔔 Real-time Features (Socket.io)

### Socket Events

**Client → Server:**

- `join_course` - Join a course room
- `leave_course` - Leave a course room

**Server → Client:**

- `notification` - Real-time notification
- `new_message` - New Q&A message
- `course_update` - Course updates

### Socket Authentication

Connect with JWT token:

```javascript
const socket = io("http://localhost:3000", {
  auth: {
    token: "your_jwt_token",
  },
});
```

## 💾 Database Backup

Export your database to JSON files:

```bash
node export-real-data.js
```

This creates backup files in the `../db-backup/` directory:

- `users.json`
- `courses.json`
- `modules.json`
- `notifications.json`
- `reviews.json`

See [db-backup/README.md](../db-backup/README.md) for more details.

## 🔒 Security Features

- **Password Hashing:** Argon2 (industry-leading security)
- **JWT Authentication:** Secure token-based auth
- **Token Blacklisting:** Logout invalidates tokens
- **OTP Verification:** Email-based verification
- **CORS Protection:** Configured allowed origins
- **Input Validation:** Express-validator for all inputs
- **SQL Injection Prevention:** Mongoose ODM protection

## 📧 Email Configuration

The app uses Gmail for sending emails. To set up:

1. Enable 2-Step Verification in your Google account
2. Generate an App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Add to `.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_char_app_password
   ```

## 📤 File Upload

Cloudinary is used for file uploads (profile pictures, course thumbnails, etc.).

**Setup:**

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your credentials from the dashboard
3. Add to `.env`

**Supported formats:**

- Images: JPG, PNG, GIF, WebP
- Maximum size: 10MB

## 🧪 Testing

Test Socket.io connection:

```bash
node test-socket.js
```

Test notification routes:

```bash
node test-notification-routes.js
```

## 🚀 Deployment

### Environment Setup

1. Set `NODE_ENV=production` in your hosting environment
2. Update CORS origins in `app.js` to your frontend domain
3. Use environment variables for all secrets
4. Enable MongoDB Atlas IP whitelist

### Recommended Platforms

- **Render** - Easy Node.js deployment
- **Railway** - Simple deployment with MongoDB
- **Heroku** - Classic PaaS platform
- **DigitalOcean App Platform** - Full control

### Production Checklist

- [ ] Update CORS origins to production URLs
- [ ] Set strong `SECRET_KEY`
- [ ] Configure MongoDB Atlas production cluster
- [ ] Set up Cloudinary production environment
- [ ] Configure production email credentials
- [ ] Enable database backups
- [ ] Set up logging and monitoring
- [ ] Configure SSL/HTTPS

## 📊 Points System

Users earn and spend points:

- **Initial Points:** 1000 points on registration
- **Earn Points:** Create courses, get enrollments
- **Spend Points:** Enroll in courses

Points are transferred between users upon enrollment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

- **Taxil Patel** - [Taxilpatel132](https://github.com/Taxilpatel132)

## 🐛 Known Issues

- Socket.io authentication requires manual token refresh on expiry
- File upload size limit may need adjustment for video content

## 📞 Support

For issues or questions:

- Create an issue on GitHub
- Check existing documentation
- Review API endpoint comments in code

## 🔄 Version History

- **v1.0.0** - Initial release
  - User authentication and management
  - Course creation and enrollment
  - Real-time notifications
  - Search functionality
  - Points-based economy

---

**Built with ❤️ for skill sharing and learning**
