/*
#########################
Chatbot UI
#########################

This script handles both widget and fullscreen chatbot UIs.

Configuration settings:
- data-chatbot-type: "widget" or "fullscreen"
- data-chatbot-style: "light" or "dark"
- data-chatbot-api-version: API version to use
- data-chatbot-api-backend: AI Backend to use
- data-chatbot-show-button: "true" or "false" (widget only)
- data-chatbot-enable-loading-spinner: "true" or "false" (widget only)

Example Usage for copy/pasta into your HTML:

```html
<!-- Widget -->
<div id="chatbot-container" class="chatbotUI-container">
  <!-- Widget ChatBot gets auto inserted here. -->
</div>
<script
  src="/js/chatbot.js"
  data-chatbot-type="widget"
  data-chatbot-style="light"
  data-chatbot-api-version="v1"
  data-chatbot-api-backend="grok"
  data-chatbot-show-button="true"
  data-chatbot-enable-loading-spinner="true"
  defer
></script>

<!-- Fullscreen -->
<div id="chatbot-container" class="chatbotUI-container">
<!-- Fullscreen ChatBot gets auto inserted here. -->
</div>
<script
  src="/js/chatbot.js"
  data-chatbot-type="fullscreen"
  data-chatbot-style="light"
  data-chatbot-api-version="v1"
  data-chatbot-api-backend="grok"
  data-chatbot-enable-loading-spinner="false"
  defer
></script>
```
*/

console.debug("Loading chatbot.js...");

/*
#########################
Common Utilities
#########################
*/

const ChatbotUtils = {
  /*
  Get Config extracts the configuration data from the script tags.
  */
  getConfig() {
    const scriptTag =
      document.currentScript ||
      document.querySelector('script[src*="chatbot.js"]');

    if (!scriptTag) {
      console.error("Script tag not found. Aborting chatbot load.");
      return null;
    }

    // Verify that the chatbot type is either "widget" or "fullscreen"
    if (!["widget", "fullscreen"].includes(scriptTag.dataset.chatbotType)) {
      console.error("Chatbot type not specified. Aborting chatbot load.");
      return null;
    }

    // Verify that the chatbot style is either "light" or "dark"
    if (!["light", "dark"].includes(scriptTag.dataset.chatbotStyle)) {
      console.error("Chatbot style not specified. Aborting chatbot load.");
      return null;
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
      scriptTag.dataset.chatbotEnableLoadingSpinner = "true";
    }

    const scriptUrl = new URL(scriptTag.src);
    return {
      type: scriptTag.dataset.chatbotType,
      baseUrl: scriptUrl.origin,
      apiVersion: scriptTag.dataset.chatbotApiVersion,
      apiBackend: scriptTag.dataset.chatbotApiBackend,
      style: scriptTag.dataset.chatbotStyle,
      showButton: scriptTag.dataset.chatbotShowButton === "true",
      enableLoadingSpinner:
        scriptTag.dataset.chatbotEnableLoadingSpinner === "true",
    };
  },

  /*
  Construct Chatbot API constructs the chatbot API URL.
  */
  constructChatbotAPI(config) {
    if (!config.apiVersion || !config.apiBackend) {
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
  toggleTypingIndicator(show) {
    const chatMessages = document.getElementById("chatbot-messages");
    const existingIndicator = document.getElementById("typing-indicator");
    const inputElement = document.getElementById("chatbot-input");

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
  setupCommonEventListeners(container) {
    console.debug("Setting up event listeners...");
    const config = ChatbotUtils.getConfig();
    const chatbotAPI = ChatbotUtils.constructChatbotAPI(config);

    // Handle form submission
    const form = container.querySelector("#chatbot-input-form");
    if (!form) {
      console.error("Chat input form not found");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.debug("Form submitted");

      const input = form.querySelector("#chatbot-input");
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
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          const sendButton = container.querySelector("#chatbot-send-button");
          if (sendButton) {
            sendButton.click();
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
  addMessageToChat(sender, message) {
    console.debug("Adding message from:", sender);
    const chatMessages = document.getElementById("chatbot-messages");

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
  async sendMessage(chatbotAPI, message) {
    console.debug("Sending message:", message);
    const friendlyMessage =
      "Sorry degen, the chatbot service is currently unavailable.";

    try {
      const response = await fetch(chatbotAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({ message }),
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
      console.error("Error in sendMessage:", error);
      this.addMessageToChat("bot", `${friendlyMessage} (${error.message})`);
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
    console.debug("Showing spinning loader...");
    const loader = document.getElementById("chatbot-loading-spinner");
    if (loader) {
      loader.classList.add("show");
      loader.classList.remove("hide");
    } else {
      console.warn("Spinning loader not found");
    }
  },

  hideLoader() {
    console.debug("Hiding spinning loader...");
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

/*
#########################
Unified Chatbot
#########################
*/

const Chatbot = {
  async initialize(config) {
    console.debug("Initializing chatbot:", config.type);

    this.container = document.getElementById("chatbot-container");
    if (!this.container) {
      console.error("Chatbot container not found");
      return;
    }

    try {
      // Show a spinning loader if enabled
      if (config.enableLoadingSpinner === "true") {
        await ChatbotUtils.showLoader();
      }

      if (config.type === "widget") {
        this.setupWidget(config);
      } else if (config.type === "fullscreen") {
        this.setupFullscreen(config);
      }

      ChatbotUtils.setupCommonEventListeners.call(ChatbotUtils, this.container);
    } finally {
      // Hide the spinning loader after a timeout if enabled
      if (config.enableLoadingSpinner === "true") {
        setTimeout(() => {
          ChatbotUtils.hideLoader();
        }, 2500);
      }
    }
  },

  setupWidget(config) {
    // Make the container is invisible to start
    this.container.classList.remove("show");
    this.container.classList.add("hide");

    // Create widget HTML structure directly
    this.container.innerHTML = `
      <!-- Chat Widget Container -->
      <div id="chatbot-widget" class="chatbotUI-container--widget hide">
        <div class="chatbotUI-header">
          <h3 class="chatbotUI-title">Chat with Ron</h3>
          <button
            id="chatbot-close-button"
            class="chatbotUI-close-button"
            aria-label="Close chat"
          >×</button>
        </div>

        <div id="chatbot-body" class="chatbotUI-body">
          <div id="chatbot-messages" class="chatbotUI-messages"></div>
        </div>

        <form id="chatbot-input-form" class="chatbotUI-input-form">
          <input
            type="text"
            id="chatbot-input"
            class="chatbotUI-input-box"
            placeholder="Enter your message for Ron"
            aria-label="Chat input"
          />
          <button
            id="chatbot-send-button"
            class="chatbotUI-send-button"
            type="submit"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    `;

    // Setup event listeners
    const toggleButton = document.getElementById("chatbot-toggle");
    const closeButton = document.getElementById("chatbot-close-button");
    const widget = document.getElementById("chatbot-widget");
    const sendButton = document.getElementById("chatbot-send-button");
    const inputBox = document.getElementById("chatbot-input");
    // Setup the toggle button
    if (toggleButton) {
      toggleButton.addEventListener("click", () => {
        toggleButton.classList.toggle("show");
        toggleButton.classList.toggle("hide");
        widget.classList.toggle("show");
        widget.classList.toggle("hide");
        ChatbotUtils.scrollToBottom();
      });
    }

    // Setup the close button
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        toggleButton.classList.toggle("show");
        toggleButton.classList.toggle("hide");
        widget.classList.toggle("show");
        widget.classList.toggle("hide");
      });
    }

    // Setup the send button
    if (sendButton && inputBox) {
      Chatbot.setupSendButton(config, sendButton, inputBox);
    } else {
      console.error("Send button or input box not found");
    }
  },

  setupFullscreen(config) {
    // Make the container is visible
    this.container.classList.remove("hidden");
    this.container.classList.add("show");

    // Create fullscreen HTML structure directly
    this.container.innerHTML = `
      <!-- Fullscreen ChatBot Container -->
      <div id="chatbot-fullscreen" class="chatbotUI-container--fullscreen">
        <div class="chatbotUI-header">
          <h3 class="chatbotUI-title">Chat with Ron</h3>
        </div>

        <div id="chatbot-body" class="chatbotUI-body">
          <div id="chatbot-messages" class="chatbotUI-messages"></div>
        </div>

        <form id="chatbot-input-form" class="chatbotUI-input-form">
          <input
            type="text"
            id="chatbot-input"
            class="chatbotUI-input-box"
            placeholder="Enter your message for Ron"
            aria-label="Chat input"
          />
          <button
            id="chatbot-send-button"
            class="chatbotUI-send-button"
            type="submit"
            aria-label="Send message"
          >
            Send
          </button>
        </form>
      </div>
    `;

    // Setup event listeners
    const sendButton = document.getElementById("chatbot-send-button");
    const inputBox = document.getElementById("chatbot-input");

    // Setup the send button
    if (sendButton && inputBox) {
      Chatbot.setupSendButton(config, sendButton, inputBox);
    } else {
      console.error("Send button or input box not found");
    }
  },

  setupSendButton(config, sendButton, inputBox) {
    // Where are we sending the message?
    const chatbotAPI = ChatbotUtils.constructChatbotAPI(config);

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
      inputBox.addEventListener("keypress", (e) => {
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

/*
#########################
Initialize
#########################
*/

document.addEventListener("DOMContentLoaded", () => {
  const config = ChatbotUtils.getConfig();
  if (!config) return;

  Chatbot.initialize(config);
});
