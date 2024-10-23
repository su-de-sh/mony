import { Search } from "lucide-react";
import SideNavBar from "../sidenav";

const MonyLogo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="#FF9F43" />
    <path
      d="M11 20C11 15.0294 15.0294 11 20 11C24.9706 11 29 15.0294 29 20C29 24.9706 24.9706 29 20 29"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
    />
    <circle cx="20" cy="20" r="4" fill="white" />
  </svg>
);

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
