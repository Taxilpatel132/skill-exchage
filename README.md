# 🎓 Skill Exchange

A modern full-stack learning management system where users can share skills, create courses, and learn from each other using a points-based economy. Built with React, Node.js, Express, and MongoDB.

[![GitHub stars](https://img.shields.io/github/stars/Taxilpatel132/skill-exchage?style=social)](https://github.com/Taxilpatel132/skill-exchage)
[![GitHub forks](https://img.shields.io/github/forks/Taxilpatel132/skill-exchage?style=social)](https://github.com/Taxilpatel132/skill-exchage/fork)
[![GitHub issues](https://img.shields.io/github/issues/Taxilpatel132/skill-exchage)](https://github.com/Taxilpatel132/skill-exchage/issues)

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [API Documentation](#-api-documentation)
- [Frontend Routes](#️-frontend-routes)
- [Database Backup](#-database-backup)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

Skill Exchange is a comprehensive learning platform that enables users to:

- **Share Knowledge** - Create and publish courses on any topic
- **Learn New Skills** - Enroll in courses created by other users
- **Earn & Spend Points** - Use a points-based economy for course transactions
- **Build Community** - Follow users, ask questions, leave reviews
- **Track Progress** - Monitor learning journey and achievements

### 🎯 Key Differentiators

- **Points System** - No real money transactions, purely skill-based economy
- **Real-time Updates** - Instant notifications via Socket.io
- **Course Q&A** - Interactive learning with instructor support
- **Progress Tracking** - Visual progress indicators for enrolled courses
- **Responsive Design** - Seamless experience across all devices

## ✨ Features

### 👤 User Management

- User registration and authentication (JWT + Argon2)
- Profile management with skills showcase
- Follow/unfollow system
- Email verification with OTP
- Password reset functionality
- User search and discovery

### 📚 Course System

- Create courses with multiple modules
- Rich course details (objectives, prerequisites, highlights)
- Course thumbnails and trailer videos
- Enrollment with points-based payment
- Course reviews and ratings (1-5 stars)
- Course Q&A system
- Progress tracking for enrolled courses
- Course search and filtering

### 💰 Points Economy

- Initial 1000 points on registration
- Earn points by creating popular courses
- Spend points to enroll in courses
- Points transferred between users on enrollment
- Point balance tracking

### 🔔 Real-time Features

- Instant notifications via Socket.io
- Real-time course updates
- Live Q&A notifications
- Follower activity updates

### 🔍 Search & Discovery

- Advanced search for courses and users
- Filter by category, level, rating
- Sort by relevance, popularity, date
- Search suggestions
- Popular searches tracking

## 🛠️ Tech Stack

### Frontend

- **React** 19.1.0 - UI library
- **Vite** 7.0.4 - Build tool and dev server
- **React Router** 7.7.1 - Client-side routing
- **Tailwind CSS** 3.4.0 - Utility-first CSS
- **GSAP** 3.13.0 - Animations
- **Axios** 1.11.0 - HTTP client
- **Socket.io Client** 4.8.1 - Real-time communication
- **Lucide React** 0.544.0 - Icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** 5.1.0 - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** 8.16.1 - ODM
- **Socket.io** 4.8.1 - Real-time engine
- **JWT** - Authentication
- **Argon2** 0.43.0 - Password hashing
- **Nodemailer** 7.0.4 - Email service
- **Cloudinary** 1.41.3 - Media storage
- **Express-validator** 7.3.0 - Input validation

## 📁 Project Structure

```
skill-exchage/
│
├── Front-End/                  # React frontend application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── context/            # React Context providers
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Utility functions
│   │   ├── App.jsx             # Main app with routes
│   │   └── main.jsx            # React entry point
│   ├── public/                 # Static assets
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind config
│   └── package.json            # Frontend dependencies
│
├── Back-End/                   # Express backend API
│   ├── models/                 # Mongoose models
│   ├── controllers/            # Request handlers
│   ├── services/               # Business logic
│   ├── routes/                 # API routes
│   ├── auth-middleware/        # Authentication
│   ├── config/                 # Configuration files
│   ├── database/               # DB connection
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry with Socket.io
│   ├── export-real-data.js     # Database backup script
│   └── package.json            # Backend dependencies
│
└── db-backup/                  # Database backup files
    ├── users.json              # User data backup
    ├── courses.json            # Course data backup
    ├── modules.json            # Module data backup
    ├── notifications.json      # Notification data backup
    ├── reviews.json            # Review data backup
    └── README.md               # Backup documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB** Atlas account or local instance ([Get Started](https://www.mongodb.com/cloud/atlas/register))
- **Cloudinary** account ([Sign Up](https://cloudinary.com/users/register/free))
- **Gmail** account for email services

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Taxilpatel132/skill-exchage.git
   cd skill-exchage
   ```

2. **Set up Backend**

   ```bash
   cd Back-End
   npm install
   ```

   Create `.env` file in `Back-End/`:

   ```env
   MONGO_URL=your_mongodb_connection_string
   PORT=3000
   SECRET_KEY=your_jwt_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

   Start backend:

   ```bash
   npm start
   ```

   Backend runs on `http://localhost:3000`

3. **Set up Frontend**

   ```bash
   cd ../Front-End
   npm install
   ```

   Create `.env` file in `Front-End/`:

   ```env
   VITE_API_URL=http://localhost:3000
   REACT_APP_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   REACT_APP_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

   Start frontend:

   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:5173`

4. **Access the application**

   Open your browser and navigate to `http://localhost:5173`

## ⚙️ Configuration

### Backend Environment Variables

| Variable                | Description                 | Required |
| ----------------------- | --------------------------- | -------- |
| `MONGO_URL`             | MongoDB connection string   | ✅       |
| `PORT`                  | Server port (default: 3000) | ✅       |
| `SECRET_KEY`            | JWT secret key              | ✅       |
| `EMAIL_USER`            | Gmail address for emails    | ✅       |
| `EMAIL_PASS`            | Gmail app password          | ✅       |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name       | ✅       |
| `CLOUDINARY_API_KEY`    | Cloudinary API key          | ✅       |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret       | ✅       |

### Frontend Environment Variables

| Variable                             | Description            | Required |
| ------------------------------------ | ---------------------- | -------- |
| `VITE_API_URL`                       | Backend API URL        | ✅       |
| `REACT_APP_CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud name  | ✅       |
| `REACT_APP_CLOUDINARY_UPLOAD_PRESET` | Unsigned upload preset | ✅       |

### Email Setup (Gmail)

1. Enable 2-Step Verification in your Google Account
2. Generate App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use the 16-character app password in `EMAIL_PASS`

### Cloudinary Setup

1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get credentials from dashboard
3. Create an unsigned upload preset:
   - Settings → Upload → Upload presets
   - Create preset with "Unsigned" mode

## 📡 API Documentation

### Base URL

```
http://localhost:3000
```

### Authentication

All authenticated endpoints require JWT token in header or cookie:

```http
Authorization: Bearer <token>
```

### Endpoints

#### User Routes (`/users`)

| Method | Endpoint            | Auth     | Description              |
| ------ | ------------------- | -------- | ------------------------ |
| POST   | `/register`         | ❌       | Register new user        |
| POST   | `/login`            | ❌       | User login               |
| POST   | `/logout`           | ✅       | User logout              |
| GET    | `/profile`          | ✅       | Get current user profile |
| PUT    | `/profile`          | ✅       | Update user profile      |
| POST   | `/forgot-password`  | ❌       | Request password reset   |
| POST   | `/reset-password`   | ❌       | Reset password with OTP  |
| GET    | `/search`           | Optional | Search users by name     |
| GET    | `/:userId`          | Optional | Get user by ID           |
| POST   | `/:userId/follow`   | ✅       | Follow a user            |
| POST   | `/:userId/unfollow` | ✅       | Unfollow a user          |
| GET    | `/enrollments`      | ✅       | Get user enrollments     |

#### Course Routes (`/course`)

| Method | Endpoint                                         | Auth     | Description        |
| ------ | ------------------------------------------------ | -------- | ------------------ |
| POST   | `/create`                                        | ✅       | Create new course  |
| PUT    | `/update/:courseId`                              | ✅       | Update course      |
| GET    | `/search/all`                                    | Optional | Get all courses    |
| GET    | `/details/:courseId`                             | Optional | Get course details |
| GET    | `/search`                                        | Optional | Search courses     |
| GET    | `/search/:courseId/enroll`                       | ✅       | Enroll in course   |
| POST   | `/details/:courseId/question`                    | ✅       | Ask question       |
| POST   | `/details/:courseId/question/:questionId/answer` | ✅       | Answer question    |
| POST   | `/details/:courseId/rate`                        | ✅       | Rate course        |
| GET    | `/details/:courseId/reviews`                     | Optional | Get reviews        |
| GET    | `/details/:courseId/qa`                          | Optional | Get Q&A            |

#### Search Routes (`/search`)

| Method | Endpoint       | Auth     | Description       |
| ------ | -------------- | -------- | ----------------- |
| GET    | `/courses`     | Optional | Search courses    |
| GET    | `/users`       | Optional | Search users      |
| GET    | `/all`         | Optional | Search everything |
| POST   | `/advanced`    | Optional | Advanced search   |
| GET    | `/suggestions` | Optional | Get suggestions   |
| GET    | `/popular`     | Optional | Popular searches  |

#### Notification Routes (`/notifications`)

| Method | Endpoint    | Auth | Description         |
| ------ | ----------- | ---- | ------------------- |
| GET    | `/`         | ✅   | Get notifications   |
| PUT    | `/:id/read` | ✅   | Mark as read        |
| DELETE | `/:id`      | ✅   | Delete notification |

### Socket.io Events

**Client → Server:**

- `join_course` - Join course room
- `leave_course` - Leave course room

**Server → Client:**

- `notification` - New notification
- `new_message` - New Q&A message
- `course_update` - Course update

## 🛣️ Frontend Routes

### Public Routes

```
/                               → Landing/Home
/home                           → Main dashboard
/auth/login                     → Login page
/auth/signup                    → Signup page
/auth/forgot-password           → Password reset request
/auth/reset-password            → Reset with OTP
/courses/:courseId              → Course details (public)
```

### Protected Routes

```
/profile/:userId                → User profile
/profile/edit                   → Edit profile
/courses/create                 → Create course
/courses/edit/:courseId         → Edit course
/courses/my-enrollments         → My enrollments
/history                        → Activity history
```

## 💾 Database Backup

### Export Database

Export all collections to JSON files:

```bash
cd Back-End
node export-real-data.js
```

This creates backup files in `db-backup/`:

- `users.json` - User data (passwords excluded)
- `courses.json` - Course information
- `modules.json` - Course modules
- `notifications.json` - Notifications
- `reviews.json` - Reviews and ratings

### Scheduled Backups

**Windows (Task Scheduler):**

```powershell
$action = New-ScheduledTaskAction -Execute "node" -Argument "C:\path\to\Back-End\export-real-data.js"
$trigger = New-ScheduledTaskTrigger -Daily -At 2am
Register-ScheduledTask -Action $action -Trigger $trigger -TaskName "SkillExchangeBackup"
```

**Linux/Mac (Cron):**

```bash
0 2 * * * cd /path/to/Back-End && node export-real-data.js
```

### Restore Database

Using MongoDB's `mongoimport`:

```bash
mongoimport --uri="your_mongo_uri" --collection=users --file=db-backup/users.json --jsonArray
mongoimport --uri="your_mongo_uri" --collection=courses --file=db-backup/courses.json --jsonArray
mongoimport --uri="your_mongo_uri" --collection=modules --file=db-backup/modules.json --jsonArray
```

See [db-backup/README.md](db-backup/README.md) for detailed backup documentation.

## 🚀 Deployment

### Backend Deployment

**Recommended Platforms:**

- [Render](https://render.com/) - Easy deployment
- [Railway](https://railway.app/) - Simple setup
- [Heroku](https://heroku.com/) - Classic PaaS
- [DigitalOcean](https://www.digitalocean.com/) - Full control

**Production Checklist:**

- [ ] Update CORS origins to production URLs
- [ ] Set strong `SECRET_KEY`
- [ ] Configure MongoDB Atlas production cluster
- [ ] Set up environment variables
- [ ] Enable database backups
- [ ] Configure SSL/HTTPS
- [ ] Set up logging and monitoring

### Frontend Deployment

**Vercel (Recommended):**

```bash
cd Front-End
vercel --prod
```

**Netlify:**

- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables: Add `VITE_API_URL`

### Environment Variables for Production

Update both frontend and backend `.env` files with production values:

**Backend:**

```env
MONGO_URL=mongodb+srv://production-cluster
PORT=3000
SECRET_KEY=strong-production-secret
```

**Frontend:**

```env
VITE_API_URL=https://your-api-domain.com
```

## 🔒 Security Features

- **Password Security** - Argon2 hashing (industry-leading)
- **JWT Authentication** - Secure token-based auth
- **Token Blacklisting** - Logout invalidates tokens
- **Email Verification** - OTP-based verification
- **CORS Protection** - Configured allowed origins
- **Input Validation** - Express-validator on all inputs
- **SQL Injection Prevention** - Mongoose ODM protection
- **Rate Limiting** - Prevent abuse (recommended to add)

## 🧪 Testing

### Backend Tests

```bash
cd Back-End
node test-socket.js              # Test Socket.io
node test-notification-routes.js # Test notifications
```

### Frontend Development

```bash
cd Front-End
npm run dev                      # Development server
npm run build                    # Production build
npm run preview                  # Preview build
npm run lint                     # Run ESLint
```

## 🤝 Contributing

We welcome contributions! Here's how to contribute:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

## 📊 Project Status

- ✅ User authentication and management
- ✅ Course creation and enrollment
- ✅ Points-based economy
- ✅ Real-time notifications
- ✅ Search functionality
- ✅ Reviews and ratings
- ✅ Q&A system
- ✅ Progress tracking
- 🔄 Admin dashboard (in progress)
- 🔄 Video content support (planned)
- 🔄 Certificate generation (planned)

## 🐛 Known Issues

- Socket.io authentication requires manual token refresh on expiry
- File upload size limit may need adjustment for video content
- Search pagination needs optimization for large datasets

## 📝 License

This project is licensed under the ISC License.

## 👥 Authors

**Taxil Patel**

- GitHub: [@Taxilpatel132](https://github.com/Taxilpatel132)
- Email: taxilpatel005@gmail.com

## 🙏 Acknowledgments

- React team for amazing framework
- MongoDB team for excellent database
- Tailwind CSS for utility-first styling
- Socket.io for real-time capabilities
- Cloudinary for media management

## 📞 Support

Need help? Here are your options:

- 📖 [Backend README](Back-End/README.md) - API documentation
- 📖 [Frontend README](Front-End/README.md) - UI documentation
- 📖 [Backup README](db-backup/README.md) - Database backup guide
- 🐛 [Create an Issue](https://github.com/Taxilpatel132/skill-exchage/issues)
- 💬 Check existing issues and discussions

## 📈 Roadmap

### Version 2.0 (Planned)

- [ ] Admin dashboard with analytics
- [ ] Video content upload and streaming
- [ ] Certificate generation
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Gamification features
- [ ] Live classes via WebRTC
- [ ] Payment gateway integration (optional)

## 🌟 Star History

If you find this project helpful, please consider giving it a star! ⭐

---

**Built with ❤️ for skill sharing and lifelong learning**

_Last Updated: November 14, 2025_
