import { Home } from "lucide-react";
import Link from "next/link";

const HomeButton = () => {
  const darkMode = false;

  return (
    <Link href={`/dashboard`}>
      <button
        className={`p-2 rounded-full ${
          darkMode
            ? "text-orange-400 hover:bg-gray-700"
            : "text-orange-600 hover:bg-orange-100"
        } transition-colors`}
      >
        <Home className="text-orange-500" />
      </button>
    </Link>
  );
};

export default HomeButton;
