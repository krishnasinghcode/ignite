import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicRoute from "@/components/auth/PublicRoute";

import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Problems from "./pages/problems/Problems";
import ProblemDetail from "./pages/problems/ProblemDetail";
import SolutionDetail from "./pages/solutions/SolutionDetail";
import CreateProblem from "./pages/problems/CreateProblem";
import SubmitSolution from "./pages/solutions/SubmitSolution";
import UserProfile from "./pages/UserProfile";
import MyProblems from "./pages/problems/MyProblems";
import AdminProblems from "./pages/admin/AdminProblems";
import AdminProblemDetail from "./pages/admin/AdminProblemDetail";
import EditProblem from "./pages/problems/EditProblem";
import ProblemPreview from "./pages/problems/ProblemPreview";
import AdminSolutions from "./pages/admin/AdminSolutions";
import AdminSolutionDetail from "./pages/admin/AdminSolutionDetail";
import EditSolution from "./pages/solutions/EditSolution";
import UserSolutions from "./pages/solutions/UserSolutions";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <Routes>

        <Route element={<Layout />}>

          {/* Public Routes */}

          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:slug" element={<ProblemDetail />} />
          </Route>

          {/* Protected routes */}

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/solutions/:solutionId" element={<SolutionDetail />} />
            <Route path="/solutions/edit/:solutionId" element={<EditSolution />} />
            <Route path="/solutions/my" element={<UserSolutions />} />
            <Route path="/problems/:id/preview" element={<ProblemPreview />} />

            <Route path="/problems/create" element={<CreateProblem />} />
            <Route path="/problems/edit/:id" element={<EditProblem />} />
            <Route path="/problems/:slug/submit" element={<SubmitSolution />} />

            <Route path="/users/:userId" element={<UserProfile />} />
            <Route path="/problems/my" element={<MyProblems />} />

            <Route path="/admin/problems" element={<AdminProblems />} />
            <Route path="/admin/problems/:problemId" element={<AdminProblemDetail />} />
            <Route path="/admin/solutions" element={<AdminSolutions />} />
            <Route path="/admin/solutions/:solutionId" element={<AdminSolutionDetail />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </AuthProvider>
  );
}
