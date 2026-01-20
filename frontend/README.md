# Ignite Frontend Documentation

This document provides an overview of the frontend architecture, folder structure, state management, routing, and API integration for the Ignite MERN stack application.

---

## Folder Structure

```
frontend/
├─ src/
│  ├─ apis/                # Axios instances and API functions grouped by domain
│  │  ├─ auth.js           # Login, signup, Google OAuth
│  │  ├─ problems.js       # CRUD operations for problems
│  │  ├─ solutions.js      # Submit, fetch, update solutions
│  │  └─ admin.js          # Admin operations (user management, approvals)
│
│  ├─ components/          # Reusable UI and domain-specific components
│  │  ├─ ui/               # Atomic components: buttons, inputs, modals
│  │  ├─ auth/             # Login, signup, password reset components
│  │  ├─ problems/         # Problem card, problem list, problem form
│  │  ├─ solutions/        # Solution card, solution submission form
│  │  └─ admin/            # Admin-specific components
│
│  ├─ context/             # Global state (AuthContext, ThemeContext)
│
│  ├─ pages/               # Full-page views
│  │  ├─ auth/             # Login.jsx, Signup.jsx
│  │  ├─ problems/         # ProblemList.jsx, ProblemDetail.jsx
│  │  ├─ solutions/        # SolutionList.jsx, SolutionDetail.jsx
│  │  ├─ admin/            # AdminDashboard.jsx, UserManagement.jsx
│  │  └─ Home.jsx
│
│  ├─ assets/              # Images, icons, logos, CSS, fonts
│  ├─ layouts/             # Navbar, Sidebar, PageWrapper components
│  └─ App.jsx               # Main router and layout wrapper

```

---

## Component Strategy

- **Atomic Design**: Small reusable components (Buttons, Inputs, Modals) live in `/components/ui`.
- **Domain Components**: Page-specific components organized by feature (`auth`, `problems`, `solutions`, `admin`).
- **Pages**: Full-page views are in `/pages`.
- **Layouts**: Wrapper components (Navbar + Sidebar) are in `/layouts`.

---

## State Management

### 1. Global State (Context API)
- `AuthContext`: Manages login status, user object, and token persistence.
- `ThemeContext`: Handles Light/Dark mode toggling.

### 2. Server State
- **Axios Instance**: Configured in `src/apis/axios.js` with:
  - `baseURL`
  - Request interceptors to automatically attach JWT token
  - Response interceptors for handling errors

---

## Routing Overview

| Area        | Routes (Representative)        | Access Control |
|------------|---------------------------------|----------------|
| Public     | `/login`, `/signup`             | Guest Only    |
| Core App   | `/`, `/problems`, `/problems/:slug` | Authenticated |
| Solutions  | `/solutions/:id`, `/submit`     | Authenticated |
| User       | `/users/:userId`                | Authenticated |
| Admin      | `/admin/*`                      | Admin Only    |

> Guards: Public (accessible by all), Guest Only (only if not logged in), Private (logged-in users), Admin Only (admin users)

---

## APIs Overview

| API File         | Purpose |
|-----------------|---------|
| `auth.js`        | Login, signup, logout, Google OAuth |
| `problems.js`    | Create, fetch, update, delete problems |
| `solutions.js`   | Submit, fetch, Create, Update, solutions |
| `admin.js`       | Review Projects, review Solutions |

---

## Key Features

- Responsive UI built with **Tailwind CSS** and **shadcn/ui**.
- Atomic and domain-based component strategy for modularity.
- Context API for global state and authentication.
- Google OAuth login integration.
- Axios interceptors for automatic JWT handling.
- Role-based routing and guards (Private / Admin).
- Easy-to-extend folder structure for new features.

---

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

> Default port (Vite): `http://localhost:5173`

---

## Environment Variables

Create a `.env` file in `/frontend` with variables like:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
```

> All environment variables are prefixed with `VITE_` for Vite projects.

---

For contribution guidelines, license, and overall project documentation, see the [root README](../README.md).
