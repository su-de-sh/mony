import AddTransactionWidget from "@/sections/nav/AddTransactionWidget";
import LogoutButton from "@/sections/nav/LogOutButton";
import AddTransactionButton from "@/sections/nav/AddTransactionButton";
import AnalyticsButton from "@/sections/nav/AnalyticsButton";

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
      } transition-colors duration-300`}
    >
      {children}
      <nav
        className={`fixed bottom-0 left-0 right-0 ${
          darkMode ? "bg-gray-800" : "bg-white"
        } shadow-lg rounded-t-3xl`}
      >
        <div className="flex justify-around items-center p-4">
          <AnalyticsButton />

          <AddTransactionButton />

          <LogoutButton />
        </div>
        <AddTransactionWidget />
      </nav>
    </div>
  );
};

export default DashboardLayout;
