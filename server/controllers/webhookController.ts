import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Webhook } from "svix";
import { User } from "../models/User.js";
import { Admin } from "../models/Admin.js";
import { logger } from "../utils/logger.js";

// Define types for Clerk webhook events
interface WebhookEvent {
  type: string;
  data: ClerkUser;
}

interface ClerkUser {
  id: string;
  email_addresses: Array<{
    email_address: string;
    id: string;
  }>;
  first_name?: string;
  last_name?: string;
  username?: string;
  phone_numbers?: Array<{
    phone_number: string;
    id: string;
  }>;
  [key: string]: unknown;
}

// Handle Clerk webhook events
export const handleWebhook = async (req: Request, res: Response) => {
  try {
    logger.info("Received webhook request");

    // Get the webhook secret from environment variables
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.error("Missing CLERK_WEBHOOK_SECRET");
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Server misconfiguration",
      });
    }

    // Get the headers
    const svixId = req.headers["svix-id"] as string;
    const svixTimestamp = req.headers["svix-timestamp"] as string;
    const svixSignature = req.headers["svix-signature"] as string;

    // If there are no headers, return a 400
    if (!svixId || !svixTimestamp || !svixSignature) {
      logger.error({
        message: "Missing Svix headers",
        headers: req.headers,
      });
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Missing Svix headers",
      });
    }

    logger.info("Webhook headers received correctly");

    // Log the payload for debugging
    logger.info({
      message: "Webhook payload",
      body: req.body,
    });

    // Initialize the Webhook instance with the secret
    const wh = new Webhook(webhookSecret);

    // Verify the webhook payload
    const payload = req.body;
    const body = JSON.stringify(payload);

    let evt: WebhookEvent;

    try {
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;

      logger.info({
        message: "Webhook verification successful",
        type: evt.type,
      });
    } catch (err) {
      logger.error({
        message: "Error verifying webhook",
        error: err instanceof Error ? err.message : String(err),
      });
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Error verifying webhook",
      });
    }

    // Get the event type
    const { type } = evt;

    // Process the event based on its type
    try {
      switch (type) {
        case "user.created":
          logger.info("Processing user.created event");
          await handleUserCreated(evt.data);
          break;
        case "user.updated":
          logger.info("Processing user.updated event");
          await handleUserUpdated(evt.data);
          break;
        // Add more event types as needed
        default:
          logger.info(`Unhandled webhook event: ${type}`);
      }

      // Return a 200 response
      logger.info("Webhook processed successfully");
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "Webhook processed successfully",
      });
    } catch (processingError) {
      // Handle specific event processing errors
      logger.error({
        message: `Error processing webhook event: ${type}`,
        error:
          processingError instanceof Error
            ? processingError.message
            : String(processingError),
        stack:
          processingError instanceof Error ? processingError.stack : undefined,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: `Error processing webhook event: ${type}`,
        error:
          processingError instanceof Error
            ? processingError.message
            : String(processingError),
      });
    }
  } catch (error) {
    logger.error({
      message: "Error processing webhook",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Error processing webhook",
    });
  }
};

// Handle user.created event
const handleUserCreated = async (data: ClerkUser) => {
  try {
    const { id: clerkId, email_addresses, first_name, last_name } = data;

    logger.info({
      message: "Starting user creation process",
      clerkId,
      email: email_addresses?.[0]?.email_address,
      firstName: first_name,
      lastName: last_name,
    });

    // Check if the user already exists
    const existingUser = await User.findOne({ clerkId });
    const existingAdmin = await Admin.findOne({ clerkId });

    if (existingUser) {
      logger.info({
        message: "User already exists, updating instead",
        clerkId,
        userId: String(existingUser._id),
      });
      // User exists - let's update it with more complete information
      await User.findOneAndUpdate(
        { clerkId },
        {
          name: first_name || existingUser.name,
          surname: last_name || existingUser.surname,
          email:
            email_addresses && email_addresses.length > 0
              ? email_addresses[0].email_address
              : existingUser.email,
        }
      );
      return;
    }

    if (existingAdmin) {
      logger.info({
        message: "User exists as admin, skipping creation",
        clerkId,
        adminId: String(existingAdmin._id),
      });
      return;
    }

    // Get the email address
    const email =
      email_addresses && email_addresses.length > 0
        ? email_addresses[0].email_address
        : "";

    logger.info({
      message: "Checking for existing email",
      email,
    });

    // Check if a user with the email already exists
    const emailExistsUser = await User.findOne({ email });
    const emailExistsAdmin = await Admin.findOne({ email });

    if (emailExistsUser) {
      logger.info({
        message: "User with email already exists",
        email,
        userId: String(emailExistsUser._id),
      });
      return;
    }

    if (emailExistsAdmin) {
      logger.info({
        message: "Admin with email already exists",
        email,
        adminId: String(emailExistsAdmin._id),
      });
      return;
    }

    logger.info({
      message: "Creating new user",
      clerkId,
      email,
      firstName: first_name,
      lastName: last_name,
    });

    // Log the user object before creation
    const newUserData = {
      clerkId,
      name: first_name || "User",
      surname: last_name || "",
      email,
      phone: "",
      deliveryAddress: {
        street: "Oranienplatz 1",
        city: "Berlin",
        state: "Berlin",
        postalCode: "10115",
        country: "Germany",
      },
      role: "user",
    };

    logger.info({
      message: "User data to be created",
      userData: newUserData,
    });

    try {
      // Create a new user
      const newUser = await User.create(newUserData);

      logger.info({
        message: "Successfully created new user",
        clerkId,
        userId: String(newUser._id),
        email: newUser.email,
      });

      // Verify the user was created
      const verifyUser = await User.findOne({ clerkId });
      if (!verifyUser) {
        logger.error({
          message: "User creation verification failed - user not found",
          clerkId,
        });
        throw new Error("User creation verification failed");
      }

      logger.info({
        message: "User creation verified",
        clerkId,
        userId: String(verifyUser._id),
      });
    } catch (dbError) {
      logger.error({
        message: "Database error while creating user",
        error: dbError instanceof Error ? dbError.message : String(dbError),
        stack: dbError instanceof Error ? dbError.stack : undefined,
        userData: newUserData,
      });

      if (dbError instanceof Error && dbError.name === "ValidationError") {
        logger.error({
          message: "Validation error while creating user",
          validationErrors: JSON.stringify(dbError),
        });
      }

      throw dbError;
    }
  } catch (error) {
    logger.error({
      message: "Error in handleUserCreated",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      clerkId: data.id,
    });
    throw error; // Re-throw to be caught by the main handler
  }
};

// Handle user.updated event
const handleUserUpdated = async (data: ClerkUser) => {
  try {
    const { id: clerkId, email_addresses, first_name, last_name } = data;

    logger.info({
      message: "Processing user update",
      clerkId,
    });

    // Try to find the user
    const user = await User.findOne({ clerkId });

    if (user) {
      // Get the email address
      const email =
        email_addresses && email_addresses.length > 0
          ? email_addresses[0].email_address
          : user.email;

      // Update user data if needed
      if (
        email !== user.email ||
        (first_name && first_name !== user.name) ||
        (last_name && last_name !== user.surname)
      ) {
        await User.findOneAndUpdate(
          { clerkId },
          {
            email,
            name: first_name || user.name,
            surname: last_name || user.surname,
          }
        );

        logger.info(`Updated user with Clerk ID: ${clerkId}`);
      }
    } else {
      // Check admin
      const admin = await Admin.findOne({ clerkId });

      if (admin) {
        // Get the email address
        const email =
          email_addresses && email_addresses.length > 0
            ? email_addresses[0].email_address
            : admin.email;

        // Update admin data if needed
        if (
          email !== admin.email ||
          (first_name && first_name !== admin.name) ||
          (last_name && last_name !== admin.surname)
        ) {
          await Admin.findOneAndUpdate(
            { clerkId },
            {
              email,
              name: first_name || admin.name,
              surname: last_name || admin.surname,
            }
          );

          logger.info(`Updated admin with Clerk ID: ${clerkId}`);
        }
      } else {
        // If neither user nor admin exists, create a new user
        logger.info("User not found, creating new user");
        await handleUserCreated(data);
      }
    }
  } catch (error) {
    logger.error({
      message: "Error updating user from webhook",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
  }
};
