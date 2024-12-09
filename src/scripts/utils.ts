/*
#########################
Common Utilities
#########################
*/

import type {ChatbotConfig} from "./types";

export const ChatbotUtils = {
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

    const scriptUrl = new URL(scriptTag.src);
    return {
      type: scriptTag.dataset.chatbotType,
      baseUrl: scriptUrl.origin,
      apiVersion: scriptTag.dataset.chatbotApiVersion,
      apiBackend: scriptTag.dataset.chatbotApiBackend,
      style: scriptTag.dataset.chatbotStyle,
      showButton: scriptTag.dataset.chatbotShowButton,
      enableLoadingSpinner: scriptTag.dataset.chatbotEnableLoadingSpinner,
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
    const chatbotURL = `${config.baseUrl}/api/${config.apiVersion}/${config.apiBackend}`;
    console.debug("Chatbot API URL:", chatbotURL);
    return chatbotURL;
  },

  /*
  Toggle Typing Indicator toggles the typing indicator.
  */
  toggleTypingIndicator(show: boolean) {
    const chatMessages = document.getElementById("chatbot-messages");
    const existingIndicator = document.getElementById("typing-indicator");
    const inputElement = document.getElementById(
      "chatbot-input"
    ) as HTMLInputElement;

    if (!inputElement || !chatMessages) {
      console.warn("Required chat elements not found");
      return;
    }

    if (existingIndicator) {
      existingIndicator.remove();
    }

    inputElement.placeholder = show
      ? "Ron Jay is typing..."
      : "Enter your message for Ron";

    if (show) {
      const typingIndicator = document.createElement("div");
      typingIndicator.id = "typing-indicator";
      typingIndicator.className = "messageBubble-container flex-row-reverse";

      const dotsContainer = document.createElement("div");
      dotsContainer.className = "typing-indicator";

      for (let i = 0; i < 3; i++) {
        dotsContainer.appendChild(document.createElement("span"));
      }

      const avatarImg = document.createElement("img");
      avatarImg.src = "/images/support.png";
      avatarImg.className = "avatarImg avatarImg-right";

      typingIndicator.appendChild(avatarImg);
      typingIndicator.appendChild(dotsContainer);
      chatMessages.appendChild(typingIndicator);

      this.scrollToBottom();
    }
  },

  /*
  Setup Common Event Listeners.
  */
  setupCommonEventListeners(container: HTMLElement, config: ChatbotConfig) {
    console.debug("Setting up event listeners...");
    const chatbotAPI = this.constructChatbotAPI(config);
    if (!chatbotAPI) {
      console.error("Chatbot API URL is not set");
      return;
    }

    // Handle form submission
    const form = container.querySelector("#chatbot-input-form");
    if (!form) {
      console.error("Chat input form not found");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.debug("Form submitted");

      const input = form.querySelector("#chatbot-input") as HTMLInputElement;
      if (!input) {
        console.error("Chat input not found");
        return;
      }

      const message = input.value.trim();
      if (!message) return;

      input.value = "";
      input.disabled = true;

      // Add user message and show typing indicator
      this.addMessageToChat("user", message);
      this.toggleTypingIndicator(true);

      try {
        await this.sendMessage(chatbotAPI, message);
      } catch (error) {
        console.error("Error sending message:", error);
        this.addMessageToChat(
          "bot",
          "Sorry, there was an error sending your message."
        );
      } finally {
        this.toggleTypingIndicator(false);
        input.disabled = false;
        input.focus();
      }
    });

    /*
    Handle when the user presses the Enter key.
    */
    const input = container.querySelector("#chatbot-input");
    if (input) {
      input.addEventListener("keypress", (e: Event) => {
        const keyEvent = e as KeyboardEvent;
        if (keyEvent.key === "Enter" && !keyEvent.shiftKey) {
          e.preventDefault();
          const sendButton = container.querySelector("#chatbot-send-button");
          if (sendButton) {
            (sendButton as HTMLElement).click();
          }
        }
      });
    }
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
  addMessageToChat(sender: "user" | "bot", message: string) {
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
    messageBubble.innerHTML = message.replace(/\n/g, "<br/>");
    messageBubble.classList.add("messageBubble");

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
    console.debug("Sending message:", message);
    const friendlyMessage =
      "Sorry degen, the chatbot service is currently unavailable.";

    try {
      const response = await fetch(chatbotAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({message}),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      this.addMessageToChat("bot", data.reply || "No response from chatbot");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Error in sendMessage:", error);
      this.addMessageToChat("bot", `${friendlyMessage} (${errorMessage})`);
      const outageQuote = await this.fetchOutageQuote();
      if (outageQuote) {
        this.addMessageToChat("bot", outageQuote);
      } else {
        console.warn("Failed to obtain outage quote");
        this.addMessageToChat(
          "bot",
          "Ron Jay is currently experiencing technical difficulties."
        );
      }
    }
  },

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
};
