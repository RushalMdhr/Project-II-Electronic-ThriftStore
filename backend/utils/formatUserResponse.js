export const formatUserResponse = (user) => {
  const obj = user._doc || user; // handle Mongoose documents

  // Don't send password
  const { password, ...rest } = obj;

  return rest;
};
