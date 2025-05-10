import { z } from "zod";
import { TRPCError } from "../trpc.js";
import { Address } from "../../models/Address.js";
import { router, protectedProcedure } from "../trpc.js";

const deliveryAddressSchema = z.object({
  _id: z.string().optional(),
  firstName: z.string({ required_error: "Please provide first name" }),
  lastName: z.string({ required_error: "Please provide last name" }),
  street: z.string({ required_error: "Please provide street address" }),
  city: z.string({ required_error: "Please provide city name" }),
  state: z
    .string({ required_error: "Please provide state/province" })
    .optional(),
  postalCode: z.string({ required_error: "Please provide postal code" }),
  country: z.string({ required_error: "Please provide country" }),
  clerkId: z.string(),
  isDefault: z.boolean().default(false),
});

export const addressRouter = router({
  createAddress: protectedProcedure
    .input(deliveryAddressSchema)
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const ifSingle = await Address.findOne({ clerkId: userId });

      if (ifSingle === null) {
        input.isDefault = true;
      }

      const address = await Address.create({
        ...input,
        clerkId: userId,
      });

      return address;
    }),

  getCurrentUserAddresses: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    const addresses = await Address.find({ clerkId: userId });
    return addresses;
  }),

  getAddress: protectedProcedure
    .input(
      z.object({
        clerkId: z.string(),
        isDefault: z.boolean().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const address = await Address.findOne({
        clerkId: input.clerkId,
        isDefault: input.isDefault,
      });

      return address;
    }),

  updateAddress: protectedProcedure
    .input(deliveryAddressSchema.extend({ _id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const address = await Address.findOneAndUpdate(
        { _id: input._id, clerkId: userId },
        { ...input, clerkId: userId },
        { new: true, runValidators: true }
      );

      if (!address) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Address not found or you don't have permission to update it",
        });
      }

      return address;
    }),

  deleteAddress: protectedProcedure
    .input(
      z.object({
        _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const address = await Address.findOneAndDelete({
        _id: input._id,
        clerkId: userId,
      });

      if (!address) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message:
            "Address not found or you don't have permission to delete it",
        });
      }

      return address;
    }),

  setDefaultAddress: protectedProcedure
    .input(
      z.object({
        _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      try {
        await Address.updateMany(
          { clerkId: userId, isDefault: true },
          { isDefault: false }
        );

        // Then set the new default address
        const address = await Address.findOneAndUpdate(
          { _id: input._id, clerkId: userId },
          { isDefault: true },
          { new: true, runValidators: true }
        );

        if (!address) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message:
              "Address not found or you don't have permission to update it",
          });
        }

        return address;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to set default address",
          cause: error,
        });
      }
    }),
});
