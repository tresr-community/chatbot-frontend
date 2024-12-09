import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./src/**/*.{astro,html,js,jsx,svelte,ts,tsx,vue}",
    "./src/styles/**/*.css",
  ],

  safelist: [
    // Direct class names for chatbot UI
    "chatbotUI-container",
    "chatbotUI-container--widget",
    "chatbotUI-container--fullscreen",
    "chatbotUI-header",
    "chatbotUI-header--widget",
    "chatbotUI-body",
    "chatbotUI-messages",
    "chatbotUI-input-box",
    "chatbotUI-input-box-text",
    "chatbotUI-send-button",
    "chatbotUI-loader",
    "chatbotUI-toggle-button",

    // Message bubble classes
    "messageBubble-container",
    "messageBubble",
    "messageBubble-left",
    "messageBubble-right",

    // Avatar classes
    "avatarImg",
    "avatarImg-left",
    "avatarImg-right",

    // Utility classes
    "show",
    "hide",
    "hidden",

    // Flex classes that we use
    "flex-row",
    "flex-row-reverse",

    // Container classes
    "container",
    "mx-auto",
    "flex",
    "items-center",
    "justify-between",
  ],

  theme: {
    extend: {
      colors: {
        // Light Theme Colors
        primary: "#DAA520", // Golden color, resembling gold coins
        light: "#F0EAD6", // Light cream, for backgrounds, like aged maps
        "text-color": "#122239", // Dark navy blue, for high readability on light backgrounds
        "border-color": "#CDBA96", // Soft gold, for subtle borders
        "title-color": "#1E3A5F", // Dark navy blue, for titles
        background: "#F0EAD6", // Light cream background
        border: "#CDBA96", // Soft gold borders
        bubble: "#F3E5AB", // Light golden background for chat bubbles or highlights

        // Dark Theme Colors
        "dark-primary": "#122239", // Dark navy blue, as primary color
        "dark-light": "#2A416D", // Slightly lighter navy for variety in dark theme elements
        "dark-text-color": "#FFFFFF", // White, for readability on dark navy backgrounds
        "dark-border-color": "#4D5B7C", // Darker shade of navy for borders
        "dark-title-color": "#F3E5AB", // Golden color for titles to pop against dark backgrounds
        "dark-background": "#2A416D", // Dark navy as background
        "dark-border": "#4D5B7C", // Darker navy for borders
        "dark-bubble": "#DAA520", // Gold, like golden coins, for chat bubbles or highlights
      },
      fontFamily: {
        sans: [
          "Jost",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
      },
    },
  },

  plugins: [forms, typography, aspectRatio],
};
