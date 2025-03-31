import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/custom-errors.js";

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, surname, phoneNumber, deliveryAddress, role } = req.body;

    if (role === "user") {
      const updates: Record<string, unknown> = {};
      if (name) updates.name = name;
      if (surname) updates.surname = surname;
      if (phoneNumber) updates.phoneNumber = phoneNumber;
      if (deliveryAddress) updates.deliveryAddress = deliveryAddress;

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: req?.auth?.userId },
        { $set: updates },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(StatusCodes.OK).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } else {
      const updates: Record<string, unknown> = {};
      if (name) updates.name = name;
      if (surname) updates.surname = surname;
      if (phoneNumber) updates.phoneNumber = phoneNumber;

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
        user: updatedAdmin,
      });
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error updating profile",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};

const getSingleUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findOne({ _id: req.params.id }).select("-password");

  if (!user) {
    throw NotFoundError(`No user with id: ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ user });
};

const showCurrentUser = async (req: Request, res: Response): Promise<void> => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export { getAllUsers, getSingleUser, showCurrentUser, updateUser };
