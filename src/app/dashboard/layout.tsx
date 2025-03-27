import DashboardContentWrapper from "@/components/atom/DashboardContentWrapper";
import DesktopSideNavbar from "@/sections/desktoSideNavbar";
import MobileHeader from "@/sections/header";
import MobileNavBar from "@/sections/nav";

export const metadata = {
  title: "Dashboard | Mony",
  description: "Dashboard section of your our personal finance app,Mony",
};
const DashboardLayout = ({ children }) => {
  const darkMode = false;

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-[#FFF2E3] text-gray-800"
      } transition-colors duration-300  p-6 pb-24 md:p-0 `}
    >
      <DesktopSideNavbar />
      <MobileHeader />
      <div className="relative" style={{ zIndex: "0" }}>
        <DashboardContentWrapper>{children}</DashboardContentWrapper>
      </div>
      <MobileNavBar />
    </div>
  );
};

export default DashboardLayout;
