import express from "express";
import {
  createAddress,
  getCurrentUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.route("/").post(createAddress);

router.route("/show-all-my-addresses").get(getCurrentUserAddresses);

router
  .route("/:id")
  .patch(updateAddress)
  .patch(setDefaultAddress)
  .delete(deleteAddress);

export { router as addressRouter };
