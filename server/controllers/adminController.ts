import { Admin } from "../models/Admin.js";
import { User } from "../models/User.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { logger } from "../utils/logger.js";

const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await Admin.find({});
    res.status(StatusCodes.OK).json({ admins });
  } catch (error) {
    logger.error({
      message: "Error retrieving all admins",
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error retrieving all admins",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const updateAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, surname, phone } = req.body;

    const updates: Record<string, unknown> = {};
    if (name) updates.name = name;
    if (surname) updates.surname = surname;
    if (phone) updates.phone = phone;

    const updatedAdmin = await Admin.findOneAndUpdate(
      { clerkId: req?.auth?.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      });
      return;
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    logger.error({
      message: "Error updating admin",
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating profile",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const promoteToAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.body;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "User not found",
      });
      return;
    }

    const admin = await Admin.create({
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phone,
      clerkId: user.clerkId,
    });

    await User.findByIdAndDelete(user._id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User promoted to admin successfully",
      admin,
    });
  } catch (error) {
    logger.error({
      message: "Error promoting user",
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error promoting user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const demoteToUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { adminId } = req.body;

    // Prevent self-demotion
    if (adminId === req?.auth?.userId) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Cannot demote yourself",
      });
      return;
    }

    const admin = await Admin.findOne({ clerkId: adminId });

    if (!admin) {
      res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Admin not found",
      });
      return;
    }

    const user = await User.create({
      name: admin.name,
      surname: admin.surname,
      email: admin.email,
      phone: admin.phone,
      clerkId: admin.clerkId,
      role: "user",
    });

    await Admin.findByIdAndDelete(admin._id);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Admin demoted to user successfully",
      user,
    });
  } catch (error) {
    logger.error({
      message: "Error demoting admin",
      error: error instanceof Error ? error.message : String(error),
    });
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error demoting admin",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

export { getAllAdmins, updateAdmin, promoteToAdmin, demoteToUser };
