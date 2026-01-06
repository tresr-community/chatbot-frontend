/*
#########################
Name: chatbot.ts
Description: Unified Chatbot for fullscreen or widget
#########################
*/

import type {ChatbotConfig} from "./types";

import {ChatbotUtils} from "./utils";
import {setupWidget} from "./widget";
import {setupFullscreen} from "./fullscreen";

export const Chatbot = {
  container: null as HTMLElement | null,

  /*
  Initialize the chatbot.
  */
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
    } catch (error) {
      console.error("Error initializing chatbot:", error);
    } finally {
      // Hide the spinning loader after a timeout if enabled
      if (config.enableLoadingSpinner === true) {
        console.debug("Loading spinner is being disabled");
        setTimeout(() => {
          ChatbotUtils.hideLoader();
        }, 1500);
      } else {
        console.debug("Loading spinner is globally disabled");
      }
    }
  },
};
