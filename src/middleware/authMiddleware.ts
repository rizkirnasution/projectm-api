import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//autentikasi untuk verifikasi token JWT yang dikirim dari client
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  //mengambil header Authorization dari request
  const bearer = req.headers.authorization;

  //handle error jika tidak ada token atau tidak diawali dengan Bearer
  if (!bearer || !bearer.startsWith("Bearer ")) {
    return res.status(401).json({
      status: 401,
      message: "Token not found",
      data: null,
    });
  }

  //pisahkan token dari Bearer
  const token = bearer.split(" ")[1];

  try {

    //verifikasi token dengan secret key dari env
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    // Jika token valid, simpan data user ke dalam req agar bisa digunakan di controller selanjutnya
    req.user = decoded;

    //lanjut ke middleware atau ke controller selanjutnya
    next();
  } catch (err) {

    //handle error token
    return res.status(403).json({
      status: 403,
      message: "Token not valid",
      data: null,
    });
  }
};
