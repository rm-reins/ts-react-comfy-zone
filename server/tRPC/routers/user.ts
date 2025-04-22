import { router, protectedProcedure, adminProcedure } from "../trpc.js";
import { z } from "zod";
import { User, IDeliveryAddress } from "../../models/User.js";
import { Admin } from "../../models/Admin.js";
import { TRPCError } from "../trpc.js";

const deliveryAddressSchema = z.object({
  _id: z.string().optional(),
  street: z.string({ required_error: "Please provide street address" }),
  city: z.string({ required_error: "Please provide city name" }),
  state: z
    .string({ required_error: "Please provide state/province" })
    .optional(),
  postalCode: z.string({ required_error: "Please provide postal code" }),
  country: z
    .string({ required_error: "Please provide country" })
    .default("Germany"),
  isDefault: z.boolean().default(false),
});

const createAddressSchema = deliveryAddressSchema;

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
        const user = await User.findOne({ clerkId: ctx?.user?.clerkId });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        const addressToUpdate = {
          _id: input._id,
          street: input.street,
          city: input.city,
          state: input.state || "",
          postalCode: input.postalCode,
          country: input.country || "Germany",
          isDefault: !!input.isDefault,
        };

        const updatedAddresses = user.deliveryAddresses.map((addr) =>
          addr._id.toString() === input._id ? addressToUpdate : addr
        );

        try {
          const updatedUser = await User.findOneAndUpdate(
            { clerkId: ctx?.user?.clerkId },
            { deliveryAddresses: updatedAddresses },
            { new: true, runValidators: true }
          );

          if (!updatedUser) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "User profile not found",
            });
          }

          const updatedAddress = updatedUser.deliveryAddresses.find(
            (addr) => addr._id.toString() === input._id
          );

          if (!updatedAddress) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Failed to find updated address",
            });
          }

          return updatedAddress;
        } catch (err) {
          const saveError = err as Error;
          console.error("MongoDB update error:", saveError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Database update error: ${
              saveError.message || "Unknown error"
            }`,
            cause: saveError,
          });
        }
      } catch (err) {
        const error = err as Error;
        console.error("Update delivery address error:", error);
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to update delivery address: ${
            error.message || "Unknown error"
          }`,
          cause: error,
        });
      }
    }),

  addDeliveryAddress: protectedProcedure
    .input(createAddressSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await User.findOne({ clerkId: ctx?.user?.clerkId });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        if (input.isDefault) {
          user.deliveryAddresses.forEach((addr) => {
            addr.isDefault = false;
          });
        }

        if (user.deliveryAddresses.length === 0) {
          input.isDefault = true;
        }

        const addressToAdd = {
          street: input.street,
          city: input.city,
          state: input.state || "",
          postalCode: input.postalCode,
          country: input.country || "Germany",
          isDefault: !!input.isDefault,
        };

        console.log("Server adding address:", addressToAdd);

        try {
          user.deliveryAddresses.push(addressToAdd as IDeliveryAddress);
          await user.save();
          return user.deliveryAddresses[user.deliveryAddresses.length - 1];
        } catch (err) {
          const saveError = err as Error;
          console.error("MongoDB save error:", saveError);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Database save error: ${
              saveError.message || "Unknown error"
            }`,
            cause: saveError,
          });
        }
      } catch (err) {
        const error = err as Error;
        console.error("Add delivery address error:", error);
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to add delivery address: ${
            error.message || "Unknown error"
          }`,
          cause: error,
        });
      }
    }),

  setDefaultAddress: protectedProcedure
    .input(
      z.object({
        addressId: z.string({ required_error: "Address ID is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await User.findOne({ clerkId: ctx?.user?.clerkId });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        const addressIndex = user.deliveryAddresses.findIndex(
          (addr) => addr._id.toString() === input.addressId
        );

        if (addressIndex === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Address not found",
          });
        }

        user.deliveryAddresses.forEach((addr, index) => {
          addr.isDefault = index === addressIndex;
        });

        await user.save();
        return user.deliveryAddresses[addressIndex];
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set default address",
          cause: error,
        });
      }
    }),

  getDeliveryAddresses: protectedProcedure.query(async ({ ctx }) => {
    try {
      const user = await User.findOne({ clerkId: ctx?.user?.clerkId });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User profile not found",
        });
      }

      return user.deliveryAddresses;
    } catch (error) {
      if (error instanceof TRPCError) throw error;

      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch delivery addresses",
        cause: error,
      });
    }
  }),

  deleteDeliveryAddress: protectedProcedure
    .input(
      z.object({
        addressId: z.string({ required_error: "Address ID is required" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await User.findOne({ clerkId: ctx?.user?.clerkId });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User profile not found",
          });
        }

        const addressIndex = user.deliveryAddresses.findIndex(
          (addr) => addr._id.toString() === input.addressId
        );

        if (addressIndex === -1) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Address not found",
          });
        }

        const isRemovingDefault =
          user.deliveryAddresses[addressIndex].isDefault;

        user.deliveryAddresses.splice(addressIndex, 1);

        if (isRemovingDefault && user.deliveryAddresses.length > 0) {
          user.deliveryAddresses[0].isDefault = true;
        }

        await user.save();
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete delivery address",
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

        const adminUser = await Admin.findOne({ clerkId: adminId });

        if (!adminUser) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No admin with id: ${adminId}`,
          });
        }

        const user = await User.create({
          name: adminUser.name,
          surname: adminUser.surname,
          email: adminUser.email,
          phone: adminUser.phone,
          clerkId: adminUser.clerkId,
          role: "user",
        });

        await Admin.findOneAndDelete({ _id: adminUser._id });

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
