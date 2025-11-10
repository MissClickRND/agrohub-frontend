import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import Main from "../../../../pages/Main/Main.page";
import ChatAI from "../../../../pages/ChatAI/ChatAI.page";
import Error404 from "../../../../pages/Errors/Error404/Error404.page";
import AuthLayout from "../../../../layouts/AuthLayout/AuthLayout";
import Login from "../../../../pages/Auth/Login/Login";
import Fields from "../../../../pages/Fields/Fields.page";
import { CalculatorPage } from "../../../../pages/Calculator/ui/Calculator.Page";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/main",
        element: <Main />,
      },
      {
        path: "/fields",
        element: <Fields />,
      },
      {
        path: "/chat-ai",
        element: <ChatAI />,
      },
      {
        path: "/calculator",
        element: <CalculatorPage />
      }
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
