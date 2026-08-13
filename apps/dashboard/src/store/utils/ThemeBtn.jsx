import { useTheme } from "@/context/Themcontext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-400 dark:border-gray-600 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm hover:scale-105 transition-all duration-300"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
      <span className="text-sm font-medium">
        {theme === "light" ? "Dark Mode" : "Light Mode"}
      </span>
    </button>
  );
};

export default ThemeToggle;
