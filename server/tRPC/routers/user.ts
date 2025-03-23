import { router, protectedProcedure, adminProcedure } from "../trpc.js";
import { z } from "zod";
import { User } from "../../models/User.js";
import { TRPCError } from "../trpc.js";

const deliveryAddressSchema = z.object({
  address: z.string({ required_error: "Please provide street address" }),
  city: z.string({ required_error: "Please provide city name" }),
  state: z.string({ required_error: "Please provide state/province" }),
  postalCode: z.string({ required_error: "Please provide postal code" }),
  country: z.string({ required_error: "Please provide country" }),
});

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  surname: z.string().min(2, "Surname must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  role: z.enum(["user", "admin"]).default("user"),
  deliveryAddress: deliveryAddressSchema.optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const userRouter = router({
  getUser: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await User.findOne({ clerkId: ctx?.user?.clerkId });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User profile not found",
        });
      }

      return user;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user profile",
        cause: error,
      });
    }
  }),

  updateProfile: protectedProcedure
    .input(userSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          {
            clerkId: ctx?.user?.clerkId,
          },
          input,
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        return updatedUser;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update user profile",
          cause: error,
        });
      }
    }),

  updateDeliveryAddress: protectedProcedure
    .input(deliveryAddressSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { clerkId: ctx?.user?.clerkId },
          { deliveryAddress: input },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        return updatedUser.deliveryAddress;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update delivery address",
          cause: error,
        });
      }
    }),

  getAllUsers: adminProcedure.query(async () => {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch users",
        cause: error,
      });
    }
  }),

  updateUserRole: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { userId, role } = input;

        const user = await User.findOneAndUpdate(
          { clerkId: userId },
          { role },
          { new: true, runValidators: true }
        );

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No user with id: ${userId}`,
          });
        }

        return user;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update delivery address",
          cause: error,
        });
      }
    }),
});
