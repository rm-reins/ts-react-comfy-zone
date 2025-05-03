import { router, adminProcedure } from "../trpc.js";
import { z } from "zod";
import { Admin } from "../../models/Admin.js";
import { User } from "../../models/User.js";
import { TRPCError } from "../trpc.js";

const adminSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  surname: z.string().min(2, "Surname must be at least 2 characters long"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  role: z.enum(["admin"]).default("admin"),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const adminRouter = router({
  getCurrentAdmin: adminProcedure.query(async ({ ctx }) => {
    try {
      const admin = await Admin.findOne({ clerkId: ctx.user?.clerkId });
      if (!admin) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Admin not found",
        });
      }
      return admin;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to get current admin",
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
});
