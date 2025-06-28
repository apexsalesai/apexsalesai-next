/**
 * Logger utility for ApexSalesAI
 * 
 * Provides consistent logging across the application with timestamps,
 * log levels, and context information.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  context?: string;
  metadata?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV !== 'production';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log a message with the specified level
   */
  private log(level: LogLevel, message: string, options: LogOptions = {}): void {
    const timestamp = new Date().toISOString();
    const { context = 'app', metadata = {} } = options;
    
    const logEntry = {
      timestamp,
      level,
      context,
      message,
      ...metadata
    };
    
    // In development, log with colors for better readability
    if (this.isDevelopment) {
      const colors = {
        debug: '\x1b[36m', // cyan
        info: '\x1b[32m',  // green
        warn: '\x1b[33m',  // yellow
        error: '\x1b[31m', // red
        reset: '\x1b[0m'   // reset
      };
      
      console.log(
        `${colors[level]}[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}${colors.reset}`,
        Object.keys(metadata).length ? metadata : ''
      );
    } else {
      // In production, log structured JSON for easier parsing
      console.log(JSON.stringify(logEntry));
    }
    
    // Here we could add integration with external logging services
    // like Sentry, LogRocket, etc.
  }

  /**
   * Log debug message
   */
  public debug(message: string, options: LogOptions = {}): void {
    if (this.isDevelopment) {
      this.log('debug', message, options);
    }
  }

  /**
   * Log info message
   */
  public info(message: string, options: LogOptions = {}): void {
    this.log('info', message, options);
  }

  /**
   * Log warning message
   */
  public warn(message: string, options: LogOptions = {}): void {
    this.log('warn', message, options);
  }

  /**
   * Log error message
   */
  public error(message: string, error?: Error, options: LogOptions = {}): void {
    const enhancedOptions = { 
      ...options,
      metadata: {
        ...(options.metadata || {}),
        ...(error ? {
          errorName: error.name,
          errorMessage: error.message,
          stackTrace: error.stack
        } : {})
      }
    };
    
    this.log('error', message, enhancedOptions);
  }

  /**
   * Log agent action with standardized format
   */
  public agentAction(
    actionType: string, 
    status: 'started' | 'completed' | 'failed',
    details: Record<string, any> = {}
  ): void {
    this.log(
      status === 'failed' ? 'error' : 'info',
      `Agent action ${actionType} ${status}`,
      {
        context: 'agent',
        metadata: {
          actionType,
          status,
          ...details
        }
      }
    );
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();

// Example usage:
// logger.info('Server started', { context: 'server', metadata: { port: 3000 } });
// logger.error('Database connection failed', error, { context: 'database' });
// logger.agentAction('lead_qualification', 'completed', { leadId: '123', confidence: 0.95 });
