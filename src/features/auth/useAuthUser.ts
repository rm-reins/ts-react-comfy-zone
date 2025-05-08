import {
  useOrganization,
  useAuth,
  useUser,
  useClerk,
} from "@clerk/clerk-react";
import { useEffect } from "react";

interface OrganizationMembership {
  organization: {
    id: string;
    name: string;
  };
  role: string;
}

export interface AuthUser {
  isSignedIn: boolean;
  userId: string | null | undefined;
  user: unknown;
  organization: unknown | null;
  isAdmin: boolean;
  isOrgLoaded: boolean;
  isLoaded: boolean;
}

export const useAuthUser = (): AuthUser => {
  const { isSignedIn, userId, isLoaded } = useAuth();
  const { user } = useUser();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();

  const isAdmin =
    !!organization &&
    !!user?.organizationMemberships?.some(
      (membership: OrganizationMembership) => {
        const isMatch =
          membership.organization.id === organization.id &&
          membership.role === "org:admin";

        return isMatch;
      }
    );

  return {
    isSignedIn: !!isSignedIn,
    userId,
    user,
    organization: isOrgLoaded ? organization : null,
    isAdmin,
    isOrgLoaded,
    isLoaded,
  };
};

export interface SetActiveOrgResult {
  isSettingOrg: boolean;
  currentOrg: unknown;
}

export const useSetActiveOrganization = (): SetActiveOrgResult => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();
  const clerk = useClerk();

  useEffect(() => {
    if (isLoaded && isSignedIn && user && !organization) {
      const org = user.organizationMemberships?.find(
        (membership: OrganizationMembership) =>
          membership.organization.name === import.meta.env.ORG
      );

      if (org) {
        clerk
          .setActive({
            organization: org.organization.id,
          })
          .catch((error: Error) => {
            console.error("Error setting active organization:", error);
          });
      }
    }
  }, [isLoaded, isSignedIn, user, organization, clerk]);

  return {
    isSettingOrg: isLoaded && isSignedIn && !organization,
    currentOrg: organization,
  };
};
