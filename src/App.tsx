import {
  Landing,
  Error,
  Register,
  Login,
  Products,
  SingleProduct,
  Cart,
  Checkout,
  Orders,
} from "@/pages";
import HomeLayout from "./layouts/HomeLayout";
import { useAppSelector } from "./hooks";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
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
        element: <Checkout />,
      },
      {
        path: "/orders",
        element: <Orders />,
      },
    ],
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  const { name } = useAppSelector((state) => state.userState);

  return <RouterProvider router={router} />;
}

export default App;
