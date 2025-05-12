import {
  About,
  Cart,
  Checkout,
  Landing,
  Products,
  SingleProduct,
  Login,
  SignUpPage,
  UserProfile,
} from "@/pages";
import HomeLayout from "@/shared/layouts/HomeLayout";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  useRouteError,
} from "react-router-dom";
import { SignedOut } from "@clerk/clerk-react";
import React, { ReactNode, useEffect, useState } from "react";
import { ErrorFallback } from "@/shared/errors";
import { Skeleton } from "@/shared/ui";
import AdminPage from "./pages/AdminPage";
import {
  useSetActiveOrganization,
  useAuthUser,
} from "@/features/auth/useAuthUser";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface AdminPageProps {
  readOnly?: boolean;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuthUser();

  if (!isLoaded) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!isSignedIn) {
    return (
      <Navigate
        to="/sign-in"
        replace
      />
    );
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isAdmin, isLoaded, isOrgLoaded, user } = useAuthUser();
  const [isReady, setIsReady] = useState(false);

  // Check if user is a demo user
  const demoEmail = import.meta.env.VITE_CLERK_SIGN_IN_DEMO_USER_EMAIL;

  // Type narrowing to check if the user email matches demo email
  const userEmail =
    user &&
    typeof user === "object" &&
    "emailAddresses" in user &&
    Array.isArray(user.emailAddresses) &&
    user.emailAddresses.length > 0 &&
    "emailAddress" in user.emailAddresses[0]
      ? user.emailAddresses[0].emailAddress
      : undefined;

  const isDemoUser = userEmail === demoEmail;

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Short delay to allow organization data to load
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isLoaded, isSignedIn, isOrgLoaded]);

  if (!isLoaded || !isReady) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!isSignedIn) {
    return (
      <Navigate
        to="/sign-in"
        replace
      />
    );
  }

  // Allow access for admins and demo users
  if (!isAdmin && !isDemoUser) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  // Pass readOnly prop when it's a demo user but not an admin
  return (
    <>
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            readOnly: isDemoUser && !isAdmin,
          } as AdminPageProps)
        : children}
    </>
  );
};

function RouterErrorElement() {
  const error = useRouteError();
  return <ErrorFallback error={error as Error} />;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <RouterErrorElement />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:id",
        element: <SingleProduct />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <AdminRoute>
        <AdminPage />
      </AdminRoute>
    ),
    errorElement: <RouterErrorElement />,
  },
  {
    path: "/sign-in/*",
    element: (
      <SignedOut>
        <Login />
      </SignedOut>
    ),
  },
  {
    path: "/sign-up/*",
    element: (
      <SignedOut>
        <SignUpPage />
      </SignedOut>
    ),
  },
  {
    path: "/register",
    element: (
      <Navigate
        to="/sign-up"
        replace
      />
    ),
  },
]);

function AppWithOrganizationInit() {
  useSetActiveOrganization();
  return <RouterProvider router={router} />;
}

export default AppWithOrganizationInit;
