import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import daisyui from "daisyui";
import themes from "daisyui/src/theming/themes";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
        roboto: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          ...themes["light"],
          primary: "#204085",
        },
      },
      {
        dark: {
          ...themes["dark"],
          primary: "#2b58ba",
        },
      },
    ],
  },
} satisfies Config;
