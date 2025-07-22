interface LogLevel {
  ERROR: "error";
  WARN: "warn";
  INFO: "info";
  DEBUG: "debug";
}

const LOG_LEVELS: LogLevel = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
};

class Logger {
  private isDevelopment = __DEV__;

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (data) {
      return `${prefix} ${message} ${JSON.stringify(data, null, 2)}`;
    }
    return `${prefix} ${message}`;
  }

  error(message: string, data?: any) {
    const formattedMessage = this.formatMessage(
      LOG_LEVELS.ERROR,
      message,
      data
    );
    console.error(formattedMessage);

    // In production, you might want to send to crash reporting service
    if (!this.isDevelopment) {
      // Example: Crashlytics.recordError(new Error(formattedMessage));
    }
  }

  warn(message: string, data?: any) {
    const formattedMessage = this.formatMessage(LOG_LEVELS.WARN, message, data);
    console.warn(formattedMessage);
  }

  info(message: string, data?: any) {
    const formattedMessage = this.formatMessage(LOG_LEVELS.INFO, message, data);
    console.info(formattedMessage);
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage(
        LOG_LEVELS.DEBUG,
        message,
        data
      );
      console.log(formattedMessage);
    }
  }

  // API request/response logging
  apiRequest(method: string, url: string, data?: any) {
    this.info(`API Request: ${method} ${url}`, data);
  }

  apiResponse(method: string, url: string, status: number, data?: any) {
    this.info(`API Response: ${method} ${url} - ${status}`, data);
  }

  apiError(method: string, url: string, error: any) {
    this.error(`API Error: ${method} ${url}`, error);
  }

  // WebSocket logging
  wsConnect(url: string) {
    this.info(`WebSocket Connected: ${url}`);
  }

  wsDisconnect(url: string) {
    this.info(`WebSocket Disconnected: ${url}`);
  }

  wsMessage(type: string, data?: any) {
    this.debug(`WebSocket Message: ${type}`, data);
  }

  wsError(error: any) {
    this.error("WebSocket Error", error);
  }

  // User action logging
  userAction(action: string, data?: any) {
    this.info(`User Action: ${action}`, data);
  }

  // Navigation logging
  navigation(from: string, to: string) {
    this.debug(`Navigation: ${from} -> ${to}`);
  }
}

export const logger = new Logger();
export default logger;
