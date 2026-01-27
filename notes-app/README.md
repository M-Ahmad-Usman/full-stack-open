# Notes App - Full Stack Practice Project

**🔗 Live Demo:** [notes-server-0xpd.onrender.com](https://notes-server-0xpd.onrender.com)

A comprehensive full-stack notes application demonstrating concepts from Parts 0-5 of the Full Stack Open course, including authentication, testing strategies, and end-to-end workflows.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Frontend Architecture](#frontend-architecture)
- [Testing Strategy](#testing-strategy)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)

---

## Tech Stack

### Frontend
- **React 19** - UI library with modern hooks
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API requests
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code quality and formatting

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing

### Testing
- **Vitest** - Unit and component tests
- **React Testing Library** - Frontend component testing
- **Playwright** - End-to-end testing framework
- **supertest** - Backend API testing

---

## Project Structure

```
notes-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Note.jsx           # Note display with toggle importance
│   │   │   ├── Note.test.jsx      # Note component tests
│   │   │   ├── NoteForm.jsx       # Form for creating new notes
│   │   │   ├── NoteForm.test.jsx  # Form component tests
│   │   │   ├── Toggleable.jsx     # Reusable show/hide wrapper
│   │   │   ├── Toggleable.test.jsx # Toggleable tests
│   │   │   ├── LoginForm.jsx      # User authentication form
│   │   │   ├── Notification.jsx   # Error/success messages
│   │   │   └── Footer.jsx         # App footer
│   │   ├── services/       # API communication layer
│   │   │   ├── notes.js           # Notes CRUD operations
│   │   │   └── login.js           # Authentication service
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # React entry point
│   ├── coverage/           # Test coverage reports
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite + Vitest configuration
│   └── testSetup.js        # Test environment setup
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── models/             # Mongoose schemas
│   ├── utils/              # Middleware and helpers
│   └── tests/              # Backend tests
└── testing/                # End-to-end tests
    ├── tests/
    │   ├── note_app.spec.js  # E2E test scenarios
    │   └── helper.js         # Test helper functions
    ├── playwright.config.js  # Playwright configuration
    └── playwright-report/    # Test execution reports
```

---

## Features

### User Authentication
- User registration with password hashing (bcrypt, 10 salt rounds)
- JWT-based login system (1-hour token expiration)
- Token stored in localStorage for session persistence
- Automatic token attachment to API requests
- Logout functionality with token cleanup
- Protected routes requiring authentication

### Note Management
- **Create**: Add new notes with custom content
- **Read**: View all notes or filter by importance
- **Update**: Toggle importance status of notes
- **Delete**: Remove notes from server (handled gracefully)
- Real-time UI updates after operations
- Error handling for removed notes

### UI/UX Features
- Toggleable forms (login and note creation)
- Success/error notifications with auto-dismiss
- Show/hide importance filter
- Responsive button states
- Clean, semantic HTML with proper labels
- User-friendly error messages

---

## Frontend Architecture

### Components

#### **Note.jsx**
Displays individual note with importance toggle button.
- Props: `note` object, `toggleImportance` handler
- Dynamic button label based on importance state
- CSS class for styling

#### **NoteForm.jsx**
Controlled form for creating new notes.
- Props: `createNote` handler
- State management for input field
- Form validation and submission
- Clears input after successful creation

#### **Toggleable.jsx**
Reusable wrapper component for show/hide functionality.
- Props: `buttonLabel`, `children`, `ref`
- Internal visibility state
- `useImperativeHandle` for parent component control
- Used for login form and note creation form

#### **LoginForm.jsx**
User authentication interface.
- Props: `onSuccessfullLogin`, `setErrorMessage`
- Controlled form with username and password fields
- Error handling for invalid credentials
- Labeled inputs for accessibility and testing

#### **Notification.jsx**
Displays success/error messages.
- Props: `message`
- Conditional rendering based on message presence
- CSS classes for styling (error/success)

### Services Layer

#### **notes.js**
Handles all note-related API calls.
- `getAll()` - Fetch all notes
- `create(newObject)` - Create new note
- `update(id, newObject)` - Update existing note
- `setToken(token)` - Set authorization header

#### **login.js**
Manages user authentication.
- `login(credentials)` - Authenticate user and receive JWT token

### State Management
- `useState` for local component state
- `useEffect` for side effects (data fetching, localStorage)
- `useRef` for accessing child component methods
- Props drilling for shared state
- localStorage for authentication persistence

---

## Testing Strategy

### Unit & Component Tests (Vitest + React Testing Library)

**Test Coverage:**
- **Note.test.jsx** - 4 tests
  - Renders content correctly
  - Handles visibility and CSS selectors
  - Button click event handlers
  
- **NoteForm.test.jsx** - 1 test
  - Form submission with correct data
  - Input field interaction with labels
  - Mock function validation
  
- **Toggleable.test.jsx** - 4 tests
  - Children rendering
  - Initial hidden state
  - Show functionality
  - Hide functionality (cancel button)

**Testing Techniques:**
- DOM querying: `getByText`, `getByRole`, `getByLabelText`
- User interaction simulation with `userEvent`
- Mock functions with Vitest's `vi.fn()`
- Visibility assertions with `toBeVisible()`
- Mock call inspection

**Configuration:**
- jsdom environment for DOM simulation
- Global test utilities from @testing-library/jest-dom
- Test setup file for common configurations

### End-to-End Tests (Playwright)

**Test Scenarios:**
1. **Initial Load**
   - Front page displays correctly
   - Footer renders with proper text

2. **Authentication**
   - Login form is accessible
   - Successful login with valid credentials
   - Failed login with wrong password
   - Error message styling validation (CSS assertions)

3. **Note Operations (When Logged In)**
   - Create new note
   - Verify note appears in list
   - Toggle note importance
   - Handle multiple notes

**Test Helpers:**
- `loginWith(page, username, password)` - User authentication
- `createNote(page, content)` - Note creation workflow
- Database reset before each test for isolation
- User creation via API for consistent test data

**Features Demonstrated:**
- Page navigation and element location
- Form interaction (input filling, button clicks)
- Text content verification
- CSS style assertions (`toHaveCSS`)
- Request interception for API calls
- `beforeEach` hooks for test setup
- Nested describe blocks for organization

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd notes-app
   ```

2. **Setup Backend**
   ```bash
   cd server
   npm install
   ```
   
   Create `.env` file in server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=3001
   SECRET=your_jwt_secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../client
   npm install
   ```

4. **Setup E2E Testing**
   ```bash
   cd ../testing
   npm install
   npx playwright install
   ```

### Running the Application

**Development Mode:**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Access the app at: `http://localhost:5173`

---

## Available Scripts

### Frontend (client/)

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm test` - Run Vitest unit tests
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Backend (server/)

- `npm run dev` - Start server with nodemon
- `npm start` - Start production server
- `npm test` - Run backend tests
- `npm run lint` - Run ESLint

### E2E Testing (testing/)

- `npm test` - Run Playwright tests (Chromium)
- `npm run test:report` - Open test report

---

## Key Concepts Demonstrated

### Part 5 Focus Areas

✅ **Token-based Authentication**
- JWT implementation with localStorage
- Token expiration and refresh patterns
- Protected API routes

✅ **React Component Testing**
- Testing Library best practices
- User interaction simulation
- Mock functions and assertions
- Different DOM query strategies

✅ **End-to-End Testing**
- Playwright test automation
- Complete user workflows
- Database state management
- Test isolation and reproducibility

✅ **React Patterns**
- Controlled components
- Custom hooks patterns
- useImperativeHandle for child methods
- Component composition with props.children
- Ref forwarding patterns

✅ **Code Organization**
- Service layer abstraction
- Component modularity
- Test co-location with components
- Separation of concerns

---

## Testing Best Practices Applied

- ✅ Test isolation with database resets
- ✅ Helper functions for common operations
- ✅ Descriptive test names
- ✅ Arrange-Act-Assert pattern
- ✅ Testing user behavior, not implementation
- ✅ Semantic queries (labels, roles, text)
- ✅ Async handling with proper awaits
- ✅ Mock external dependencies
- ✅ Test coverage for critical paths

---

## Deployment

**Backend:** Deployed on Render.com
- Environment variables configured
- MongoDB Atlas connection
- Static file serving for frontend build

**Frontend:** Built and served from Express
- Automated build script in backend
- Production-optimized bundle

---

## License

This project is part of the University of Helsinki's Full Stack Open course.

---

## Author

M-Ahmad-Usman

---

## Acknowledgments

- University of Helsinki - Full Stack Open Course
- React and Vite communities
- Testing Library and Playwright teams
