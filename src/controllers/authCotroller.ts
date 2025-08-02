import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { Role } from "../models/roles.model";
import { generateToken } from "../utils/jwt";

// login
export const login = async (req: Request, res: Response) => {

  //request email dan password untuk login
  const { email, password } = req.body;

  try {

    //melakukan pengecekan apakah emailnya sudah ada atau belum dan merelasikan rolenya dengan model Role
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ["id", "name"] }],
    });

    //handle error apabila user tidak ditemukan
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Email is not found",
        data: null,
      });
    }

    //apabila berhasil maka password akan dicompare atau dicocokkan dengan yg ada di db, di sini emnggunakan bcrpt
    const isMatch = await bcrypt.compare(password, user.password);

    //handle error apabila password tidak sesuai
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: "Password did not match",
        data: null,
      });
    }

    //jika berhasil maka akan generateToken 
    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      role: user.Role?.name || null,
    });

    //akan dihapus juga untuk passwordnya
    const { password: _, ...userData } = user.toJSON();

    //handle response berhasil login
    return res.status(200).json({
      status: 200,
      message: "Success!",
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    //handle response apabila error login
    return res.status(500).json({
      status: 500,
      message: "There is something wrong",
      data: error,
    });
  }
};

// logout
export const logout = async (req: Request, res: Response) => {
  //jika berhasil maka akan mengembalikan status 200 dan msg sukses
  return res.status(200).json({
    status: 200,
    message: "Success!",
  });
};

