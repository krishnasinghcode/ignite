import { useState } from "react";
import { AuthAPI } from "../api/auth";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const sendOtp = async () => {
    setLoading(true);
    try {
      await AuthAPI.sendResetOtp(email);
      setStep(2);
    } catch (err) {
      alert(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      await AuthAPI.verifyResetOtp(email, otp);
      setStep(3);
    } catch (err) {
      alert(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setLoading(true);
    try {
      await AuthAPI.resetPassword(
        email,
        passwords.newPassword,
        passwords.confirmPassword
      );
      alert("Password reset successful");
      setStep(4);
    } catch (err) {
      alert(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>

      {step === 1 && (
        <>
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp} disabled={loading}>
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOtp} disabled={loading}>
            Verify OTP
          </button>
        </>
      )}

      {step === 3 && (
        <>
          <input
            type="password"
            placeholder="New Password"
            value={passwords.newPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, newPassword: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwords.confirmPassword}
            onChange={(e) =>
              setPasswords({ ...passwords, confirmPassword: e.target.value })
            }
          />
          <button onClick={resetPassword} disabled={loading}>
            Reset Password
          </button>
        </>
      )}

      {step === 4 && <p>Password reset successful.</p>}
    </div>
  );
}
