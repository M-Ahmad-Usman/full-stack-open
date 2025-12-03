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
└── part4/              # Testing Express servers, user administration
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

*Information about later parts will be added as the course progresses.*

## Practice Project: Notes App

**🔗 Live Demo:** [notes-server-0xpd.onrender.com](https://notes-server-0xpd.onrender.com) | **Branch:** `practice`

A full-stack notes application demonstrating integration of concepts from Parts 0-4.

### Stack
- **Frontend:** React, Vite, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Security:** JWT authentication, bcrypt password hashing
- **Testing:** Node.js test runner, supertest

### Features
- User registration and JWT-based login (1-hour token expiration)
- Create, read, update, and delete notes
- Toggle note importance and filter by importance
- Protected routes with ownership verification
- Full test coverage (unit and integration tests)

---