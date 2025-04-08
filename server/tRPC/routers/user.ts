import { router, protectedProcedure, adminProcedure } from "../trpc.js";
import { z } from "zod";
import { User } from "../../models/User.js";
import { Admin } from "../../models/Admin.js";
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
  role: z.enum(["user"]).default("user"),
  deliveryAddress: deliveryAddressSchema.optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

const adminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  surname: z.string().min(2, "Surname must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  role: z.enum(["admin"]).default("admin"),
  deliveryAddress: deliveryAddressSchema.optional(),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const userRouter = router({
  currentUser: protectedProcedure.query(async ({ ctx }) => {
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

  updateAdminProfile: adminProcedure
    .input(adminSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const updatedAdmin = await Admin.findOneAndUpdate(
          {
            clerkId: ctx?.user?.clerkId,
          },
          input,
          { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Admin profile not found",
          });
        }

        return updatedAdmin;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update admin profile",
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
          { deliveryAddresses: [input] },
          { new: true, runValidators: true }
        );

        if (!updatedUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        return updatedUser.deliveryAddresses?.[0];
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

  makeAdmin: adminProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { userId } = input;

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No user with id: ${userId}`,
          });
        }

        const admin = await Admin.create({
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone: user.phone,
          clerkId: user.clerkId,
          role: "admin",
        });

        await User.findOneAndDelete({ _id: user._id });

        return admin;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update promote user.",
          cause: error,
        });
      }
    }),

  makeUser: adminProcedure
    .input(z.object({ adminId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { adminId } = input;

        if (adminId === ctx.user?.clerkId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Cannot demote yourself, silly",
          });
        }

        const admin = await Admin.findOne({ clerkId: adminId });

        if (!admin) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No admin with id: ${adminId}`,
          });
        }

        const user = await User.create({
          name: admin.name,
          surname: admin.surname,
          email: admin.email,
          phone: admin.phone,
          clerkId: admin.clerkId,
          role: "user",
        });

        await Admin.findOneAndDelete({ _id: admin._id });

        return user;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to demote admin to user.",
          cause: error,
        });
      }
    }),
});
