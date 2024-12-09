/*
#########################
Widget
#########################
*/

import type {ChatbotConfig} from "./types";

import {ChatbotUtils} from "./utils";
import {Chatbot} from "./chatbot";
export function setupWidget(config: ChatbotConfig) {
  // Setup event listeners
  const container = document.getElementById("chatbot-container");
  const widget = document.getElementById("chatbot-widget");
  const toggleButton = document.getElementById("chatbot-toggle-button");
  const closeButton = document.getElementById("chatbot-close-button");
  const sendButton = document.getElementById(
    "chatbot-send-button"
  ) as HTMLButtonElement;
  const inputBox = document.getElementById("chatbot-input") as HTMLInputElement;

  // Setup the toggle button
  if (toggleButton && container && widget) {
    console.debug("Setting up toggle button...");

    toggleButton.addEventListener("click", () => {
      console.debug("Opening chatbot widget...");

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
    Chatbot.setupSendButton(config, sendButton, inputBox);
  } else {
    console.error("Send button or input box not found");
  }
}
