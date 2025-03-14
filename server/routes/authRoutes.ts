import express, { Request, Response } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middleware/clerk-user";

const router = express.Router();

// This route can be used to check if a user is authenticated
router.get(
  "/me",
  requireAuth(),
  syncClerkUser,
  async (req: Request, res: Response) => {
    // At this point, req.user should be populated by the syncClerkUser middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  }
);

router.post(
  "/update-profile",
  requireAuth(),
  syncClerkUser,
  async (req: Request, res: Response) => {
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

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  }
);

export { router as authRouter };
