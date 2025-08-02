import { Request, Response } from "express";
import { Task } from "../models/task.model";
import { Op } from "sequelize";

// createTask untuk membuat task baru dengan tambahan upload file
export const createTask = async (req: Request, res: Response) => {
  //request
  const { title, description, status, startDate, endDate, dueDate } = req.body;
  //kirim id untuk tiap create new task
  const createdBy = req.user?.id;
  //
  const file = req.file;

  //inisialisasi contributor array awal
  let contributors: string[] = [];

  //contributor akan diparse menjadi array
  if (req.body.contributors) {
    if (Array.isArray(req.body.contributors)) {
      contributors = req.body.contributors;
    } else {
      try {
        const parsed = JSON.parse(req.body.contributors);
        contributors = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        contributors = [req.body.contributors];
      }
    }
  }

  // require fileds and error handling
  const requiredFields = {
    title,
    description,
    status,
    startDate,
    endDate,
    file,
    contributors,
  };

  //tiap value yang tidak ada akan dihandle dan sesuai dengan keynya
  for (const [key, value] of Object.entries(requiredFields)) {
    if (
      value === undefined ||
      value === null ||
      value === "" ||
      (key === "contributors" && (!Array.isArray(value) || value.length === 0))
    ) {
      return res.status(400).json({
        status: 400,
        message: `Field must be ${key}`,
      });
    }
  }

  // validasi file
  if (!file) {
    return res.status(400).json({
      status: 400,
      message: "Field must be file",
    });
  }

  //validasi pdf untuk upload file
  if (file.mimetype !== "application/pdf") {
    return res.status(400).json({
      status: 400,
      message: "Field must be PDF",
    });
  }

  try {
    //isi file upload yg nanti akan dibuat menggunakan base64
    const fileUpload = {
      originalname: file.originalname,
      mimetype: file.mimetype,
      buffer: file.buffer.toString("base64"),
    };

    //create new task
    const newTask = await Task.create({
      title,
      description,
      status,
      contributors,
      startDate,
      endDate,
      dueDate,
      createdBy,
      fileUpload: fileUpload,
    });

    //apabila tidak ada error dan berhasil dibuat
    return res.status(200).json({
      status: 200,
      message: "Task berhasil dibuat",
      data: newTask,
    });
  } catch (error) {
    //kalau ada error
    console.error("Create Task Error:", error);
    return res.status(500).json({
      status: 500,
      message: "Gagal membuat task",
    });
  }
};

//func untuk mengambil task berdasarkan parameter id
export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params; //id param

  try {
    //mencari task berdasarkan primary key (id) menggunakan sequalize
    const task = await Task.findByPk(id);

    //jika task tidak ditemukan
    if (!task) {
      //kembalikan response not found
      return res.status(404).json({
        status: 404,
        message: "Task not found",
        data: null,
      });
    }

    //jika ditemukan balikkan dengan data task
    return res.status(200).json({
      status: 200,
      message: "Success",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed",
      data: null,
    });
  }
};

//func untuk update task berdasarkan id
export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params; //param id

  //ambil field yang akan diupdate
  const {
    title,
    description,
    status,
    contributors,
    startDate,
    endDate,
    dueDate,
  } = req.body;
  const updatedBy = req.user?.id;

  try {
    //mencari task berdasarkan primary key (id)
    const task = await Task.findByPk(id);

    //jika task tidak ditemukan
    if (!task) {
      //kirim response task tidak ditemukan
      return res
        .status(404)
        .json({ status: 404, message: "Task is not found" });
    }

    //jika ditemukan, update field task dengan data baru dari request
    await task.update({
      title,
      description,
      status,
      contributors,
      dueDate,
      startDate,
      endDate,
      updatedBy,
    });

    //jika berhasil, kembalikan response sukses dan data terbaru
    return res.status(200).json({
      status: 200,
      message: "Success",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed",
      data: null,
    });
  }
};

//func untuk menghapus task berdasarkan id
export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params; //param id
  const deletedBy = req.user?.id; //ambil user id yg sedang login dari middleware

  try {
    //mencari task berdasarkan primary key (id)
    const task = await Task.findByPk(id);

    //jika task tidak ditemukan
    if (!task) {
      //kirim response 404 tidak ditemukan
      return res.status(404).json({ status: 404, message: "Task not found" });
    }

    //tambahkan informasi siapa yg menghapus task
    await task.update({ deletedBy });

    //hapus task dari database
    await task.destroy();

    //jika berhasil dihapus, kirim response sukses
    return res.status(200).json({
      status: 200,
      message: "Success",
    });
  } catch (error) {
    //jika error maka kirim response error
    return res.status(500).json({
      status: 500,
      message: "Failed",
    });
  }
};

// Fungsi controller untuk melakukan pencarian task berdasarkan keyword
export const searchTasks = async (req: Request, res: Response) => {
  //ambil query parameter keyword, page, limit 
  const { keyword, page = 1, limit = 10 } = req.query;

  //jika keyword string, akan ditrim untuk menghapus spasi di awal/akhir
  const searchKeyword = typeof keyword === "string" ? keyword.trim() : "";

  //pagination
  const offset = (Number(page) - 1) * Number(limit);

  try {
    //cari data task di dabatase dengan kondisi title/description/status yg mengandung keyword
    const tasks = await Task.findAndCountAll({
      where: {
        [Op.or]: [
          //Operator OR terpenuhi
          { title: { [Op.like]: `%${searchKeyword}%` } }, //title
          { description: { [Op.like]: `%${searchKeyword}%` } }, //description
          { status: { [Op.like]: `%${searchKeyword}%` } }, //status
        ],
      },
      limit: Number(limit),
      offset: offset,
    });

    // apabila task tidak ditemukan, maka data kosong
    if (tasks.length === 0) {
      return res.status(203).json({
        status: 203,
        message: "Success",
        data: [],
      });
    }

    //apbila task ditemukan, maka data dimuat task
    return res.status(200).json({
      status: 200,
      message: "Success",
      total: tasks.count, // jumlah total data yg cocok
      totalPages: Math.ceil(tasks.count / Number(limit)), // jumlah halaman
      currentPage: Number(page), // halaman sekarang
      data: tasks.rows, // data hasil pencarian di halaman ini
    });
    
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed",
      data: null,
    });
  }
};

//func semua task dengan pagination
export const getAllTasks = async (req: Request, res: Response) => {
  //ambil query parameter page dan limit, default 1-10 jika tidak diberikan
  const { page = 1, limit = 10 } = req.query;

  //hitung offset berdasarkan page dan limit
  const offset = (Number(page) - 1) * Number(limit);

  try {
    //ambil task dari database dg batasan limit dan offset
    const tasks = await Task.findAndCountAll({
      limit: Number(limit),
      offset: offset,
    });

    //perubahan setiap task untuk menambahkan field namaFile dari fileUpload
    const taskData = tasks.rows.map((task: any) => {
      let namaFile = null;

      try {
        //cek apakah field fileUpload berupa string, jika iya parse ke JSON
        const file =
          typeof task.fileUpload === "string"
            ? JSON.parse(task.fileUpload)
            : task.fileUpload;

        //ambil nma file dari properti originalname jika ada
        namaFile = file?.originalname ?? null;
      } catch (err) {
        //parsing jika gagal diset null
        namaFile = null;
      }

      //gabungkan data task dengan namaFile yg ditambahkan
      return {
        ...task.toJSON(),
        namaFile,
      };
    });

    //kirim response berhasil dg data task yg telah diperbaharui serta paginationnya
    return res.status(200).json({
      status: 200,
      message: "Success",
      data: taskData,
      total: tasks.count,
      totalPages: Math.ceil(tasks.count / Number(limit)),
      currentPage: Number(page),
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed",
      data: null,
    });
  }
};
