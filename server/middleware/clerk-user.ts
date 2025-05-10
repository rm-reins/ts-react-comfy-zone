import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { getAuth } from "@clerk/express";

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);

  if (!auth.userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized. Please sign in to continue.",
    });
    return;
  }

  next();
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const auth = getAuth(req);

  if (!auth.userId) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized. Please sign in to continue.",
    });
    return;
  }

  if (!auth.orgRole || auth.orgRole !== "org:admin") {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
    return;
  }

  next();
};
