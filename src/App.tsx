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
import { SignedOut, useAuth } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { ErrorFallback } from "@/shared/errors";
import { Skeleton } from "@/shared/ui";
import AdminPage from "./pages/AdminPage";
import { trpc } from "./trpc/trpc";
import { Admin } from "@/trpc/types";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn, isLoaded } = useAuth();

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
  const { isSignedIn, isLoaded } = useAuth();
  const { data: admin } = trpc.admin.getCurrentAdmin.useQuery() as {
    data: Admin | undefined;
  };

  if (admin?.role !== "admin") {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

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

function App() {
  return <RouterProvider router={router} />;
}

export default App;
