import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";

//func untuk mengambil semua user hanya atribut username dan roleId
export const getAllOnlyUsername = async (req: Request, res: Response) => {
  try {
    //mengambil semua data user dari database, tp hanya kolom username dan roleId
    const users = await User.findAll({
      attributes: ["username", "roleId"],
    });

    // jika tidak ada user yang ditemukan
    if (users.length === 0) {
      //kembalikan user not found dan data kosong
      return res.status(204).json({
        status: 204,
        message: "User not found",
        data: [],
      });
    }

    //jika data user ditemukan, kirimkan sukses dan data user
    return res.status(200).json({
      status: 200,
      message: "Success",
      data: users,
    });
  } catch (error) {
    //apabiila error
    return res.status(500).json({
      status: 500,
      message: "Failed",
      data: null,
    });
  }
};

//func untuk mengambil semua data user
export const getUser = async (req: Request, res: Response) => {
  try {
    //mengambil semua data user menggunakan sequalize ORM
    const users = await User.findAll();

    //jika berhasil akan mengirim data pengguna
    return res.status(200).json({
      status: 200,
      message: "Success!",
      data: users,
    });
  } catch (error) {
    //jika gagal akan mengirim error
    return res.status(500).json({
      status: 500,
      message: "Failed",
      error: error.message,
    });
  }
};

// create new user
export const createUser = async (req: Request, res: Response) => {
  //body req
  const { username, email, password, roleId } = req.body;

  try {
    //cek apakah email sudah terdaftar sebelumnya di database
    const existingUser = await User.findOne({ where: { email } });

    //jika sudah ada user dg email yg sama, kirim response error
    if (existingUser) {
      return res.status(400).json({
        status: 400,
        message: "Email already exists!",
        data: null,
      });
    }

    //jika berhasil, hash password sebelum disimpan ke db
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user baru di database dg data yg sudah diproses
    const user = await User.create({
      username,
      email,
      password: hashedPassword, //simpan password yg sudah dihash
      roleId, //foreign key ke table Role
    });

    //kirim res kalau barhasil
    return res.status(200).json({
      status: 200,
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

//func untuk mengubah data user
export const updateUser = async (req: Request, res: Response) => {
  //req param id user
  const { id } = req.params;
  //req body user
  const { username, email, password, roleId } = req.body;

  try {
    //cari user di db berdasarkan primary key (id)
    const user = await User.findByPk(id);
    //jika user tidak ditemukan, kirim response user not found
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        data: null,
      });
    }

    //buat object updateData untuk menyimpan data yg ingin diperbarui
    const updateData: any = { username, email, roleId };

    //jika password tidak kosong
    if (password) {
      //hash password baru dan masukkan ke updateData
      updateData.password = await bcrypt.hash(password, 10);
    }

    //perbarui data user di db dg data baru
    await user.update(updateData);

    //kirim response sukses dan data user yg telah diperbarui
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

//func menghapus user
export const deleteUser = async (req: Request, res: Response) => {
  //ambil id user dari param
  const { id } = req.params;

  try {
    //mencari user berdasarkan primary key (id)
    const user = await User.findByPk(id);

    //jika user tidak ditemukan, kirim responser user not found
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
        data: null,
      });
    }

    //hapus user dari database
    await user.destroy();

    //jika berhasil, kirim response sukses
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
