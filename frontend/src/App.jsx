import { Routes, Route } from "react-router-dom";
import Layout from "@/components/layout/Layout";

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
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/problems/:slug" element={<ProblemDetail />} />
          <Route path="/solutions/:solutionId" element={<SolutionDetail />} />
          <Route path="/problems/create" element={<CreateProblem />} />
          <Route path="/problems/:slug/submit" element={<SubmitSolution />} />
          <Route path="/users/:userId" element={<UserProfile />} />
        </Routes>
      </Layout>
  );
}
