import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Webhook } from "svix";
import { logger } from "../utils/logger.js";
import { clerkClient } from "@clerk/express";

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
      if (type === "user.created") {
        logger.info("Processing user.created event");
        await handleUserCreated(evt.data);
      } else {
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

    try {
      // Check for and add user to organization
      const { data: organizations } =
        await clerkClient.organizations.getOrganizationList();
      const defaultOrg = organizations.find(
        (org) => org.name === process.env.ORG
      );

      if (defaultOrg) {
        logger.info({
          message: "Adding user to default organization",
          clerkId,
          organizationId: defaultOrg.id,
          organizationName: defaultOrg.name,
        });

        await clerkClient.organizations.createOrganizationMembership({
          organizationId: defaultOrg.id,
          userId: clerkId,
          role: "org:member",
        });

        logger.info({
          message: "Successfully added user to organization",
          clerkId,
          organizationId: defaultOrg.id,
        });
      } else {
        logger.warn({
          message: "Default organization not found, creating one.",
        });

        const newOrg = await clerkClient.organizations.createOrganization({
          name: process.env.ORG!,
        });

        await clerkClient.organizations.createOrganizationMembership({
          organizationId: newOrg.id,
          userId: clerkId,
          role: "org:member",
        });

        logger.info({
          message: "Created default organization and added user",
          clerkId,
          organizationId: newOrg.id,
        });
      }
    } catch (orgError) {
      logger.error({
        message: "Error managing organization membership",
        error: orgError instanceof Error ? orgError.message : String(orgError),
        stack: orgError instanceof Error ? orgError.stack : undefined,
        clerkId,
      });
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
