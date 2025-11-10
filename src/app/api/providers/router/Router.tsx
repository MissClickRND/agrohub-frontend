import { createBrowserRouter, RouterProvider } from "react-router-dom";

import MainLayout from "../../../../layouts/MainLayout/MainLayout";
import Main from "../../../../pages/Main/Main.page";
import ChatAI from "../../../../pages/ChatAI/ChatAI.page";
import Error404 from "../../../../pages/Errors/Error404/Error404.page";
import AuthLayout from "../../../../layouts/AuthLayout/AuthLayout";
import Login from "../../../../pages/Auth/Login/Login";
import Fields from "../../../../pages/Fields/Fields.page";
import JournalCultures from "../../../../pages/JournalCultures/JournalCultures.page";
import GroundsPage from "../../../../pages/Grounds/Grounds.page.tsx";

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
        path: "/fields",
        element: <Fields />,
      },
      {
        path: "/journals",
        element: <JournalCultures />,
      },
      {
        path: "/chat-ai",
        element: <ChatAI />,
      },
      {
        path: "/ground",
        element: <GroundsPage />,
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
