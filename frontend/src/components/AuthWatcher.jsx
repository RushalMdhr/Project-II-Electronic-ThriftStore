import { useEffect } from "react";
import { useGetCurrentUserQuery } from "../redux/api/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials, logout } from "../redux/features/auth/authSlice";

const AuthWatcher = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // getCurrentUser query automatically fetches logged-in user's profile
  const {
    data: user,
    refetch,
    error,
    isSuccess,
  } = useGetCurrentUserQuery(undefined, {
    skip: !userInfo, // skip if no user logged in
  });

  useEffect(() => {
    if (isSuccess && user) {
      dispatch(setCredentials(user));
    }

    if (error) {
      // handle logout if user banned or token invalid
      dispatch(logout());
    }
  }, [user, isSuccess, error, dispatch]);

  useEffect(() => {
    const handleTabChange = () => {
      if (document.visibilityState === "visible" && userInfo) {
        refetch();
      }
    };

    const handleFocus = () => {
      if (userInfo) {
        refetch();
      }
    };

    document.addEventListener("visibilitychange", handleTabChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleTabChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [userInfo, refetch]);

  return null;
};

export default AuthWatcher;
