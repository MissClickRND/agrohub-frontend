import { Outlet } from "react-router-dom";
import NavLayout from "./components/NavLayout";

export default function MainLayout() {
  return (
    <>
      <NavLayout />
      <Outlet />
    </>
  );
}
