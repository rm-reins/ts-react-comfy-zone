import { User } from "../models/User.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import "../types/clerk";

const updateUser = async (req: Request, res: Response) => {
  const { name, surname, phoneNumber, deliveryAddress } = req.body;

  const updates: Record<string, unknown> = {};
  if (name) updates.name = name;
  if (surname) updates.surname = surname;
  if (phoneNumber) updates.phoneNumber = phoneNumber;
  if (deliveryAddress) updates.deliveryAddress = deliveryAddress;

  const updatedUser = await req.user?.updateOne(
    { $set: updates },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Profile updated successfully",
    user: updatedUser,
  });
};

export {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};
