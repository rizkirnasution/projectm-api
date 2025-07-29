import { Request, Response } from "express";
import { Task } from "../models/task.model";
import { Op } from "sequelize";

export const createTask = async (req: Request, res: Response) => {
  const { title, description, status, contributors, dueDate, startDate, endDate } = req.body;
  const createdBy = req.user?.id;

  try {
    const newTask = await Task.create({
      title,
      description,
      status,
      contributors,
      startDate,
      endDate,
      dueDate,
      createdBy,
    });

    return res.status(201).json({
      status: 201,
      message: "Success",
      data: newTask,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed",
      data: null,
    });
  }
};

export const getTaskById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return res.status(404).json({
        status: 404,
        message: "Task not found",
        data: null,
      });
    }

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

export const updateTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, status, contributors, startDate, endDate, dueDate } = req.body;
  const updatedBy = req.user?.id;

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return res
        .status(404)
        .json({ status: 404, message: "Task is not found" });
    }

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

export const deleteTask = async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedBy = req.user?.id;

  try {
    const task = await Task.findByPk(id);

    if (!task) {
      return res
        .status(404)
        .json({ status: 404, message: "Task not found" });
    }

    await task.update({ deletedBy });

    await task.destroy();

    return res.status(200).json({
      status: 200,
      message: "Success",
    });
  } catch (error) {

    return res.status(500).json({
      status: 500,
      message: "Failed",
    });
  }
};

export const searchTasks = async (req: Request, res: Response) => {
  const { keyword } = req.query;

  const searchKeyword = typeof keyword === "string" ? keyword.trim() : "";

  try {
    const tasks = await Task.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${searchKeyword}%` } },
          { description: { [Op.like]: `%${searchKeyword}%` } },
          { status: { [Op.like]: `%${searchKeyword}%` } },
        ],
      },
    });

    // cek task
    if (tasks.length === 0) {
      return res.status(203).json({
        status: 203,
        message: "Success",
        data: [],
      });
    }

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed",
      data: null,
    });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  
  //pagination
  const { page = 1, limit = 10 } = req.query;
  const offset = (Number(page) - 1) * Number(limit);

  try {
    const tasks = await Task.findAndCountAll({
      limit: Number(limit),
      offset: offset,
    });

    return res.status(200).json({
      status: 200,
      message: "Success",
      data: tasks.rows,
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
