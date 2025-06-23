(function () {
  "use strict";

  // Prevent multiple initialization
  if (window.AcademicChatbotEmbedded) return;
  window.AcademicChatbotEmbedded = true;

  // Default configuration
  const defaultConfig = {
    apiUrl: "YOUR_API_URL_HERE", // Ganti dengan URL API Anda
    title: "🎓 Academic Chatbot",
    subtitle: "TRPL Information Assistant",
    welcomeMessage:
      "Halo! Saya dapat membantu Anda dengan informasi seputar TRPL, dosen, mahasiswa, magang, skripsi, dan lainnya.",
    quickQuestions: [
      "Apa itu program TRPL?",
      "Siapa saja dosen TRPL?",
      "Bagaimana cara mengajukan magang?",
      "Informasi tentang skripsi",
      "RPS mata kuliah",
    ],
    position: "bottom-right",
    primaryColor: "#87CEEB",
    secondaryColor: "#4682B4",
    theme: "light",
  };

  // Merge with user config
  const userConfig = window.AcademicChatbotConfig || {};
  const config = { ...defaultConfig, ...userConfig };

  // Inject CSS
  const css = `
                /* Academic Chatbot Widget Styles */
                .academic-chatbot-widget {
                    position: fixed;
                    ${
                      config.position === "bottom-left"
                        ? "bottom: 20px; left: 20px;"
                        : "bottom: 20px; right: 20px;"
                    }
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .academic-chatbot-widget * {
                    box-sizing: border-box;
                }

                /* Chat Button */
                .acw-chat-button {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, ${
                      config.primaryColor
                    }, ${config.secondaryColor});
                    border: none;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    position: relative;
                }

                .acw-chat-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(0,0,0,0.2);
                }

                .acw-chat-button svg {
                    width: 24px;
                    height: 24px;
                    fill: white;
                }

                /* Notification Badge */
                .acw-notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ff4757;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                }

                /* Chat Window */
                .acw-chat-window {
                    position: absolute;
                    bottom: 80px;
                    ${
                      config.position === "bottom-left"
                        ? "left: 0;"
                        : "right: 0;"
                    }
                    width: 350px;
                    height: 500px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    animation: acwSlideUp 0.3s ease;
                }

                .acw-chat-window.active {
                    display: flex;
                }

                @keyframes acwSlideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Chat Header */
                .acw-chat-header {
                    background: linear-gradient(90deg, ${
                      config.primaryColor
                    }, ${config.secondaryColor});
                    color: white;
                    padding: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .acw-chat-header h3 {
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                }

                .acw-chat-header .subtitle {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-top: 2px;
                }

                .acw-close-btn {
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                /* Chat Messages */
                .acw-chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 15px;
                    background: #f8f9fa;
                }

                .acw-message {
                    margin-bottom: 15px;
                    animation: acwFadeIn 0.3s ease;
                }

                .acw-message.user {
                    text-align: right;
                }

                .acw-message-bubble {
                    display: inline-block;
                    max-width: 80%;
                    padding: 10px 14px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                }

                .acw-message.user .acw-message-bubble {
                    background: #E6F3FF;
                    border: 1px solid ${config.primaryColor};
                    border-radius: 18px 18px 5px 18px;
                }

                .acw-message.bot .acw-message-bubble {
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 18px 18px 18px 5px;
                }

                .acw-message-time {
                    font-size: 11px;
                    color: #888;
                    margin-top: 5px;
                }

                /* Typing Indicator */
                .acw-typing-indicator {
                    display: flex;
                    align-items: center;
                    padding: 10px 14px;
                    background: white;
                    border: 1px solid #e0e0e0;
                    border-radius: 18px 18px 18px 5px;
                    max-width: 80px;
                }

                .acw-typing-dots {
                    display: flex;
                    gap: 4px;
                }

                .acw-typing-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: ${config.secondaryColor};
                    animation: acwTypingAnimation 1.4s infinite ease-in-out;
                }

                .acw-typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .acw-typing-dot:nth-child(2) { animation-delay: -0.16s; }

                @keyframes acwTypingAnimation {
                    0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
                    40% { transform: scale(1); opacity: 1; }
                }

                @keyframes acwFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Chat Input */
                .acw-chat-input {
                    padding: 15px;
                    background: white;
                    border-top: 1px solid #e0e0e0;
                    display: flex;
                    gap: 10px;
                }

                .acw-chat-input input {
                    flex: 1;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    padding: 10px 16px;
                    font-size: 14px;
                    outline: none;
                    transition: border-color 0.2s ease;
                }

                .acw-chat-input input:focus {
                    border-color: ${config.primaryColor};
                }

                .acw-send-btn {
                    background: linear-gradient(90deg, ${
                      config.primaryColor
                    }, ${config.secondaryColor});
                    border: none;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .acw-send-btn:hover {
                    transform: scale(1.05);
                }

                .acw-send-btn svg {
                    width: 16px;
                    height: 16px;
                    fill: white;
                }

                /* Welcome Message */
                .acw-welcome-message {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                }

                .acw-welcome-message h4 {
                    margin: 0 0 10px 0;
                    color: ${config.secondaryColor};
                }

                .acw-welcome-message p {
                    margin: 0;
                    font-size: 14px;
                    line-height: 1.4;
                }

                /* Quick Questions */
                .acw-quick-questions {
                    padding: 0 15px 15px;
                }

                .acw-quick-question-btn {
                    display: block;
                    width: 100%;
                    background: #f8f9fa;
                    border: 1px solid #e0e0e0;
                    border-radius: 8px;
                    padding: 8px 12px;
                    margin-bottom: 8px;
                    font-size: 13px;
                    cursor: pointer;
                    text-align: left;
                    transition: all 0.2s ease;
                }

                .acw-quick-question-btn:hover {
                    background: #E6F3FF;
                    border-color: ${config.primaryColor};
                }

                /* Responsive */
                @media (max-width: 480px) {
                    .acw-chat-window {
                        width: calc(100vw - 40px);
                        height: calc(100vh - 100px);
                        bottom: 80px;
                        ${
                          config.position === "bottom-left"
                            ? "left: 20px;"
                            : "right: 20px;"
                        }
                    }
                }

                /* Powered by */
                .acw-powered-by {
                    text-align: center;
                    padding: 10px;
                    font-size: 11px;
                    color: #888;
                    border-top: 1px solid #e0e0e0;
                    background: #f8f9fa;
                }

                .acw-powered-by a {
                    color: ${config.secondaryColor};
                    text-decoration: none;
                }
            `;

  // Inject styles
  const styleSheet = document.createElement("style");
  styleSheet.textContent = css;
  document.head.appendChild(styleSheet);

  // Widget Class
  class AcademicChatbotWidget {
    constructor(config) {
      this.config = config;
      this.isOpen = false;
      this.messages = [];
      this.userId = this.generateUserId();

      this.init();
    }

    generateUserId() {
      const stored = localStorage.getItem("acw_user_id");
      if (stored) return stored;

      const userId = "acw_" + Math.random().toString(36).substr(2, 8);
      localStorage.setItem("acw_user_id", userId);
      return userId;
    }

    init() {
      this.createWidget();
      this.attachEventListeners();
    }

    createWidget() {
      const widget = document.createElement("div");
      widget.className = "academic-chatbot-widget";
      widget.innerHTML = `
                        <div class="acw-chat-window" id="acwChatWindow">
                            <div class="acw-chat-header">
                                <div>
                                    <h3>${this.config.title}</h3>
                                    <div class="subtitle">${
                                      this.config.subtitle
                                    }</div>
                                </div>
                                <button class="acw-close-btn" id="acwCloseBtn">×</button>
                            </div>
                            
                            <div class="acw-chat-messages" id="acwChatMessages">
                                <div class="acw-welcome-message">
                                    <h4>👋 Welcome!</h4>
                                    <p>${this.config.welcomeMessage}</p>
                                </div>
                                <div class="acw-quick-questions">
                                    ${this.config.quickQuestions
                                      .map(
                                        (q) =>
                                          `<button class="acw-quick-question-btn" data-question="${q}">${q}</button>`
                                      )
                                      .join("")}
                                </div>
                            </div>
                            
                            <div class="acw-chat-input">
                                <input type="text" id="acwMessageInput" placeholder="Type your question...">
                                <button class="acw-send-btn" id="acwSendBtn">
                                    <svg viewBox="0 0 24 24">
                                        <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z"/>
                                    </svg>
                                </button>
                            </div>
                            
                            <div class="acw-powered-by">
                                Powered by <a href="#" target="_blank">Academic Chatbot</a>
                            </div>
                        </div>
                        
                        <button class="acw-chat-button" id="acwChatButton">
                            <svg viewBox="0 0 24 24">
                                <path d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4A2,2 0 0,0 20,2M6,9V7H18V9H6M14,11V13H6V11H14M16,15V17H6V15H16Z"/>
                            </svg>
                            <div class="acw-notification-badge" id="acwNotificationBadge" style="display: none;">1</div>
                        </button>
                    `;

      document.body.appendChild(widget);
    }

    attachEventListeners() {
      const chatButton = document.getElementById("acwChatButton");
      const closeBtn = document.getElementById("acwCloseBtn");
      const sendBtn = document.getElementById("acwSendBtn");
      const messageInput = document.getElementById("acwMessageInput");

      chatButton.addEventListener("click", () => this.toggleChat());
      closeBtn.addEventListener("click", () => this.closeChat());
      sendBtn.addEventListener("click", () => this.sendMessage());

      messageInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.sendMessage();
        }
      });

      // Quick questions
      document.addEventListener("click", (e) => {
        if (e.target.classList.contains("acw-quick-question-btn")) {
          const question = e.target.dataset.question;
          messageInput.value = question;
          this.sendMessage();
        }
      });
    }

    toggleChat() {
      const chatWindow = document.getElementById("acwChatWindow");
      const notificationBadge = document.getElementById("acwNotificationBadge");

      if (this.isOpen) {
        this.closeChat();
      } else {
        chatWindow.classList.add("active");
        this.isOpen = true;
        notificationBadge.style.display = "none";
        document.getElementById("acwMessageInput").focus();
      }
    }

    closeChat() {
      const chatWindow = document.getElementById("acwChatWindow");
      chatWindow.classList.remove("active");
      this.isOpen = false;
    }

    async sendMessage() {
      const messageInput = document.getElementById("acwMessageInput");
      const message = messageInput.value.trim();

      if (!message) return;

      this.addMessage(message, "user");
      messageInput.value = "";

      this.showTypingIndicator();

      try {
        const response = await this.callAPI(message);
        this.hideTypingIndicator();
        this.addMessage(response, "bot");

        this.saveConversation(message, response);
      } catch (error) {
        this.hideTypingIndicator();
        this.addMessage("Maaf, terjadi kesalahan. Silakan coba lagi.", "bot");
        console.error("Academic Chatbot API Error:", error);
      }
    }

    addMessage(text, sender) {
      const messagesContainer = document.getElementById("acwChatMessages");
      const messageDiv = document.createElement("div");
      messageDiv.className = `acw-message ${sender}`;

      const now = new Date();
      const timeString = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      messageDiv.innerHTML = `
                        <div class="acw-message-bubble">${this.formatMessage(
                          text
                        )}</div>
                        <div class="acw-message-time">${timeString}</div>
                    `;

      // Remove quick questions after first message
      if (this.messages.length === 0) {
        const quickQuestions = messagesContainer.querySelector(
          ".acw-quick-questions"
        );
        if (quickQuestions) quickQuestions.remove();
      }

      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      this.messages.push({ text, sender, timestamp: now });

      // Show notification if chat is closed
      if (!this.isOpen && sender === "bot") {
        this.showNotification();
      }
    }

    formatMessage(text) {
      return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
    }

    showTypingIndicator() {
      const messagesContainer = document.getElementById("acwChatMessages");
      const typingDiv = document.createElement("div");
      typingDiv.className = "acw-message bot";
      typingDiv.id = "acwTypingIndicator";
      typingDiv.innerHTML = `
                        <div class="acw-typing-indicator">
                            <div class="acw-typing-dots">
                                <div class="acw-typing-dot"></div>
                                <div class="acw-typing-dot"></div>
                                <div class="acw-typing-dot"></div>
                            </div>
                        </div>
                    `;

      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
      const typingIndicator = document.getElementById("acwTypingIndicator");
      if (typingIndicator) {
        typingIndicator.remove();
      }
    }

    showNotification() {
      const notificationBadge = document.getElementById("acwNotificationBadge");
      notificationBadge.style.display = "flex";
    }

    async callAPI(message) {
      const response = await fetch(`${this.config.apiUrl}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: message,
          user_id: this.userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "Tidak ada respons yang diterima";
    }

    saveConversation(userInput, botResponse) {
      const conversation = {
        user_input: userInput,
        bot_response: botResponse,
        timestamp: new Date().toISOString(),
        user_id: this.userId,
      };

      const conversations = JSON.parse(
        localStorage.getItem("acw_conversations") || "[]"
      );
      conversations.push(conversation);
      localStorage.setItem("acw_conversations", JSON.stringify(conversations));
    }
  }

  // Initialize widget when DOM is ready
  function initWidget() {
    if (window.academicChatbotWidget) return;
    window.academicChatbotWidget = new AcademicChatbotWidget(config);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidget);
  } else {
    initWidget();
  }
})();
