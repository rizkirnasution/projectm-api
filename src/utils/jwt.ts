import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "mysecretkey123";

export const generateToken = (payload: any) => {
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret);
};
