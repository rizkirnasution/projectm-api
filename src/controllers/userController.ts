import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const getAllOnlyUsername = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ["username", "roleId"],
    });

    // cek user
    if (users.length === 0) {
      return res.status(204).json({
        status: 204,
        message: "User not found",
        data: [],
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: users,
    });
  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: "Failed",
      data: null,
    });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();

    return res.status(200).json({
      status: 200,
      message: "Success!",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed",
      error: error.message,
    });
  }
};

// create new user
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, roleId } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "Email already exists!",
        data: null,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      roleId,
    });

    return res.status(201).json({
      status: 201,
      message: "Success",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "There is something wrong!",
      data: error,
    });
  }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { username, email, password, roleId } = req.body;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
          data: null,
        });
      }
  
      const updateData: any = { username, email, roleId };
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
  
      await user.update(updateData);
  
      return res.status(200).json({
        status: 200,
        message: "Success",
        data: user,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Failed",
        error: error.message,
      });
    }
  };

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          status: 404,
          message: "User not found",
          data: null,
        });
      }
  
      await user.destroy();
  
      return res.status(200).json({
        status: 200,
        message: "Success",
        data: null,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: "Failed",
        error: error.message,
      });
    }
  };
  
