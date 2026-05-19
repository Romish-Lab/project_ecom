import bcrypt from "bcryptjs";

//! hash password
export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log("Error hashing password:", error);
    throw error;
  }
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.log("Error comparing password:", error);
    throw error;
  }
};