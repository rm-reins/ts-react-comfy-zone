import { User } from "../models/User.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import "../types/express-auth";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.auth || !req.auth.userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const existingUser = await User.findOne({ clerkId: req?.auth?.userId });
    if (existingUser) {
      res.status(StatusCodes.BAD_GATEWAY).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const { name, surname, phoneNumber } = req.body;
    if (!name || !surname || !phoneNumber) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please fill out all the required fields.",
      });
      return;
    }

    const clerkUser =
      (req?.auth?.user as {
        emailAddresses?: Array<{ emailAddress: string }>;
      }) || {};
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";

    const user = await User.create({
      clerkId: req?.auth?.userId,
      name,
      surname,
      email,
      phoneNumber,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
    return;
  }
};

export { register };
