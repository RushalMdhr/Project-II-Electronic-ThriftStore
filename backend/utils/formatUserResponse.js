export const formatUserResponse = (user) => {
  const obj = user._doc || user; // handle Mongoose documents

  // Normalize BASE_URL to avoid trailing slash issues
  let BASE_URL = process.env.BASE_URL || "http://localhost:5000";
  BASE_URL = BASE_URL.replace(/\/+$/, ""); // remove trailing slash

  const { password, ...rest } = obj;

  const formatImagePath = (path) => {
    if (!path) return null;
    return `${BASE_URL}/${path.replace(/\\/g, "/")}`; // always forward slashes
  };

  return {
    ...rest,
    profilePic: formatImagePath(obj.profilePic),
    coverPic: formatImagePath(obj.coverPic),
  };
};
