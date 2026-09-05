import { Wallet, Plus, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Topbar = ({ onAddClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-border-light dark:border-border-dark bg-white/90 dark:bg-base-dark/90 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shrink-0">
            <Wallet size={18} className="text-white" strokeWidth={2.25} />
          </div>
          <div>
            <h1 className="font-display font-semibold text-lg leading-none tracking-tight">
              Pocketwise
            </h1>
            <p className="text-xs text-muted mt-0.5 hidden sm:block">Your money, at a glance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-9 h-9 rounded-full flex items-center justify-center border border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={onAddClick}
            className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm px-3.5 sm:px-4 py-2 rounded-xl transition-colors shadow-soft"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span className="hidden sm:inline">Add transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
