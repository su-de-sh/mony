import AnalyticsButton from "./AnalyticsButton";
import AddTransactionButton from "./AddTransactionButton";
import AddTransactionWidget from "./AddTransactionWidget";
import HomeButton from "./HomeButton";

const NavBar = () => {
  const darkMode = false;
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 ${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-lg rounded-t-3xl`}
    >
      <div className="flex justify-around items-center p-4">
        <HomeButton />
        <AddTransactionButton />

        <AnalyticsButton />
      </div>
      <AddTransactionWidget />
    </nav>
  );
};

export default NavBar;
