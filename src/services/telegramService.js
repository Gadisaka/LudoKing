// Telegram WebApp integration service
class TelegramService {
  constructor() {
    this.isTelegramWebApp = false;
    this.userData = null;
    this.initialized = false;
  }

  // Initialize Telegram WebApp
  init() {
    try {
      // Check if we're running inside Telegram WebApp
      if (window.Telegram && window.Telegram.WebApp) {
        this.isTelegramWebApp = true;
        const webApp = window.Telegram.WebApp;

        // Initialize the WebApp
        webApp.ready();

        // Get user data
        const initData = webApp.initDataUnsafe;
        if (initData && initData.user) {
          this.userData = {
            id: initData.user.id,
            username: initData.user.username || null,
            first_name: initData.user.first_name || null,
            last_name: initData.user.last_name || null,
            language_code: initData.user.language_code || "en",
          };

          console.log("📱 Telegram user data captured:", this.userData);

          // Send user data to backend
          this.registerUser();
        } else {
          console.log("📱 Telegram WebApp detected but no user data available");
        }

        this.initialized = true;
      } else {
        console.log("📱 Not running in Telegram WebApp environment");
        this.initialized = true;
      }
    } catch (error) {
      console.error("❌ Error initializing Telegram service:", error);
      this.initialized = true;
    }
  }

  // Register user with backend
  async registerUser() {
    if (!this.userData || !this.isTelegramWebApp) {
      return;
    }

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:4002"
        }/api/save-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegramId: this.userData.id,
            username: this.userData.username,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        console.log("✅ Telegram user registered successfully:", result);
      } else {
        console.warn("⚠️ Failed to register Telegram user:", result.message);
      }
    } catch (error) {
      console.error("❌ Error registering Telegram user:", error);
    }
  }

  // Get user data
  getUserData() {
    return this.userData;
  }

  // Check if running in Telegram
  isInTelegram() {
    return this.isTelegramWebApp;
  }

  // Check if initialized
  isReady() {
    return this.initialized;
  }

  // Show main button (if in Telegram)
  showMainButton(text, onClick) {
    if (this.isTelegramWebApp && window.Telegram.WebApp.MainButton) {
      const mainButton = window.Telegram.WebApp.MainButton;
      mainButton.setText(text);
      mainButton.onClick(onClick);
      mainButton.show();
    }
  }

  // Hide main button
  hideMainButton() {
    if (this.isTelegramWebApp && window.Telegram.WebApp.MainButton) {
      window.Telegram.WebApp.MainButton.hide();
    }
  }

  // Show back button (if in Telegram)
  showBackButton(onClick) {
    if (this.isTelegramWebApp && window.Telegram.WebApp.BackButton) {
      const backButton = window.Telegram.WebApp.BackButton;
      backButton.onClick(onClick);
      backButton.show();
    }
  }

  // Hide back button
  hideBackButton() {
    if (this.isTelegramWebApp && window.Telegram.WebApp.BackButton) {
      window.Telegram.WebApp.BackButton.hide();
    }
  }

  // Close WebApp
  close() {
    if (this.isTelegramWebApp && window.Telegram.WebApp.close) {
      window.Telegram.WebApp.close();
    }
  }

  // Expand WebApp
  expand() {
    if (this.isTelegramWebApp && window.Telegram.WebApp.expand) {
      window.Telegram.WebApp.expand();
    }
  }

  // Send data to bot
  sendData(data) {
    if (this.isTelegramWebApp && window.Telegram.WebApp.sendData) {
      window.Telegram.WebApp.sendData(JSON.stringify(data));
    }
  }

  // Show alert
  showAlert(message) {
    if (this.isTelegramWebApp && window.Telegram.WebApp.showAlert) {
      window.Telegram.WebApp.showAlert(message);
    } else {
      alert(message);
    }
  }

  // Show confirm
  showConfirm(message, callback) {
    if (this.isTelegramWebApp && window.Telegram.WebApp.showConfirm) {
      window.Telegram.WebApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      if (callback) callback(result);
    }
  }
}

// Create singleton instance
const telegramService = new TelegramService();

export default telegramService;
