import { Request, Response, NextFunction } from 'express';

export const checkRole = (allowedRoles: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role_id;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ msg: 'Access Denied!' });
    }

    next();
  };
};
