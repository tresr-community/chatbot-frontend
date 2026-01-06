/*
#########################
Name: widget.ts
Description: Widget chatbot functions.
#########################
*/

import type {ChatbotConfig} from "./types";

import {ChatbotUtils} from "./utils";

export function setupWidget(config: ChatbotConfig) {
  const toggleButton = document.getElementById("chatbot-toggle-button");
  const container = document.getElementById("chatbot-container");
  const widget = document.getElementById("chatbot-widget");
  const closeButton = document.getElementById("chatbot-close-button");
  const sendButton = document.getElementById(
    "chatbot-send-button"
  ) as HTMLButtonElement;
  const inputBox = document.getElementById("chatbot-input") as HTMLInputElement;

  // Check if the font has loaded and apply it to the widget toggle
  document.fonts.ready.then(function () {
    if (toggleButton) {
      toggleButton.style.fontFamily = "Noto Color Emoji, sans-serif";
    }
  });

  // Setup the toggle button, container, and widget.
  if (toggleButton && container && widget) {
    console.debug("Setting up toggle button...");

    toggleButton.addEventListener("click", () => {
      console.debug("Opening chatbot widget...");

      // Notify parent window
      window.parent.postMessage({type: "chatbot-open"}, "*");

      // Hide the button
      console.debug("Hiding toggle button...");
      toggleButton.classList.remove("show");
      toggleButton.classList.add("hide");

      // Show the container
      console.debug("Showing container...");
      container.classList.remove("hide");
      container.classList.add("show");

      // Show the widget inside the container
      console.debug("Showing widget...");
      widget.classList.remove("hide");
      widget.classList.add("show");

      ChatbotUtils.scrollToBottom();
    });
  } else {
    console.error("Toggle button not found");
  }

  // Setup the close button
  if (closeButton && widget && container && toggleButton) {
    console.debug("Setting up close button...");

    closeButton.addEventListener("click", () => {
      console.debug("Closing chatbot widget...");

      // Notify parent window
      window.parent.postMessage({type: "chatbot-close"}, "*");

      // Hide the widget
      console.debug("Hiding widget...");
      widget.classList.remove("show");
      widget.classList.add("hide");

      // Hide the container
      console.debug("Hiding container...");
      container.classList.remove("show");
      container.classList.add("hide");

      // Show the button
      console.debug("Showing toggle button...");
      toggleButton.classList.remove("hide");
      toggleButton.classList.add("show");
    });
  } else {
    console.error("Close button not found");
  }

  // Setup the send button
  if (sendButton && inputBox) {
    console.debug("Setting up send button...");
    ChatbotUtils.setupSendButton(config, sendButton, inputBox);
  } else {
    console.error("Send button or input box not found");
  }
}
