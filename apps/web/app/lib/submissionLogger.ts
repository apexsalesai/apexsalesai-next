import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), 'form-submissions.log');

export type SubmissionLogEntry = {
  timestamp: string;
  endpoint: string;
  data: any;
  success: boolean;
  error?: string;
};

export function logSubmission(entry: SubmissionLogEntry) {
  const logLine = JSON.stringify(entry) + '\n';
  fs.appendFile(LOG_PATH, logLine, err => {
    if (err) {
      // Optionally: send a Teams notification for logging failure
      // (not implemented here to avoid recursion)
      console.error('Failed to log submission:', err);
    }
  });
}
