// Make this file a module
import { IUser } from "../models/User";

declare module "express" {
  interface Request {
    user?: IUser;
    auth?: {
      userId: string;
      sessionId: string;
      session: Record<string, unknown>;
      user: {
        id: string;
        firstName?: string;
        lastName?: string;
        emailAddresses?: Array<{
          id: string;
          emailAddress: string;
          verification: Record<string, unknown>;
        }>;
        phoneNumbers?: Array<{
          id: string;
          phoneNumber: string;
          verification: Record<string, unknown>;
        }>;
        [key: string]: unknown;
      };
      organization: Record<string, unknown> | null;
      orgId?: string;
      orgRole?: string;
      orgSlug?: string;
      actor?: Record<string, unknown> | null;
      actorId?: string;
      actorType?: string;
    };
  }
}
export {};
