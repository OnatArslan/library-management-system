import bcrypt from "bcrypt";


export const hashPassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
}