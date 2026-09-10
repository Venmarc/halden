/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "#1B1710",
        ink: "#F2E6A6",
        accent: "#E3B505",
        mute: "#9A8B4A",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        sans: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
