/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
      },
      colors: {
        paper: "#F6F5F0",
        ink: "#1F2422",
        surface: {
          light: "#FFFFFF",
          dark: "#1B1F24",
        },
        base: {
          dark: "#12151A",
        },
        border: {
          light: "#E5E2D8",
          dark: "#2A2F36",
        },
        brand: {
          50: "#EAF5F1",
          100: "#CDE8DF",
          400: "#2E9C82",
          500: "#0F6F5C",
          600: "#0B584A",
          700: "#094539",
        },
        income: "#1E9E6B",
        expense: "#E4572E",
        muted: "#8A8F87",
      },
      borderRadius: {
        xl: "0.875rem",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(20, 20, 15, 0.04), 0 4px 16px rgba(20, 20, 15, 0.04)",
      },
    },
  },
  plugins: [],
};
