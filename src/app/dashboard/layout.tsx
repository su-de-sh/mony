import Header from "@/sections/header";
import NavBar from "@/sections/nav";

export const metadata = {
  title: "Dashboard | Mony",
  description: "Dashboard section of your our personal finance app,Mony",
};
const DashboardLayout = ({ children }) => {
  const darkMode = false;

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-orange-50 to-orange-100 text-gray-800"
      } transition-colors duration-300  p-6 pb-24`}
    >
      <Header />
      {children}
      <NavBar />
    </div>
  );
};

export default DashboardLayout;
