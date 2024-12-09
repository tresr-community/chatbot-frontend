/*
#########################
Initialize
#########################
*/

import type {ChatbotConfig} from "./types";
import {Chatbot} from "./chatbot";

declare global {
  interface Window {
    initChatbot: (config: ChatbotConfig) => void;
  }
}

export function initChatbot(config: ChatbotConfig) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      Chatbot.initialize(config);
    });
  } else {
    Chatbot.initialize(config);
  }
}

window.initChatbot = initChatbot;
