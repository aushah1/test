import { Outlet } from "react-router";
import Navbar from "../features/shared/components/Navbar";
import Footer from "../features/shared/components/Footer";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
