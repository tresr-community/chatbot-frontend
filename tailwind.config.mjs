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
        // Base Colors
        "nftreasure-navy": "#020617", // slate-950
        "nftreasure-gold": "#fcd34d", // amber-300
        "nftreasure-cream": "#94a3b8", // stone-400
        "nftreasure-gray": "#111827", // gray-900

        // Light Theme
        "nftreasure-primary": "#fcd34d", // amber-300
        "nftreasure-light": "#94a3b8", // stone-400
        "nftreasure-background": "#94a3b8", // stone-400
        "nftreasure-border": "#fcd34d", // amber-300
        "nftreasure-title-color": "#020617", // slate-950
        "nftreasure-text-color": "#020617", // slate-950
        "nftreasure-border-color": "#fcd34d", // amber-300

        // Speech Bubble Light
        "nftreasure-bubble-bg": "#f5f5f4", // stone-100
        "nftreasure-bubble-text": "#020617", // slate-950

        // Dark Theme
        "nftreasure-dark-primary": "#020617", // slate-950
        "nftreasure-dark-light": "#1e293b", // slate-800
        "nftreasure-dark-title-color": "#fcd34d", // amber-300
        "nftreasure-dark-border-color": "#fcd34d", // amber-300
        "nftreasure-dark-background": "#020617", // slate-950
        "nftreasure-dark-text-color": "#ffffff",
        "nftreasure-dark-border": "#1e293b", // slate-800

        // Speech Bubble Dark
        "nftreasure-dark-bubble-bg": "#fcd34d", // amber-300
        "nftreasure-dark-bubble-text": "#020617", // slate-950

        // UI Elements
        "nftreasure-input-bg": "#ffffff",
        "nftreasure-input-bg-dark": "#1e293b", // slate-800
        "nftreasure-input-border": "#d1d5db", // gray-300
        "nftreasure-input-border-dark": "#111827", // gray-900
        "nftreasure-input-text": "#111827", // gray-900
        "nftreasure-input-text-dark": "#ffffff",
        "nftreasure-placeholder": "#6b7280", // gray-500
        "nftreasure-placeholder-dark": "#9ca3af", // gray-400

        // Links
        "nftreasure-link": "#3b82f6", // blue-500
        "nftreasure-link-hover": "#1d4ed8", // blue-700
        "nftreasure-link-dark": "#60a5fa", // blue-400
        "nftreasure-link-hover-dark": "#93c5fd", // blue-300

        // Loader
        "nftreasure-loader-start": "#fcd34d", // amber-300
        "nftreasure-loader-end": "#fbbf24", // amber-400

        // Overlay
        "nftreasure-overlay": "rgba(4,28,101,0.788)",
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
