import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout/MainLayout";
import Main from "../../../pages/Main/Main.page";
import About from "../../../pages/About/About.page";
import Error404 from "../../../pages/Errors/Error404/Error404.page";


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
    path: "*",
    element: <Error404 />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
