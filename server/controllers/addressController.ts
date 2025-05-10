import { Address } from "../models/Address.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/custom-errors.js";

const createAddress = async (req: Request, res: Response) => {
  const { street, city, state, postalCode, country, clerkId } = req.body;

  let defaultAddress = false;
  const ifSingle = await Address.findOne({ clerkId });

  if (ifSingle) {
    defaultAddress = true;
  }

  const address = await Address.create({
    street,
    city,
    state,
    postalCode,
    country,
    clerkId,
    isDefault: defaultAddress,
  });

  res.status(StatusCodes.CREATED).json({ address });
};

const getCurrentUserAddresses = async (req: Request, res: Response) => {
  const { clerkId } = req.user.id;

  const addresses = await Address.find({ clerkId });

  res.status(StatusCodes.OK).json({ addresses });
};

const updateAddress = async (req: Request, res: Response) => {
  const { _id: addressId } = req.params;
  const { street, city, state, postalCode, country } = req.body;

  const address = await Address.findOneAndUpdate(
    { _id: addressId },
    { street, city, state, postalCode, country },
    { new: true, runValidators: true }
  );

  if (!address) {
    throw NotFoundError(`No address with id: ${addressId}`);
  }

  res.status(StatusCodes.OK).json({ address });
};

const deleteAddress = async (req: Request, res: Response) => {
  const { _id: addressId } = req.params;

  const address = await Address.findOneAndDelete({ _id: addressId });

  if (!address) {
    throw NotFoundError(`No address with id: ${addressId}`);
  }

  res.status(StatusCodes.NO_CONTENT).send();
};

const setDefaultAddress = async (req: Request, res: Response) => {
  const { _id: addressId } = req.params;

  const address = await Address.findOneAndUpdate(
    { _id: addressId },
    { isDefault: true },
    { new: true, runValidators: true }
  );

  if (!address) {
    throw NotFoundError(`No address with id: ${addressId}`);
  }

  res.status(StatusCodes.OK).json({ address });
};

export {
  createAddress,
  getCurrentUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
