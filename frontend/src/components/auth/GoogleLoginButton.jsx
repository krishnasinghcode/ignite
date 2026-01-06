import { GoogleLogin } from "@react-oauth/google";
import { AuthAPI } from "../../api/auth";

const GoogleLoginButton = () => {
  const handleSuccess = async ({ credential }) => {
    try {
      const { accessToken } = await AuthAPI.googleLogin(credential);

      localStorage.setItem("accessToken", accessToken);

      window.location.href = "/";
    } catch (error) {
      console.error("Google login failed", error);
      alert("Google login failed");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => {
        console.error("Google OAuth error");
      }}
      useOneTap
    />
  );
};

export default GoogleLoginButton;
