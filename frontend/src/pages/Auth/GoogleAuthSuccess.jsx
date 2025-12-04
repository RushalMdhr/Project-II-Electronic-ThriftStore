// http://localhost:3000/auth-success
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { setCredentials } from "../../redux/features/auth/authSlice";

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = searchParams.get("token");
    const userJson = searchParams.get("user");

    if (token && userJson) {
      try {
        const user = JSON.parse(decodeURIComponent(userJson));

        // Save to localStorage/Redux
        localStorage.setItem("token", token);
        // localStorage.setItem("userInfo", JSON.stringify(user));
        console.log('user : ',user)
        dispatch(setCredentials({ user }));
        // Redirect to dashboard
        navigate("/");
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return <div>Logging you in...</div>;
};

export default AuthSuccess;
