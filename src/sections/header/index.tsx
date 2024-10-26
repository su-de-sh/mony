import { Search } from "lucide-react";
import SideNavBar from "../sidenav";
import { MonyLogo } from "@/components/atom/Logo";

const Header = () => {
  const darkMode = false;
  return (
    <header className="flex justify-between items-center mb-8">
      <SideNavBar />

      <div className="flex items-center">
        <MonyLogo />
        <h1
          className={`text-3xl font-bold ${
            darkMode ? "text-orange-400" : "text-orange-600"
          } ml-2`}
        >
          Mony
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <Search
          className={`w-6 h-6 ${
            darkMode ? "text-orange-400" : "text-orange-600"
          }`}
        />
      </div>
    </header>
  );
};

export default Header;
