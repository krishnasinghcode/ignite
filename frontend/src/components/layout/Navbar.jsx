import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme/ThemeToggle.jsx";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth(); // <-- get user from AuthContext

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="text-xl font-bold tracking-tight"
        >
          Ignite <span className="text-orange-500">🔥</span>
        </button>

        {/* Desktop Navigation */}
        <ul className="hidden items-center gap-6 md:flex">
          <NavLink to="/problems" label="Problems" />

          {user && <NavLink to={`/users/${user._id}`} label="My Solutions" />}

          {!user ? (
            <Button onClick={() => navigate("/login")}>Login</Button>
          ) : (
            <Button variant="outline" onClick={() => navigate(`/users/${user._id}`)}>
              {user.name}
            </Button>
          )}

          <ThemeToggle />
        </ul>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="space-y-2 border-t px-4 pb-4 pt-3 md:hidden">
          <MobileLink to="/problems" label="Problems" setOpen={setMobileOpen} />

          {user && (
            <MobileLink to={`/users/${user._id}`} label="My Solutions" setOpen={setMobileOpen} />
          )}

          {!user ? (
            <Button
              className="w-full"
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
              className="w-full"
              onClick={() => {
                setMobileOpen(false);
                navigate(`/users/${user._id}`);
              }}
            >
              {user.name}
            </Button>
          )}

          <div className="pt-2">
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
      className="block py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
    >
      {label}
    </Link>
  );
}
