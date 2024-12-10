/*
#########################
Fullscreen
#########################
*/

import type {ChatbotConfig} from "./types";

import {ChatbotUtils} from "./utils";

export function setupFullscreen(config: ChatbotConfig) {
  const sendButton = document.getElementById(
    "chatbot-send-button"
  ) as HTMLButtonElement;
  const inputBox = document.getElementById("chatbot-input") as HTMLInputElement;

  // Setup the send button and input box.
  if (sendButton && inputBox) {
    console.debug("Setting up send button...");
    ChatbotUtils.setupSendButton(config, sendButton, inputBox);
  } else {
    console.error("Send button or input box not found");
  }
}
