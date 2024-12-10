/*
#########################
Common Utilities
#########################
*/

import type {ChatbotConfig} from "./types";
import {marked} from "marked";
import DOMPurify from "dompurify";
import {emojify} from "node-emoji";

export const ChatbotUtils = {
  /*
  Variables
  */

  // State tracker for the typing indicator.
  isTypingIndicatorEnabled: false,

  /*
  Get Config extracts the configuration data from the script tags.
  */
  getConfig() {
    const scriptTag = (document.currentScript ||
      document.querySelector('script[src*="chatbot.js"]')) as HTMLScriptElement;

    if (!scriptTag) {
      console.error("Script tag not found. Aborting chatbot load.");
      return null;
    }

    // Verify that the chatbot type is either "widget" or "fullscreen"
    const chatbotType = scriptTag.dataset.chatbotType;
    if (!chatbotType || !["widget", "fullscreen"].includes(chatbotType)) {
      console.error("Chatbot type not specified. Aborting chatbot load.");
      return null;
    }

    // Verify that the chatbot style is either "light" or "dark" or default to "light"
    if (
      !scriptTag.dataset.chatbotStyle ||
      !["light", "dark"].includes(scriptTag.dataset.chatbotStyle)
    ) {
      console.warn("Chatbot style not specified. Defaulting to light.");
      scriptTag.dataset.chatbotStyle = "light";
    }

    // Verify that the chatbot API version is specified
    if (!scriptTag.dataset.chatbotApiVersion) {
      console.error(
        "Chatbot API version not specified. Aborting chatbot load."
      );
      return null;
    }

    // Verify that the chatbot API backend is specified
    if (!scriptTag.dataset.chatbotApiBackend) {
      console.error(
        "Chatbot API backend not specified. Aborting chatbot load."
      );
      return null;
    }

    // Verify that the chatbot enable loading spinner is specified or default to true
    if (!scriptTag.dataset.chatbotEnableLoadingSpinner) {
      console.debug(
        "Chatbot enable loading spinner not specified. Defaulting to true."
      );
      scriptTag.dataset.chatbotEnableLoadingSpinner = "true";
    }

    // Verify that the chatbot debug is specified or default to false
    if (!scriptTag.dataset.chatbotDebug) {
      console.debug("Chatbot debug not specified. Defaulting to false.");
      scriptTag.dataset.chatbotDebug = "false";
    }

    const scriptUrl = new URL(scriptTag.src);
    return {
      type: scriptTag.dataset.chatbotType,
      baseUrl: scriptUrl.origin,
      apiVersion: scriptTag.dataset.chatbotApiVersion,
      apiBackend: scriptTag.dataset.chatbotApiBackend,
      style: scriptTag.dataset.chatbotStyle,
      showButton: scriptTag.dataset.chatbotShowButton,
      enableLoadingSpinner: scriptTag.dataset.chatbotEnableLoadingSpinner,
      debug: scriptTag.dataset.chatbotDebug,
    };
  },

  /*
  Construct Chatbot API constructs the chatbot API URL.
  */
  constructChatbotAPI(config: ChatbotConfig) {
    if (!config.baseUrl || !config.apiVersion || !config.apiBackend) {
      console.error("Chatbot API version or backend not specified");
      return null;
    }

    const chatbotURL = `${config.baseUrl}/ai/${config.apiVersion}/${config.apiBackend}`;
    console.debug("Using ChatBot API URL:", chatbotURL);
    return chatbotURL;
  },

  /*
  Toggle Typing Indicator toggles the typing indicator.
  */
  toggleTypingIndicator(show: boolean) {
    if (this.isTypingIndicatorEnabled === show) {
      console.debug("Typing indicator is already in the desired state:", show);
      return;
    } else {
      console.debug("Toggling typing indicator to:", show);
    }

    const chatMessages = document.getElementById("chatbot-messages");
    const typingIndicators = document.querySelectorAll(
      ".typing-indicator-container"
    );
    const inputElement = document.getElementById(
      "chatbot-input"
    ) as HTMLInputElement;

    if (!inputElement || !chatMessages) {
      console.warn("Required chat elements not found");
      return;
    }

    // Remove only typing indicators
    typingIndicators.forEach((indicator) => indicator.remove());

    inputElement.placeholder = show
      ? "Ron Jay is typing..."
      : "Enter your message for Ron";

    if (show) {
      const typingIndicator = document.createElement("div");
      typingIndicator.id = "typing-indicator";
      typingIndicator.className =
        "messageBubble-container flex-row typing-indicator-container";

      const bubbleContainer = document.createElement("div");
      bubbleContainer.className =
        "messageBubble messageBubble-right typing-bubble !flex !flex-row !items-center gap-1";

      // Create three dots for the animation
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement("div");
        dot.className = "typing-dot inline-block";
        bubbleContainer.appendChild(dot);
      }

      const avatarImg = document.createElement("img");
      avatarImg.src = "/images/support.png";
      avatarImg.className = "avatarImg avatarImg-right";

      typingIndicator.appendChild(avatarImg);
      typingIndicator.appendChild(bubbleContainer);
      chatMessages.appendChild(typingIndicator);

      this.scrollToBottom();
    }

    this.isTypingIndicatorEnabled = show;
  },

  /*
  Scroll to the bottom of the chat messages.
  */
  scrollToBottom() {
    const chatMessages = document.getElementById("chatbot-messages");
    const chatBody = document.getElementById("chatbot-body");
    const chatContainer = document.getElementById("chatbot-container");

    requestAnimationFrame(() => {
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatMessages.style.minHeight = chatMessages.style.height;
      }
      if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
      if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
    });
  },

  /*
  Add a message to the chat.
  */
  async addMessageToChat(sender: "user" | "bot", message: string) {
    console.debug("Adding message from:", sender);
    const chatMessages = document.getElementById("chatbot-messages");

    if (!chatMessages) {
      console.warn("Chat messages element not found");
      return;
    }

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("messageBubble-container");

    const avatarImg = document.createElement("img");
    avatarImg.classList.add("avatarImg");

    const messageBubble = document.createElement("div");
    messageBubble.classList.add("messageBubble");

    // Parse any Emoji or Markdown and sanitize
    const messageWithEmojis = emojify(message);
    const htmlMessage = DOMPurify.sanitize(
      await marked.parse(messageWithEmojis)
    );
    messageBubble.innerHTML = htmlMessage;

    if (sender === "user") {
      messageContainer.classList.add("flex-row");
      avatarImg.src = "/images/user.png";
      avatarImg.classList.add("avatarImg-left");
      messageBubble.classList.add("messageBubble-left");
    } else {
      messageContainer.classList.add("flex-row-reverse");
      avatarImg.src = "/images/support.png";
      messageBubble.classList.add("messageBubble-right");
      avatarImg.classList.add("avatarImg-right");
    }

    messageContainer.appendChild(avatarImg);
    messageContainer.appendChild(messageBubble);
    chatMessages.appendChild(messageContainer);
    this.scrollToBottom();
  },

  /*
  Send a message to the chatbot API.
  */
  async sendMessage(chatbotAPI: string, message: string) {
    console.debug("Sending message to ChatBot API:", message);
    let reply = null;
    let error = null;

    try {
      const response = await fetch(chatbotAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({message}),
      });

      if (!response.ok) {
        error = `HTTP error! status: ${response.status}`;
      } else {
        const data = await response.json();
        if (data.error) {
          error = data.error;
        }

        if (data.reply) {
          reply = data.reply;
        } else {
          reply = "No response from chatbot";
        }
      }

      // Return the reply from the chatbot API and an error if there is one.
      return {reply: reply, error: error};
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

      console.error("Error in sendMessage:", error);

      return {reply, error: errorMessage};
    }
  },

  /*
  Show the loading spinner.
  */
  async showLoader() {
    console.debug("Showing loading spinner ₿...");
    const loader = document.getElementById("chatbot-loading-spinner");
    if (loader) {
      loader.classList.add("show");
      loader.classList.remove("hide");
    } else {
      console.warn("Spinning loader not found");
    }
  },

  /*
  Hide the loading spinner.
  */
  hideLoader() {
    console.debug("Hiding loader spinner ₿...");
    const loader = document.getElementById("chatbot-loading-spinner");
    if (loader) {
      loader.classList.remove("show");
      loader.classList.add("hide");
    } else {
      console.warn("Spinning loader not found");
    }
  },

  /*
  Fetch an outage quote from the API and display it in the chat
  in the event of an outage.
  */
  async fetchOutageQuote() {
    try {
      const url = new URL("/api/outage", window.location.origin);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const quotes = await response.json();

      if (!Array.isArray(quotes) || quotes.length === 0) {
        throw new Error("Invalid outage quote data: not an array or empty.");
      }

      const randomIndex = Math.floor(Math.random() * quotes.length);
      return quotes[randomIndex];
    } catch (error) {
      console.error("Failed to fetch outage quote:", error);
      return null;
    }
  },

  /*
  Setup the send button.
  */
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

      try {
        // First, add the user message to the chat window.
        await ChatbotUtils.addMessageToChat.call(ChatbotUtils, "user", message);

        // Then show a typing indicator to show the user something is happening.
        ChatbotUtils.toggleTypingIndicator(true);

        if (config.debug === true) {
          console.warn("START: Simulating slow AI response...");
          // Introduce an artificial delay to simulate a slow response from the AI backend.
          await new Promise((resolve) => setTimeout(resolve, 5000));
          console.warn("END: Simulating slow AI response...");
        }

        // Then try to send message to the chatbot API.
        const {reply, error} = await ChatbotUtils.sendMessage.call(
          ChatbotUtils,
          chatbotAPI,
          message
        );

        // Then add the reply to the chat window if there is one.
        if (reply) {
          await ChatbotUtils.addMessageToChat.call(ChatbotUtils, "bot", reply);
        }

        // If there was an error, send the error to the console
        // but send an outage quote to the chat window for the lols.
        if (error) {
          console.error("Error during message send:", error);
          const outageQuote = await ChatbotUtils.fetchOutageQuote();
          if (outageQuote) {
            await ChatbotUtils.addMessageToChat.call(
              ChatbotUtils,
              "bot",
              outageQuote
            );
          } else {
            console.warn("Failed to obtain outage quote");
            await ChatbotUtils.addMessageToChat.call(
              ChatbotUtils,
              "bot",
              "Ron Jay is currently experiencing technical difficulties."
            );
          }
        }
      } catch (error: unknown) {
        console.error("Error sending message:", error);

        // First, hide the typing indicator.
        ChatbotUtils.toggleTypingIndicator(false);

        // Then, add an error message to the chat window.
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        ChatbotUtils.addMessageToChat.call(
          ChatbotUtils,
          "bot",
          `Sorry degen, the chatbot service is currently unavailable. (${errorMessage})`
        );

        const outageQuote = await ChatbotUtils.fetchOutageQuote();
        if (outageQuote) {
          await ChatbotUtils.addMessageToChat.call(
            ChatbotUtils,
            "bot",
            outageQuote
          );
        }
      } finally {
        // Finally, hide the typing indicator and re-enable the input box.
        ChatbotUtils.toggleTypingIndicator(false);
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
