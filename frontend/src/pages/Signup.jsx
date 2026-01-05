import { useState } from "react";
import { AuthAPI } from "../api/auth";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });

  const sendOtp = async () => {
    setLoading(true);
    try {
      await AuthAPI.sendSignupOtp(form.email);
      setStep(2);
    } catch (err) {
      alert(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtpAndSignup = async () => {
    setLoading(true);
    try {
      await AuthAPI.verifySignup(
        form.name,
        form.email,
        form.password,
        form.otp
      );
      alert("Signup successful");
      setStep(3);
    } catch (err) {
      alert(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
    <div>
      <h2>Signup</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <button onClick={sendOtp} disabled={loading}>
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <p>OTP sent to {form.email}</p>
          <input
            placeholder="Enter OTP"
            value={form.otp}
            onChange={(e) =>
              setForm({ ...form, otp: e.target.value })
            }
          />

          <button onClick={verifyOtpAndSignup} disabled={loading}>
            {loading ? "Verifying..." : "Verify & Signup"}
          </button>
        </>
      )}

      {step === 3 && <p>Account created successfully.</p>}
    </div>
    <span>OR</span>
    <GoogleLoginButton/>
    </div>
  );
}
