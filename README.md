# Ink & Echo — Full-Stack Blog Platform with Comments (MERN Stack)

A modern, responsive blogging platform built with the **MERN** stack (**MongoDB, Express.js, React.js, Node.js**) featuring JWT authentication, rich blog management, real-time interactive comments, debounced search, category filtering, and a clean minimalist design system.

---

## 🌟 Key Features

### 🔐 User Authentication & Authorization
- **User Registration & Login:** Email/password registration with validation and encrypted storage using `bcrypt.js`.
- **JWT-based Security:** Secure stateless token authentication attached automatically to API requests.
- **Protected Routes:** Only authenticated users can publish stories, edit their posts, leave comments, and edit their profile.
- **Resource Ownership Verification:** Authors can only edit and delete their own posts and comments.
- **Fast Demo Sign-in:** Instant 1-click credentials auto-fill on the login screen for testing.

### 📝 Blog Post Management
- **Full CRUD:** Create, view, edit, and delete articles.
- **Rich Post Details:** Formatted headings, blockquotes, code styling, author bio cards, and banner images.
- **Live Search & Filter:** Debounced title and keyword search combined with category filtering (Web Development, Technology, Design, Career, Tutorials, General).
- **Reading Time:** Automatic estimation calculated from post content length.
- **Preset Image Picker:** Quick-select cover images or provide custom image URLs with instant preview.
- **Pagination:** Clean, responsive page navigation.

### 💬 Interactive Comments System
- **Real-Time Discussion:** Comments update dynamically upon submission without page reloads.
- **Inline Editing:** Authors can update their comments inline with Save/Cancel controls.
- **Safe Deletion:** Deletion confirmation dialogs prevent accidental removals.
- **Dynamic Counters:** Comment badges and indicators update immediately across post cards and detail headers.

### 🎨 Design & Aesthetic Excellence
- **Design Philosophy:** Minimalist white backdrop with deep navy typography and vibrant primary blue accents (`#2563eb`).
- **Typography:** Google Fonts pairing with *Plus Jakarta Sans* and *JetBrains Mono*.
- **Tactile Feedback:** Smooth micro-interactions, subtle elevation drop shadows, and hover lifts.
- **Modern State Displays:** Shimmer skeleton placeholders, toast notifications (`react-hot-toast`), and responsive mobile layouts.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, React Router DOM v6, Axios, Lucide React, React Hot Toast, Vanilla CSS |
| **Backend** | Node.js, Express.js, Mongoose, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Morgan, CORS |
| **Database** | MongoDB (Local service or MongoDB Atlas) |
| **Build & Tooling** | Vite, npm |

---

## 📁 Project Directory Structure

```text
Blog/
├── client/                     # Frontend React Application (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx      # Sticky responsive navigation & profile dropdown
│   │   │   ├── Footer.jsx      # Clean brand footer
│   │   │   ├── PostCard.jsx    # Card with thumbnail, tag, and stats
│   │   │   ├── CommentItem.jsx # Comment card with inline editing
│   │   │   ├── CommentForm.jsx # Submission form with auth guard
│   │   │   ├── ConfirmModal.jsx# Delete confirmation modal
│   │   │   ├── SkeletonLoader.jsx # Shimmer loading placeholders
│   │   │   ├── EmptyState.jsx  # Empty state component
│   │   │   └── ProtectedRoute.jsx # Route authentication guard
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication state & session manager
│   │   ├── hooks/
│   │   │   └── useDebounce.js  # Search debounce hook
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Feed with search, filters, and cards
│   │   │   ├── PostDetails.jsx # Full article view and comments
│   │   │   ├── CreatePost.jsx  # Article creation form
│   │   │   ├── EditPost.jsx    # Post editing form
│   │   │   ├── Profile.jsx     # User bio, stats, and articles
│   │   │   ├── Login.jsx       # Sign in with demo shortcuts
│   │   │   ├── Register.jsx    # User registration
│   │   │   └── NotFound.jsx    # Custom 404 page
│   │   ├── services/
│   │   │   └── api.js          # Centralized Axios client & interceptors
│   │   ├── App.jsx             # Router and toast container
│   │   ├── main.jsx            # React root entry point
│   │   └── index.css           # Complete Vanilla CSS design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                     # Backend API (Express & Node.js)
│   ├── config/
│   │   └── db.js               # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js   # Register, Login, Me, UpdateProfile
│   │   ├── postController.js   # CRUD, search, filter, pagination
│   │   └── commentController.js# Comments CRUD & ownership checks
│   ├── middleware/
│   │   ├── auth.js             # JWT verification middleware
│   │   └── errorHandler.js     # Centralized error handler
│   ├── models/
│   │   ├── User.js             # User Mongoose model
│   │   ├── Post.js             # Post Mongoose model
│   │   └── Comment.js          # Comment Mongoose model
│   ├── routes/
│   │   ├── authRoutes.js       # /api/auth
│   │   ├── postRoutes.js       # /api/posts & /api/posts/:postId/comments
│   │   └── commentRoutes.js    # /api/comments
│   ├── utils/
│   │   ├── generateToken.js    # JWT generation utility
│   │   └── seed.js             # Database seeding script
│   ├── .env                    # Environment configuration
│   ├── .env.example            # Environment sample
│   ├── server.js               # Express application entry point
│   └── package.json
├── .gitignore
├── package.json                # Root package for running client and server
└── README.md
```

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port `27017` or a MongoDB Atlas URI

### 2. Clone and Setup Dependencies
From the project root:
```bash
# Install dependencies for both backend and frontend
npm run install:all
```
*(Or install individually inside `cd server && npm install` and `cd client && npm install`)*

### 3. Configure Environment Variables
Inside the `server/` directory, check or create `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/blog_platform
JWT_SECRET=super_secret_blog_platform_jwt_key_9837492847291837
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed the Database (Recommended)
Populate the database with rich sample users, articles, and discussions:
```bash
npm run seed
```
**Demo Accounts Created:**
- `alex@example.com` / `Password123!` (Architect)
- `sophia@example.com` / `Password123!` (Designer)
- `marcus@example.com` / `Password123!` (Backend & Cloud)

### 5. Run the Application
Run both server and client with one command:
```bash
npm run dev
```

Or run them in separate terminals:
- **Server:** `cd server && npm run dev` (Runs on `http://localhost:5000`)
- **Client:** `cd client && npm run dev` (Runs on `http://localhost:5173`)

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user (`name`, `email`, `password`, `bio`) |
| `POST` | `/api/auth/login` | Public | Login user (`email`, `password`) and receive JWT |
| `GET` | `/api/auth/me` | Private | Get current authenticated user details |
| `PUT` | `/api/auth/profile` | Private | Update user profile (`name`, `bio`, `avatar`) |

### Blog Posts (`/api/posts`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts` | Public | List posts (Supports `?search=`, `?category=`, `?page=`, `?limit=`) |
| `GET` | `/api/posts/:id` | Public | Retrieve single post by ID with author details |
| `POST` | `/api/posts` | Private | Create new article (`title`, `content`, `category`, `imageUrl`) |
| `PUT` | `/api/posts/:id` | Private (Owner) | Update an existing post |
| `DELETE` | `/api/posts/:id` | Private (Owner) | Delete post and cascade delete all its comments |

### Comments (`/api/posts/:postId/comments` and `/api/comments`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/posts/:postId/comments` | Public | Retrieve all comments for a post |
| `POST` | `/api/posts/:postId/comments` | Private | Add a comment to a post (`content`) |
| `PUT` | `/api/comments/:id` | Private (Owner) | Edit comment content |
| `DELETE` | `/api/comments/:id` | Private (Owner) | Delete a comment |

---

## 🛡️ Security Implementation
- Passwords hashed with `bcryptjs` (salt factor 10) before saving.
- Passwords excluded by default from queries (`select: false`).
- JWT tokens signed with expiration and validated via Bearer header.
- Explicit database resource ownership check on all update and delete routes.
- Centralized error handler captures CastErrors, validation failures, and duplicate keys.
- CORS whitelist configured for frontend origins.
