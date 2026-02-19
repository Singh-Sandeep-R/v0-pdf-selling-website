import fs from 'fs';
import path from 'path';

const booksDir = path.join(process.cwd(), 'data', 'books');

console.log("Checking data/books/ directory...");
console.log("Path:", booksDir);
console.log("Exists:", fs.existsSync(booksDir));

if (fs.existsSync(booksDir)) {
  const files = fs.readdirSync(booksDir);
  console.log("Files found:", files.length);
  
  for (const file of files) {
    const filePath = path.join(booksDir, file);
    const stats = fs.statSync(filePath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    const sizeKB = (stats.size / 1024).toFixed(2);
    
    // Read first 5 bytes to check PDF signature
    const fd = fs.openSync(filePath, 'r');
    const header = Buffer.alloc(5);
    fs.readSync(fd, header, 0, 5, 0);
    fs.closeSync(fd);
    const headerStr = header.toString('ascii');
    const isPDF = headerStr === '%PDF-';
    
    console.log(`\n  File: ${file}`);
    console.log(`  Size: ${sizeKB} KB (${sizeMB} MB)`);
    console.log(`  Header: "${headerStr}"`);
    console.log(`  Valid PDF: ${isPDF}`);
  }
} else {
  console.log("ERROR: data/books/ directory does not exist!");
}
