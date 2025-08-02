import { Request, Response } from "express";
import { Role } from "../models/roles.model";

//func untuk mengambil semua data role dari database
export const getAllRole = async (req: Request, res: Response) => {
  try {
    //ambil semua data role dari table Role dengan sequelize
    const roles = await Role.findAll();

    //jika berhasil kirim response sukses dan data role
    return res.status(200).json({
      status: 200,
      message: "Success!",
      data: roles,
    });
  } catch (error) {
    console.error("Error :", error);
    return res.status(500).json({
      status: 500,
      message: "There is something wrong",
      data: null,
    });
  }
};
