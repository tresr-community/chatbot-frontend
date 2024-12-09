export interface ChatbotConfig {
  type: "widget" | "fullscreen";
  style: "light" | "dark";
  apiVersion: string;
  apiBackend: string;
  showButton?: boolean;
  enableLoadingSpinner?: boolean;
  baseUrl: string;
}
