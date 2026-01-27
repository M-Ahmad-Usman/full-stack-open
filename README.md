# Full Stack Open

My solutions and exercises for the [Full Stack Open](https://fullstackopen.com/) course by the University of Helsinki.

Full Stack Open is a comprehensive introduction to modern web development with JavaScript, covering React, Node.js, REST APIs, testing, authentication, and databases.

## Repository Structure

```
├── notes-app/          # Practice project - Full-stack notes application (on 'practice' branch)
│   ├── client/         # React frontend
│   └── server/         # Node.js/Express backend with MongoDB
├── part0/              # Fundamentals of Web apps
├── part1/              # Introduction to React
├── part2/              # Communicating with server
├── part3/              # Programming a server with Node.js and Express
├── part4/              # Testing Express servers, user administration
└── part5/              # Testing React apps
    ├── bloglist-frontend/   # React frontend with Vitest tests
    └── end-to-end-testing/  # Playwright E2E tests
```

---

## Parts Overview

### Part 0: Fundamentals of Web Apps

Understanding how traditional web applications work versus modern single-page applications through sequence diagrams.

**Exercises:**
- **0.4:** Traditional web app - Creating a note with POST, redirect, and full page reload
- **0.5:** SPA initial load - Browser fetches HTML/CSS/JS, then dynamically loads JSON data
- **0.6:** SPA note creation - Client-side rendering without page refresh

**Key Concepts:** HTTP request-response cycle, SPAs vs traditional apps, sequence diagrams

---

### Part 1: Introduction to React

Fundamental React concepts through hands-on projects.

**Projects:**
- **courseinfo** - Component composition, props, and working with arrays/objects
- **unicafe** - State management with `useState`, conditional rendering, statistics calculation
- **anecdotes** - Complex state with arrays of objects, event handlers, random selection

**Key Concepts:** Components and props, `useState` hook, event handling, conditional rendering, immutable state updates

---

### Part 2: Communicating with Server

Server communication, rendering collections, forms, and REST APIs.

**Projects:**
- **courseinfo** - Enhanced with `map()` and `reduce()` for rendering lists and totals
- **the_phonebook** - Full CRUD app with search, validation, notifications, and axios service layer
- **countries_data** - REST Countries API integration with OpenWeather API, environment variables

**Key Concepts:** Axios HTTP requests, `useEffect` hook, array methods (`map`, `filter`, `reduce`), controlled forms, JSON Server, error handling

---

### Part 3: Programming a Server with Node.js and Express

**🔗 Live Demo:** [phonebook-backend-xx37.onrender.com](https://phonebook-backend-xx37.onrender.com/)

Building a production-ready REST API and deploying a full-stack application.

**Project: phonebook_backend**
- RESTful API with full CRUD operations
- MongoDB integration with Mongoose ODM and schema validation
- Custom validators (phone number format, name length)
- Morgan logging with custom tokens
- Serves Part 2 frontend from Express (`build:ui` script automation)
- Error handling middleware for validation and database errors

**Key Concepts:** Express middleware, MongoDB/Mongoose, REST API design, schema validation, serving static files, deployment, build automation

---

### Part 4: Testing Express Servers, User Administration

Professional backend architecture with authentication and comprehensive testing.

**Project: blog_list** - Blog REST API with JWT authentication

**Architecture:**
- Modular structure: `controllers/`, `models/`, `utils/`, `tests/`
- Router-based routing for blogs, users, and login
- Environment-specific configurations (dev, prod, test)

**Security:**
- JWT authentication (Bearer token, 1-hour expiration)
- Bcrypt password hashing (10 salt rounds, min 3 chars)
- Ownership-based authorization for blog modifications

**Data Models:**
- User: username (unique, min 3 chars), name, passwordHash, blogs[]
- Blog: title, author, url, likes (default 0), user reference
- Mongoose populate for relationships

**Testing:**
- Unit tests for helper functions (totalLikes, favoriteBlog, mostBlogs)
- Integration tests with supertest for all API endpoints
- Test helpers for DB management and token generation
- Sequential execution to avoid race conditions

**Key Concepts:** JWT auth, bcrypt, backend testing (Node.js test runner, supertest), database relationships, middleware composition, TDD, async/await patterns

---

### Part 5: Testing React Apps

Returning to the frontend with comprehensive testing strategies and token-based authentication.

**Project: bloglist-frontend** - React frontend for blog application with full authentication and testing

**Authentication & Security:**
- Token-based authentication with local storage
- Login/logout functionality with JWT tokens
- Protected routes and user-specific content
- Automatic token attachment to API requests

**UI Components:**
- `LoginForm` - User authentication interface
- `BlogForm` - Toggleable form for creating new blogs
- `Blog` - Expandable blog display with like and delete functionality
- `Toggleable` - Reusable component for show/hide behavior
- `Notification` - Success/error message display

**Frontend Testing (Vitest + React Testing Library):**
- Component unit tests with mocking and user interaction simulation
- `Blog.test.jsx` - Rendering, expansion, and like button functionality
- `BlogForm.test.jsx` - Form submission with correct data
- Mock functions for event handlers and user events
- DOM querying strategies (getByText, getByRole, container queries)

**End-to-End Testing (Playwright):**
- Complete user workflow testing from login to blog management
- Test helper functions for common operations (login, create blog, like blog)
- Database reset before each test for isolation
- Comprehensive test scenarios:
  - Login form display and authentication (success/failure)
  - Blog creation and notification verification
  - Blog liking and like counter updates
  - Blog deletion with authorization checks
  - Remove button visibility based on ownership
  - Blog sorting by likes (most liked first)
- Dialog handling for confirmation prompts
- Multiple user scenarios with role-based visibility

**Architecture:**
- Modular service layer for API communication (`services/blogs.js`, `services/login.js`)
- Controlled forms with state management
- Conditional rendering based on authentication state
- Custom hooks for form handling
- PropTypes for type checking (deprecated in React 19)

**Key Concepts:** Token authentication, localStorage, React Testing Library, Vitest, user-event simulation, component testing, E2E testing with Playwright, test helpers, test isolation, beforeEach hooks, async testing

---

*Information about later parts will be added as the course progresses.*

## Practice Project: Notes App

**🔗 Live Demo:** [notes-server-0xpd.onrender.com](https://notes-server-0xpd.onrender.com) | **Branch:** `practice`**

A full-stack notes application integrating concepts from Parts 0-5 with complete testing strategies (unit tests, component tests with React Testing Library, and E2E tests with Playwright).

**Stack:** React 19 + Vite | Node.js + Express | MongoDB | JWT Auth | Vitest | Playwright

**Features:** User authentication, full-stack CRUD operations, component & E2E testing, token management

---