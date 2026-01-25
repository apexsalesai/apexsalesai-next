// Log rotation script: archives form-submissions.log monthly
const fs = require('fs');
const path = require('path');

const logPath = path.join(__dirname, 'form-submissions.log');
const now = new Date();
const archiveName = `form-submissions-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}.log`;
const archivePath = path.join(__dirname, archiveName);

if (fs.existsSync(logPath)) {
  fs.renameSync(logPath, archivePath);
  fs.writeFileSync(logPath, '');
  console.log(`Archived log to ${archiveName}`);
} else {
  console.log('No log file to rotate.');
}
