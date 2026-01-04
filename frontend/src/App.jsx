import { Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Signup from './pages/Signup';
import Login from './pages/Login';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/signup" element={<Signup/>} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
    </Routes>
  )
}
