import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import SolutionDetail from "./pages/SolutionDetail";
import CreateProblem from "./pages/CreateProblem";
import SubmitSolution from "./pages/SubmitSolution";
import UserProfile from "./pages/UserProfile";

export default function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          {/* Public routes for unauthenticated users */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Route>

          {/* Public routes that are accessible to anyone */}
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemDetail />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/solutions/:solutionId" element={<SolutionDetail />} />
            <Route path="/problems/create" element={<CreateProblem />} />
            <Route path="/problems/:slug/submit" element={<SubmitSolution />} />
            <Route path="/users/:userId" element={<UserProfile />} />
          </Route>
        </Routes>
      </Layout>
    </AuthProvider>
  );
}
