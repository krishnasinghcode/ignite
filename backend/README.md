# Ignite Backend Documentation

This document provides an overview of the backend architecture, database models, folder structure, environment configuration, and relationships for the Ignite MERN stack application.

---

## Folder Structure

```

backend/
├─ src/
│  ├─ controllers/     # Logic for handling requests
│  ├─ routes/          # API endpoint definitions
│  ├─ models/          # Mongoose schemas
│  ├─ middleware/      # Auth guards, error handlers
│  ├─ services/        # Business logic, external integrations
│  ├─ utils/           # Utility functions
├─ tests/              # Unit and integration tests
├─ .env                # Environment variables
├─ index.js / app.js  # Entry point

```

---

## API Documentation

The backend API is documented using OpenAPI (Swagger).

-  **Swagger Spec**: [swagger-output.json](./swagger-output.json)
-  **Rendered Docs**: [swagger.html](./swagger.html)

Open `swagger.html` in a browser to explore all endpoints.

---

## Database Schema & Relationships

### **Models and Relationships**

- **User**
  - Can have multiple `Problem` and `Solution` entries (One-to-Many).
  - Fields: `name`, `email`, `password` (if local auth), `authProviders`, `role`, verification fields.
- **Problem**
  - Created by `User` (`createdBy`) and optionally reviewed by `User` (`reviewedBy`).
  - Can have multiple `Solution` entries (One-to-Many).
  - Fields: `title`, `slug`, `summary`, `description`, `context`, `objectives`, `constraints`, `domain`, `difficulty`, `tags`, `status`.
- **Solution**
  - Belongs to a `User` and a `Problem` (Many-to-One for both, enforced unique combination of `userId` + `problemId`).
  - Fields: `repositoryUrl`, `liveDemoUrl`, `writeup`, `techStack`, `status`, `isPublic`, review info.
- **OTP**
  - Stores temporary OTPs for email verification or password reset.
  - Expires automatically after 5 minutes.

### **ER Diagram (Simplified)**

```

User 1 ──> * Problem
User 1 ──> * Solution
Problem 1 ──> * Solution
OTP ──> User (via email for verification)

````

---

## Environment Configuration

Create a `.env` file in the `/backend` folder with the following variables:

| Key                     | Purpose                                      | Example/Default                         |
|-------------------------|---------------------------------------------|----------------------------------------|
| PORT                    | Server port                                  | 3000                                    |
| MONGODB_URI             | MongoDB connection URI                       | mongodb://127.0.0.1:27017/ignite       |
| JWT_SECRET              | Token signing secret                         | your_jwt_secret                         |
| EMAIL_USER              | Email address for notifications              | test@example.com                        |
| EMAIL_PASS              | Email password or app-specific key           | Testpass                                |
| ACCESS_SECRET           | JWT access token secret                      | your_access_secret                       |
| REFRESH_SECRET          | JWT refresh token secret                     | your_refresh_secret                      |
| NODE_ENV                | Node environment (production/development)   | True                                     |
| ACCESS_TOKEN_EXPIRY     | Access token expiry duration                 | 15m                                      |
| REFRESH_TOKEN_EXPIRY    | Refresh token expiry duration                | 7d                                       |
| REFRESH_COOKIE_MAX_AGE  | Max age for refresh token cookie (ms)       | 604800000                                |


---

## Model Details

### **User**
```js
{
  name: String,
  email: String,
  password: String (if local auth),
  authProviders: { local, google },
  role: 'user' | 'admin',
  isAccountVerified: Boolean,
  resetOtp: String,
  resetOtpExpireAt: Date
}
````

### **Problem**

```js
{
  title, slug, summary, description,
  context, objectives[], constraints[], assumptions[],
  domain: 'Web' | 'Backend' | 'AI' | 'Systems',
  difficulty: 'Easy' | 'Medium' | 'Hard',
  tags[], expectedDeliverables[], evaluationCriteria[],
  status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'REJECTED',
  createdBy: UserId,
  reviewedBy: UserId,
  reviewedAt, rejectionReason
}
```

### **Solution**

```js
{
  userId: UserId,
  problemId: ProblemId,
  repositoryUrl,
  liveDemoUrl,
  writeup: { understanding, approach, architecture, tradeoffs, limitations, outcome },
  techStack[],
  status: 'SUBMITTED' | 'APPROVED' | 'REJECTED',
  reviewedBy, reviewedAt, rejectionReason,
  isPublic: Boolean
}
```

### **OTP**

```js
{
  email,
  otp,
  createdAt (expires after 5 mins)
}
```

---

## Scripts & Running Locally

```bash
# Install dependencies
npm install

# Start server (development)
npm run dev

# Run tests
npm test
```

For contribution guidelines, license, and overall project documentation, see the [root README](../README.md).