/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        iopn: {
          dark: "#0f172a",        // Updated to match wallet connect - darker slate
          "dark-card": "#1e293b", // New color for cards
          navy: "#1d2449",
          purple: "#4105b6",
          blue: "#2280cd",
          cyan: "#b0efff",
          light: "#f8fdff",
        },
      },
      backgroundImage: {
        "gradient-iopn": "linear-gradient(135deg, #4105b6 0%, #2280cd 100%)",
        "gradient-iopn-reverse": "linear-gradient(135deg, #2280cd 0%, #4105b6 100%)",
        "gradient-dark": "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", // New dark gradient
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(65, 5, 182, 0.15)",
        "glass-hover": "0 12px 48px 0 rgba(65, 5, 182, 0.25)",
        "glass-dark": "0 8px 32px 0 rgba(0, 0, 0, 0.3)",           // New dark shadows
        "glass-dark-hover": "0 12px 48px 0 rgba(99, 102, 241, 0.3)",
      },
    },
  },
  plugins: [],
};