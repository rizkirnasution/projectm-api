import { Response } from 'express';

interface ApiResponse<T> {
  status: number;
  message: string;
  data?: T | null;
}

export const successResponse = <T>(
  res: Response,
  message: string,
  data?: T
): Response<ApiResponse<T>> => {
  return res.status(200).json({
    status: 200,
    message,
    data: data || null,
  });
};


export const errorResponse = (
  res: Response,
  message: string,
  status: number = 400
): Response<ApiResponse<null>> => {
  return res.status(status).json({
    status,
    message,
    data: null,
  });
};
