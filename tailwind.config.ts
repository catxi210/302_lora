import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import type { PluginAPI } from "tailwindcss/types/config";
import containerQueries from "@tailwindcss/container-queries";

// Enhance scrollbar style, small size and smooth color
const scrollbar = ({ addBase, theme }: PluginAPI) => {
  addBase({
    // Light mode scrollbar style
    "::-webkit-scrollbar": {
      width: "4px",
      height: "4px",
    },
    "::-webkit-scrollbar-track": {
      backgroundColor: theme("colors.gray.100", "#f1f1f1"),
      borderRadius: "4px",
      width: "4px",
    },
    "::-webkit-scrollbar-thumb": {
      backgroundColor: theme("colors.gray.300", "#888"),
      borderRadius: "4px",
    },
    "::-webkit-scrollbar-thumb:hover": {
      backgroundColor: theme("colors.gray.400", "#555"),
    },
    // Dark mode scrollbar style
    ".dark ::-webkit-scrollbar": {
      width: "4px",
      height: "4px",
    },
    ".dark ::-webkit-scrollbar-track": {
      backgroundColor: theme("colors.gray.800", "#2d2d2d"),
      borderRadius: "4px",
      width: "4px",
    },
    ".dark ::-webkit-scrollbar-thumb": {
      backgroundColor: theme("colors.gray.600", "#555"),
      borderRadius: "4px",
    },
    ".dark ::-webkit-scrollbar-thumb:hover": {
      backgroundColor: theme("colors.gray.700", "#333"),
    },
  });
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pageBackground: "hsl(var(--page-background))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background, 240 10% 3.9%))",
          foreground: "hsl(var(--sidebar-foreground, 0 0% 98%))",
          primary: "hsl(var(--sidebar-primary, 217.2 91.2% 59.8%))",
          "primary-foreground":
            "hsl(var(--sidebar-primary-foreground, 222.2 47.4% 11.2%))",
          accent: "hsl(var(--sidebar-accent, 217.2 32.6% 17.5%))",
          "accent-foreground":
            "hsl(var(--sidebar-accent-foreground, 210 40% 98%))",
          border: "hsl(var(--sidebar-border, 217.2 32.6% 17.5% / 0.2))",
          ring: "hsl(var(--sidebar-ring, 217.2 91.2% 59.8% / 0.3))",
          hover: "hsl(var(--sidebar-hover, 217.2 32.6% 17.5% / 0.3))",
          active: "hsl(var(--sidebar-active, 217.2 91.2% 59.8% / 0.2))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [animate, typography, scrollbar, containerQueries],
};
export default config;
