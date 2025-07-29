import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { Role } from "../models/roles.model";
import { generateToken } from "../utils/jwt";

// login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, attributes: ["id", "name"] }],
    });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Email is not found",
        data: null,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        status: 401,
        message: "Password did not match",
        data: null,
      });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      role: user.Role?.name || null,
    });

    const { password: _, ...userData } = user.toJSON();

    return res.status(200).json({
      status: 200,
      message: "Success!",
      data: {
        token,
        user: userData,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "There is something wrong",
      data: error,
    });
  }
};

// logout
export const logout = async (req: Request, res: Response) => {
  return res.status(200).json({
    status: 200,
    message: "Success!",
  });
};