import { format } from 'date-fns';

// Dynamic imports for server-side only modules
let fs: any;
let path: any;

try {
  fs = require('fs');
  path = require('path');
} catch (e) {
  // Client-side fallback - no file system access
  console.warn('ErrorLogger: File system access not available in client environment');
}

/**
 * Error Logger Utility for Apex AI Revenue Operator
 * Tracks automation failures, process stalls, and other critical errors
 */
export class ErrorLogger {
  private static logDir = path.join(process.cwd(), 'logs');
  private static windsurfLogFile = path.join(ErrorLogger.logDir, 'windsurf-errors.log');
  private static systemLogFile = path.join(ErrorLogger.logDir, 'system-errors.log');

  /**
   * Initialize the error logger
   */
  static initialize() {
    // Ensure log directory exists
    if (!fs.existsSync(ErrorLogger.logDir)) {
      fs.mkdirSync(ErrorLogger.logDir, { recursive: true });
    }

    // Create log files if they don't exist
    [ErrorLogger.windsurfLogFile, ErrorLogger.systemLogFile].forEach(file => {
      if (!fs.existsSync(file)) {
        fs.writeFileSync(file, '# Error Log\n\n', 'utf8');
      }
    });

    // Set up global error handler
    process.on('uncaughtException', (error) => {
      ErrorLogger.logSystemError('Uncaught Exception', error);
    });

    process.on('unhandledRejection', (reason, promise) => {
      ErrorLogger.logSystemError('Unhandled Rejection', reason as Error);
    });
  }

  /**
   * Log a Windsurf automation error
   * @param source Source of the error (component name)
   * @param message Error message
   * @param details Additional error details
   */
  static logWindsurfError(source: string, message: string, details?: any) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logEntry = `[${timestamp}] [${source}] ERROR: ${message}\n${details ? JSON.stringify(details, null, 2) : ''}\n\n`;
    
    fs.appendFileSync(ErrorLogger.windsurfLogFile, logEntry, 'utf8');
    console.error(`Windsurf Error [${source}]: ${message}`);
  }

  /**
   * Log a system error
   * @param source Source of the error (component name)
   * @param error Error object
   */
  static logSystemError(source: string, error: Error) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logEntry = `[${timestamp}] [${source}] ERROR: ${error.message}\n${error.stack || ''}\n\n`;
    
    fs.appendFileSync(ErrorLogger.systemLogFile, logEntry, 'utf8');
    console.error(`System Error [${source}]: ${error.message}`);
  }

  /**
   * Log a process stall or timeout
   * @param process Name of the process that stalled
   * @param duration Duration in milliseconds before timeout
   * @param context Additional context about the stalled process
   */
  static logProcessStall(process: string, duration: number, context?: any) {
    const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const logEntry = `[${timestamp}] [${process}] STALL: Process stalled after ${duration}ms\n${context ? JSON.stringify(context, null, 2) : ''}\n\n`;
    
    fs.appendFileSync(ErrorLogger.windsurfLogFile, logEntry, 'utf8');
    console.warn(`Process Stall [${process}]: Stalled after ${duration}ms`);
  }

  /**
   * Get all Windsurf errors
   * @returns Array of error entries
   */
  static getWindsurfErrors(): string[] {
    if (!fs.existsSync(ErrorLogger.windsurfLogFile)) {
      return [];
    }

    const content = fs.readFileSync(ErrorLogger.windsurfLogFile, 'utf8');
    return content.split('\n\n').filter(entry => entry.trim().length > 0);
  }

  /**
   * Get all system errors
   * @returns Array of error entries
   */
  static getSystemErrors(): string[] {
    if (!fs.existsSync(ErrorLogger.systemLogFile)) {
      return [];
    }

    const content = fs.readFileSync(ErrorLogger.systemLogFile, 'utf8');
    return content.split('\n\n').filter(entry => entry.trim().length > 0);
  }
}

// Initialize the error logger
ErrorLogger.initialize();
