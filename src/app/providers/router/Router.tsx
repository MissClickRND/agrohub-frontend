import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import Main from "../../../pages/Main/Main.page";
import About from "../../../pages/About/About.page";
import Error404 from "../../../pages/Errors/Error404/Error404.page";
import AuthLayout from "../../../layouts/AuthLayout/AuthLayout";
import Login from "../../../pages/Auth/Login/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Main />,
      },
      {
        path: "/about",
        element: <About />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
      {
        path: "/auth/register",
        element: <></>,
      },
    ],
  },
  {
    path: "*",
    element: <Error404 />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
