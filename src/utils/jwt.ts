import jwt from "jsonwebtoken";

//mengambil env atau set langsung
const secret = process.env.JWT_SECRET || "mysecretkey123";

//fung generateToken dengan data yg akan disimpan di payload 
export const generateToken = (payload: any) => {
    // create token dengan data payload, secret key, dan expired 1 hari
  return jwt.sign(payload, secret, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {

  // // Memverifikasi token menggunakan secret key
  return jwt.verify(token, secret);
};

