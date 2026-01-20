# Project: Ignite 🔥
> A MERN stack application that allows users to share project ideas and problem statements, explore existing challenges, and contribute solutions collaboratively.

---

## System Architecture
The app follows a decoupled client-server architecture:

- **Frontend**: React (Vite) + Tailwind CSS + shadcn/ui (component library)
- **Backend**: Node.js + Express + MongoDB (Mongoose)
- **Communication**: REST API via Axios

---

## Prerequisites & Installation
1. **Node.js**: Version 18+ recommended
2. **MongoDB**: Local instance or Atlas URI

```bash
# Clone the repository
git clone https://github.com/krishnasinghcode/ignite.git

# Install Backend dependencies
cd backend && npm install

# Install Frontend dependencies
cd ../frontend && npm install
```

---

## Environment Configuration
For backend-specific setup and environment variables, see [backend/README.md](./backend/README.md).  
For frontend-specific setup and configuration, see [frontend/README.md](./frontend/README.md).

---

## Features

* **Post Project Ideas**: Users can create and publish problem statements and project ideas.
* **Explore Ideas**: Browse and search existing projects and challenges.
* **Submit Solutions**: Collaborate by submitting solutions to existing problems.
* **Role-based Access**: Admins can manage submissions, users, and projects.
* **Responsive UI**: Built with Tailwind CSS and shadcn/ui for modern, mobile-friendly design.
* **Authentication & Security**: JWT-based user authentication and secure API endpoints.
* **Google OAuth Login**: Users can sign in quickly using their Google accounts for seamless access.

---

## Usage

1. Start the backend server:

```bash
cd backend
npm run dev
```

2. Start the frontend server:

```bash
cd frontend
npm run dev
```

3. Open the app in your browser: `http://localhost:5173` (Vite default port)
4. Sign up or log in to start posting, exploring, and contributing.

---

## Contribution Guidelines

1. Fork the repository and create a new branch for your feature or bugfix.
2. Ensure code follows the existing style conventions and is well-documented.
3. Submit a pull request with a clear description of your changes.
4. All contributions are reviewed before merging to maintain quality.

---

## License

This project is licensed under the MIT License.
