module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f4f5f2",
          100: "#e6e8e1",
          200: "#c9ccc0",
          300: "#a3a794",
          400: "#767c66",
          500: "#565c4b",
          600: "#43483a",
          700: "#363a2f",
          800: "#2a2d25",
          900: "#1b1d18",
          950: "#101208",
        },
        moss: {
          50: "#eef4ee",
          100: "#d6e5d4",
          200: "#aecaab",
          300: "#82ac7d",
          400: "#5c8f56",
          500: "#43723d",
          600: "#365c31",
          700: "#2c4a29",
          800: "#233a21",
          900: "#1a2b19",
        },
        clay: {
          50: "#fbf1ea",
          100: "#f3dccb",
          200: "#e6b592",
          300: "#d68d5c",
          400: "#c06a34",
          500: "#9c5327",
          600: "#7d4220",
          700: "#61341a",
        },
        paper: "#f7f5ee",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};
