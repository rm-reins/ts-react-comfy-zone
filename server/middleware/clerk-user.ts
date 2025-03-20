import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/User";
import "../types/clerk";

// This middleware will be used after Clerk's requireAuth middleware
// It will check if the authenticated Clerk user exists in our database
export const syncClerkUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Promise.resolve().then(async () => {
    try {
      if (!req.auth || !req.auth.userId) {
        return next();
      }

      const clerkUserId = req.auth.userId;

      const user = await User.findOne({ clerkId: clerkUserId });

      if (!user) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message:
            "Please complete registration before you will be able to access this resource.",
          code: "REGISTRATION_REQUIRED",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
    return;
  }

  next();
};
