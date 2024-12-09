/*
#########################
Fullscreen
#########################
*/

import type {ChatbotConfig} from "./types";

import {Chatbot} from "./chatbot";

export function setupFullscreen(config: ChatbotConfig) {
  // Setup event listeners
  const sendButton = document.getElementById(
    "chatbot-send-button"
  ) as HTMLButtonElement;
  const inputBox = document.getElementById("chatbot-input") as HTMLInputElement;

  // Setup the send button
  if (sendButton && inputBox) {
    console.debug("Setting up send button...");
    Chatbot.setupSendButton(config, sendButton, inputBox);
  } else {
    console.error("Send button or input box not found");
  }
}
