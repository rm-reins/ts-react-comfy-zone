import {
  About,
  Cart,
  Checkout,
  Landing,
  Orders,
  Products,
  SingleProduct,
  Login,
  SignUpPage,
} from "@/pages";
import HomeLayout from "@/shared/layouts/HomeLayout";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  useRouteError,
} from "react-router-dom";
import { SignedOut, RedirectToSignIn, useAuth } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { ErrorFallback } from "@/shared/errors";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return children;
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
        path: "/orders",
        element: (
          <ProtectedRoute>
            <Orders />
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
