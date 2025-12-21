const fs = require('fs');
const path = require('path');

const dirsToDelete = [
  path.join(__dirname, 'app', 'api', 'auth', '[...nextauth]'),
];

dirsToDelete.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log(`✓ Deleted: ${dir}`);
  } else {
    console.log(`○ Not found: ${dir}`);
  }
});

console.log('\n✅ NextAuth directory removed!');
