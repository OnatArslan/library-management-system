import jwt from "jsonwebtoken";


export const signJwt =  (id) => {
  return jwt.sign({id: id}, process.env.JWT_SECRET_KEY, {
    expiresIn: "2 days",
  });
}

