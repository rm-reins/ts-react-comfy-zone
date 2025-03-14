import {
  About,
  Cart,
  Checkout,
  Error,
  Landing,
  Orders,
  Products,
  SingleProduct,
} from "@/pages";
import HomeLayout from "@/layouts/HomeLayout";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import {
  SignIn,
  SignUp,
  SignedOut,
  RedirectToSignIn,
  useAuth,
} from "@clerk/clerk-react";
import { ReactNode } from "react";

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
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
        <SignIn
          routing="path"
          path="/sign-in"
        />
      </SignedOut>
    ),
  },
  {
    path: "/sign-up/*",
    element: (
      <SignedOut>
        <SignUp
          routing="path"
          path="/sign-up"
        />
      </SignedOut>
    ),
  },
  {
    path: "/login",
    element: (
      <Navigate
        to="/sign-in"
        replace
      />
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
