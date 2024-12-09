/*
#########################
Unified Chatbot
#########################
*/

import type {ChatbotConfig} from "./types";

import {ChatbotUtils} from "./utils";
import {setupWidget} from "./widget";
import {setupFullscreen} from "./fullscreen";

export const Chatbot = {
  container: null as HTMLElement | null,

  async initialize(config: ChatbotConfig) {
    console.debug("Initializing chatbot:", config.type);

    this.container = document.getElementById("chatbot-container");
    if (!this.container) {
      console.error("Chatbot container not found");
      return;
    }

    try {
      // Show a spinning loader if enabled
      if (config.enableLoadingSpinner === true) {
        console.debug("Loading spinner is being enabled");
        await ChatbotUtils.showLoader();
      } else {
        console.debug("Loading spinner is globally disabled");
      }

      if (config.type === "widget") {
        setupWidget(config);
      } else if (config.type === "fullscreen") {
        setupFullscreen(config);
      }

      ChatbotUtils.setupCommonEventListeners(this.container, config);
    } finally {
      // Hide the spinning loader after a timeout if enabled
      if (config.enableLoadingSpinner === true) {
        console.debug("Loading spinner is being disabled");
        setTimeout(() => {
          ChatbotUtils.hideLoader();
        }, 2500);
      } else {
        console.debug("Loading spinner is globally disabled");
      }
    }
  },

  setupSendButton(
    config: ChatbotConfig,
    sendButton: HTMLButtonElement,
    inputBox: HTMLInputElement
  ) {
    // Where are we sending the message?
    const chatbotAPI = ChatbotUtils.constructChatbotAPI(config);
    if (!chatbotAPI) {
      console.error("Chatbot API URL is not set");
      return;
    }

    // Handle when the send button is clicked.
    sendButton.addEventListener("click", async (e) => {
      e.preventDefault();
      console.debug("Submitting Chat Message...");

      const message = inputBox.value.trim();
      if (!message) return;

      inputBox.value = "";
      inputBox.disabled = true;

      // Add user message and show a Bot typing indicator
      ChatbotUtils.addMessageToChat.call(ChatbotUtils, "user", message);
      ChatbotUtils.toggleTypingIndicator.call(ChatbotUtils, true);

      try {
        await ChatbotUtils.sendMessage.call(ChatbotUtils, chatbotAPI, message);
      } catch (error) {
        console.error("Error sending message:", error);
        ChatbotUtils.addMessageToChat.call(
          ChatbotUtils,
          "bot",
          "Sorry, there was an error sending your message."
        );
      } finally {
        ChatbotUtils.toggleTypingIndicator.call(ChatbotUtils, false);
        inputBox.disabled = false;
        inputBox.focus();
      }
    });

    // Handle the Enter key press to submit the form
    if (inputBox) {
      inputBox.addEventListener("keypress", (e: KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          if (sendButton) {
            sendButton.click();
          }
        }
      });
    }
  },
};
