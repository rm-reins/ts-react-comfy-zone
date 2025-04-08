import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, surname, phone } = req.body;

    if (!req.auth || !req.auth.userId) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const clerkUser =
      (req?.auth?.user as {
        emailAddresses?: Array<{ emailAddress: string }>;
      }) || {};
    const email = clerkUser?.emailAddresses?.[0]?.emailAddress || "";

    const existingUser = await User.findOne({ clerkId: req?.auth?.userId });
    const existingAdmin = await Admin.findOne({ clerkId: req?.auth?.userId });

    if (existingUser || existingAdmin) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "User already exists",
      });
      return;
    }

    const emailExistsUser = await User.findOne({ email });
    const emailExistsAdmin = await Admin.findOne({ email });

    if (emailExistsUser || emailExistsAdmin) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Email already in use",
      });
      return;
    }

    if (!name || !surname || !phone) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please fill out all the required fields.",
      });
      return;
    }

    const user = await User.create({
      clerkId: req?.auth?.userId,
      name,
      surname,
      email,
      phone,
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
      error: error instanceof Error ? error.message : String(error),
    });
    return;
  }
};

export { register };
