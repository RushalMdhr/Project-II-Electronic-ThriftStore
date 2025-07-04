import { useEffect } from "react";
import { useGetUserDetailsQuery } from "../redux/api/usersApiSlice";

const AuthWatcher = () => {
  const userInfo = localStorage.getItem("userInfo");

  const { refetch } = useGetUserDetailsQuery(undefined, {
    skip: !userInfo, // Only run if logged in
  });

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

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleTabChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [userInfo, refetch]);

  return null;
};

export default AuthWatcher;
