import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/ThemeToggle.jsx";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  // 1. Determine roles clearly
  const localUser = JSON.parse(localStorage.getItem("user"));
  const activeUser = user || localUser;
  
  const isAdmin = activeUser?.role === "admin";
  const isUser = activeUser && activeUser.role !== "admin";

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="text-xl font-bold tracking-tight flex items-center gap-2"
        >
          Ignite <span className="text-orange-500">🔥</span>
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-6 md:flex">
          <NavLink to="/problems" label="Problems" />

          {/* User Specific Links (Hidden from Admins) */}
          {isUser && (
            <>
              <NavLink to="/problems/my" label="My Problems" />
              <NavLink to={`/users/${activeUser._id}`} label="My Solutions" />
            </>
          )}

          {/* Admin Specific Links (Hidden from Users) */}
          {isAdmin && (
            <>
              <NavLink to="/admin/problems" label="Problems Review" />
              <NavLink to="/admin/solutions" label="Solutions Review" />
            </>
          )}

          {!activeUser ? (
            <Button onClick={() => navigate("/login")}>Login</Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={() => navigate(`/users/${activeUser._id}`)}
            >
              {activeUser.name}
            </Button>
          )}

          <ThemeToggle />
        </ul>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-xl p-2"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="space-y-2 border-t px-4 pb-4 pt-3 md:hidden bg-background">
          <MobileLink to="/problems" label="Problems" setOpen={setMobileOpen} />
          
          {isUser && (
            <>
              <MobileLink to="/problems/my" label="My Problems" setOpen={setMobileOpen} />
              <MobileLink to={`/users/${activeUser._id}`} label="My Solutions" setOpen={setMobileOpen} />
            </>
          )}

          {isAdmin && (
            <>
              <MobileLink to="/admin/problems" label="Problems Review" setOpen={setMobileOpen} />
              <MobileLink to="/admin/solutions" label="Solutions Review" setOpen={setMobileOpen} />
            </>
          )}

          {!activeUser ? (
            <Button
              className="w-full mt-4"
              onClick={() => {
                setMobileOpen(false);
                navigate("/login");
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => {
                setMobileOpen(false);
                navigate(`/users/${activeUser._id}`);
              }}
            >
              {activeUser.name}
            </Button>
          )}

          <div className="flex justify-center pt-4 border-t mt-4">
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}

/* ---------- helpers ---------- */
function NavLink({ to, label }) {
  return (
    <li>
      <Link
        to={to}
        className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
      >
        {label}
      </Link>
    </li>
  );
}

function MobileLink({ to, label, setOpen }) {
  return (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="block py-2 text-base font-medium text-muted-foreground transition hover:text-foreground border-b border-muted/20"
    >
      {label}
    </Link>
  );
}
